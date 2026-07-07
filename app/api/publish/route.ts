import { NextResponse } from "next/server";

/**
 * Commits edited content from the /admin.html editor back to data/content.json
 * on GitHub. Vercel then redeploys automatically, so the live site updates.
 *
 * Required environment variables (set these in the Vercel dashboard):
 *   ADMIN_PASSWORD   – the password you type in the editor to publish
 *   GH_COMMIT_TOKEN  – a GitHub token with "Contents: read & write" on the repo
 *   GH_REPO          – e.g. "txnujk09/personal-website"
 *   GH_BRANCH        – the branch Vercel deploys (your production branch)
 */

const FILE_PATH = "data/content.json";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const token = process.env.GH_COMMIT_TOKEN;
  const repo = process.env.GH_REPO;
  const branch = process.env.GH_BRANCH;

  if (!password || !token || !repo || !branch) {
    return NextResponse.json(
      {
        error:
          "Editor not configured yet. Set ADMIN_PASSWORD, GH_COMMIT_TOKEN, GH_REPO and GH_BRANCH in your Vercel project settings, then redeploy.",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { password: given, content } = (body ?? {}) as {
    password?: string;
    content?: Record<string, unknown>;
  };

  if (given !== password) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  // Light sanity check so we never commit obviously broken content.
  if (
    !content ||
    typeof content !== "object" ||
    !("config" in content) ||
    !Array.isArray((content as Record<string, unknown>).packages) ||
    !Array.isArray((content as Record<string, unknown>).products)
  ) {
    return NextResponse.json(
      { error: "Content looks malformed — nothing was saved." },
      { status: 400 }
    );
  }

  const apiBase = `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "simplytk-admin",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Look up the current file SHA (required by GitHub to update an existing file).
  let sha: string | undefined;
  const getRes = await fetch(
    `${apiBase}?ref=${encodeURIComponent(branch)}`,
    { headers, cache: "no-store" }
  );
  if (getRes.ok) {
    const json = (await getRes.json()) as { sha?: string };
    sha = json.sha;
  } else if (getRes.status !== 404) {
    const text = await getRes.text();
    return NextResponse.json(
      { error: `Could not read the current file from GitHub (${getRes.status}). ${text.slice(0, 200)}` },
      { status: 502 }
    );
  }

  const jsonStr = JSON.stringify(content, null, 2) + "\n";
  const encoded = Buffer.from(jsonStr, "utf-8").toString("base64");

  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Update site content via admin editor",
      content: encoded,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    const text = await putRes.text();
    return NextResponse.json(
      { error: `Publish failed (${putRes.status}). ${text.slice(0, 300)}` },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Published! Your live site will update in about a minute.",
  });
}
