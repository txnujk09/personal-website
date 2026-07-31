# Content Repurposing Pipeline — Phase 1 Plan

Status: **awaiting confirmation before any code is written.**

## 0. Diagnosis / decisions that need your sign-off

1. **This is not an empty directory.** The session is attached to `personal-website`
   (a Next.js app). Plan: build the pipeline in `content-pipeline/` with its own
   `package.json`, `tsconfig.json`, and `.gitignore` so it stays fully standalone
   and can be `git filter-repo`'d or copied into its own repo later. Run as
   `cd content-pipeline && npx tsx src/index.ts <url-or-path>`.
2. **Schema addition required by your own prompt rules.** You asked for lane tags
   and `fact_flags` on every asset, but the schema in the brief has neither.
   Proposed final schema (deviations marked):

   ```json
   {
     "episode_title": "",
     "x_thread":            { "lane": "", "tweets": ["hook tweet", "..."], "fact_flags": [] },
     "x_standalone_posts":  [ { "lane": "", "text": "", "fact_flags": [] } ],
     "ig_caption":          { "lane": "", "text": "", "fact_flags": [] },
     "shorts_candidates":   [ { "start": "MM:SS", "end": "MM:SS", "lane": "",
                               "hook_line": "", "why_it_works": "", "fact_flags": [] } ],
     "yt_description":      { "lane": "", "text": "", "fact_flags": [] },
     "yt_chapters":         [ { "time": "MM:SS", "title": "" } ]
   }
   ```

   `x_thread` becomes an object (was a bare array), `x_standalone_posts` items and
   `ig_caption`/`yt_description` become objects (were bare strings). If you'd rather
   keep the original flat schema, the alternative is a single top-level
   `fact_flags`/`lanes` section — less useful, but say the word.
3. **`MM:SS` overflows on 60+ minute episodes.** Proposal: `MM:SS` under one hour,
   `H:MM:SS` at or past one hour (YouTube chapters accept both).
4. **`ffmpeg` becomes a dependency only on the >3-hour chunking path** (see §3).
   `yt-dlp` already needs ffmpeg for audio extraction on most systems, so in
   practice this adds nothing new; local-file inputs over 3h without ffmpeg get a
   clear error instead of a crash.

## 1. File tree

```
content-pipeline/
├── PLAN.md              # this file
├── package.json         # deps: @google/genai, dotenv; dev: tsx, typescript, @types/node
├── tsconfig.json
├── .gitignore           # .env, output/, node_modules/, *.m4a tmp audio
├── .env.example         # GEMINI_API_KEY=
├── output/              # <slug>.json bundles (gitignored)
└── src/
    ├── index.ts         # CLI entry: arg parsing, orchestration, pretty-print, save
    ├── ingest.ts        # YouTube-vs-local detection, yt-dlp invocation, slug derivation
    ├── transcribe.ts    # audio → timestamped transcript (inline vs Files API, chunking)
    ├── generate.ts      # transcript → JSON bundle (defensive parse + 1 corrective retry)
    └── prompt.ts        # SYSTEM_PROMPT + TRANSCRIBE_PROMPT, isolated for iteration
```

No other runtime deps. `yt-dlp` and `ffmpeg` are invoked as external binaries via
`child_process`, with an upfront `--version` check and a clear install message if missing.

## 2. Exact Gemini API calls

SDK: **`@google/genai`** (the current official SDK; `@google/generative-ai` is deprecated).
Model: **`gemini-2.5-flash`** for both calls. Key from `.env` → `GEMINI_API_KEY`.

### Call 1 — transcription (audio in, text out)

Audio ≤ ~15 MB → inline base64 (hard request cap is 20 MB, 15 leaves prompt headroom):

```ts
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const res = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    { inlineData: { mimeType: "audio/mp4", data: audioBase64 } },  // m4a
    { text: TRANSCRIBE_PROMPT },  // "verbatim transcript, timestamp marker every ~30s as [H:MM:SS]"
  ],
});
```

Audio > 15 MB → **Files API** (up to 2 GB/file, stored 48h, free):

```ts
const file = await ai.files.upload({ file: audioPath, config: { mimeType: "audio/mp4" } });
// poll ai.files.get({ name: file.name }) until state === "ACTIVE" (a few seconds)
const res = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [createPartFromUri(file.uri, file.mimeType), { text: TRANSCRIBE_PROMPT }],
});
```

### Call 2 — generation (text in, JSON out)

```ts
const res = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [{ text: transcript }],
  config: {
    systemInstruction: SYSTEM_PROMPT,
    responseMimeType: "application/json",   // suppresses fences at the API level
    temperature: 0.8,
  },
});
```

Parsing stays defensive anyway (belt + suspenders): strip ```/```json fences and any
pre/post text around the outermost `{...}`, then `JSON.parse`; on failure, retry **once**
appending the raw bad output plus "Return only valid JSON matching the schema. No fences,
no commentary." Second failure → save raw text to `output/<slug>.raw.txt` and exit 1 with
a pointer to it.

### Token math (why long episodes mostly just work)

| Fact | Number |
|---|---|
| Audio tokenization | ~32 tokens / second, downsampled to 16 kbps mono internally |
| 60-min episode as input | ~115k tokens |
| Gemini 2.5 Flash input window | ~1,048k tokens (≈ 9 hours of audio) |
| Gemini 2.5 Flash **output** cap | 65,536 tokens |
| 60-min transcript as output | ~13–15k tokens — fine |

The binding constraint on long episodes is the **output** cap (the transcript we ask it
to write), not the input window. Dense speech hits 65k output tokens around ~4 hours.

## 3. 60+ minute episodes — chunking strategy

- **60 min – 3 h (the normal podcast case): no chunking.** One Files API upload, one
  transcription call. Input ~115–350k tokens, output transcript well under the 65k cap.
- **> 3 h (or transcription returns `finishReason: MAX_TOKENS`):** split audio with
  ffmpeg (`-c copy`, no re-encode) into ~45-min segments with 15 s overlap; transcribe
  each sequentially; offset each segment's timestamps by its start; drop overlap
  duplicates at the seams; concatenate. The 3 h threshold is checked upfront via
  `ffprobe` duration so we chunk proactively, with MAX_TOKENS as the reactive fallback.
- Generation is never chunked: even a 4 h transcript (~60k tokens) fits one input easily.

Ingest keeps files small to begin with: since Gemini downsamples to 16 kbps mono, high
bitrates are wasted — `yt-dlp -f "ba[abr<=64]/ba/b" -x --audio-format m4a --audio-quality 48K
--no-playlist -o "<tmp>/%(id)s.%(ext)s" --print after_move:filepath -j <url>`. A 60-min
episode lands ~20 MB; a 3 h one ~65 MB — both fine for the Files API.

## 4. Error handling map

| Failure | Behavior |
|---|---|
| `yt-dlp` missing | Checked upfront; exit with install one-liner (`brew install yt-dlp` / `pipx install yt-dlp`) |
| Bad / private / dead URL | Surface yt-dlp's stderr trimmed to the useful line, exit 1 |
| Local path missing / not audio-video | Explicit check before any API call |
| Audio > 15 MB | Warn once, switch to Files API automatically (no user action) |
| Audio > 3 h | Warn, chunk per §3 (requires ffmpeg; clear error if absent) |
| Gemini call fails (5xx / timeout) | One retry with 2 s backoff per call, then exit with the API error message |
| JSON parse fails | One corrective retry per §2, then dump raw output and exit |
| Missing `GEMINI_API_KEY` | Checked at startup, points at `.env.example` |

## 5. Draft system prompt (`src/prompt.ts`)

See the accompanying Phase 1 message for the full draft text (also reproduced here):

```ts
export const SYSTEM_PROMPT = `
You are a content repurposing engine for one specific solo creator. Input: a
timestamped transcript of one episode. Output: exactly one JSON object matching
the schema at the end. No markdown fences, no preamble, no text after the JSON.

## Content lanes
Tag every asset's "lane" with exactly one of:
- "startup_vc"                — startups, fundraising, venture, operating, tech careers
- "health_self_improvement"   — training, sleep, focus, habits, mental models
- "technical_ai"              — models, engineering, AI tooling, applied ML
Choose the lane the asset actually fits based on transcript content, never a
default. If the episode only supports one lane, every asset gets that lane.

## Voice
- Casual, direct, abbreviated. A sharp operator texting a smart friend.
- Short sentences. Cut every word that doesn't earn its place.
- No hedging ("I think", "arguably", "it could be said").
- No corporate or press-release tone.
- At most one emoji per asset; default zero.
- Banned outright: "Let that sink in", "Read that again", "This changes
  everything", "A thread 🧵", "Here's the kicker", "game-changer", "unlock",
  "the best part?", fake-curiosity question hooks, engagement-bait CTAs.

## Style anchors
// STYLE_ANCHORS ─ paste 5–10 top-performing posts per lane between the markers.
// Use them as few-shot references: match their rhythm, hook construction,
// line breaks, and length. Never reuse their content or specific claims.
//
// [startup_vc]
//
// [health_self_improvement]
//
// [technical_ai]
//
// END STYLE_ANCHORS
If the anchor block is empty, rely on the Voice rules alone.

## Grounding — hard rule
Every factual claim (numbers, names, studies, quotes, "X said Y") must be
traceable to the transcript. If the transcript doesn't support it, don't write
it. Never import outside knowledge to sharpen a claim. Each asset carries
"fact_flags": claims a human should verify before posting — stats the speaker
cites from memory, secondhand anecdotes, paraphrases that sharpen the original
wording. Empty array if nothing needs checking.

## Asset requirements
- x_thread: 4–8 tweets, each ≤ 280 chars. Tweet 1 is the hook: concrete and
  specific, states the payoff, no clickbait. Last tweet closes the loop —
  no "follow for more".
- x_standalone_posts: exactly 3, self-contained, three different angles or
  moments from the episode. Not thread fragments.
- ig_caption: 1 caption. First line must work as a hook before the fold.
  Line breaks fine, hashtags max 3, only if genuinely relevant.
- shorts_candidates: 3–5 clips, 20–55 seconds each (end minus start —
  verify the arithmetic). Pick moments with a strong first line, one complete
  idea, and a natural out. "hook_line" is the clip's first spoken line,
  verbatim from the transcript. "why_it_works" is one sentence.
- yt_description: 2–4 short paragraphs. First 2 lines carry the value (that's
  what shows before "more"). No fake links, no invented sponsor copy.
- yt_chapters: cover the whole episode; first entry at "00:00"; titles ≤ 6
  words, descriptive not cute.

## Timestamps
"MM:SS" under one hour, "H:MM:SS" from one hour on. Only use timestamps that
exist in (or interpolate between) the transcript's markers.

## Output schema
{
  "episode_title": "",
  "x_thread":            { "lane": "", "tweets": ["", ""], "fact_flags": [] },
  "x_standalone_posts":  [ { "lane": "", "text": "", "fact_flags": [] } ],
  "ig_caption":          { "lane": "", "text": "", "fact_flags": [] },
  "shorts_candidates":   [ { "start": "", "end": "", "lane": "", "hook_line": "",
                            "why_it_works": "", "fact_flags": [] } ],
  "yt_description":      { "lane": "", "text": "", "fact_flags": [] },
  "yt_chapters":         [ { "time": "", "title": "" } ]
}
Valid JSON only: double quotes, no comments, no trailing commas.
`;

export const TRANSCRIBE_PROMPT = `
Transcribe this audio verbatim. Insert a timestamp marker on its own line in
the form [H:MM:SS] approximately every 30 seconds and at every speaker change.
Label speakers "S1:", "S2:" if more than one voice. Output only the transcript.
`;
```

## 6. Explicitly out of scope (not building ahead)

No database, no UI, no scheduler, no posting integrations, no config system, no
tests beyond what's needed to run the happy path. Phase 2+.
