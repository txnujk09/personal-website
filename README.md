# simplytk — personal mentoring & resources site

A [Next.js 14](https://nextjs.org) personal website for selling **1:1 mentoring**
and **downloadable resources**, plus a free newsletter. Clean, fast, and easy to
edit — all content lives in one file.

## Sections

| Section | What it does | Component |
| --- | --- | --- |
| Hero | Headline + primary CTAs | `components/Hero.tsx` |
| How I help | Overview of the four topic areas | `components/ResourceGrid.tsx` |
| **1:1 Mentoring** | Paid pricing tiers with booking buttons | `components/Mentoring.tsx` |
| **Resources** | Paid digital products with buy buttons | `components/Store.tsx` |
| Testimonials | Social proof | `components/Testimonials.tsx` |
| About | Your story | `components/About.tsx` |
| FAQ | Objection handling | `components/FAQ.tsx` |
| Newsletter | Free email capture | `components/Newsletter.tsx` |

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Then `npm run build` for a production build.

## Editing content

All site content lives in one file: [`data/content.json`](data/content.json) —
hero text, mentoring packages, resources, testimonials, FAQs, About, nav, and
socials. You can edit it two ways:

- **Visual editor (no code):** go to `https://your-site.vercel.app/admin.html`,
  edit in forms, and click **Publish**. See "Content editor" below to switch it on.
- **By hand:** edit `data/content.json` directly and commit.

## Content editor (`/admin.html`)

A password-protected editor that publishes changes straight to your live site.
When you hit **Publish**, it commits `data/content.json` back to GitHub, and
Vercel redeploys automatically (~1 minute).

**Turn it on** by adding four Environment Variables in Vercel
(**Project → Settings → Environment Variables**), then redeploying:

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD` | any password you choose — you'll type it to publish |
| `GH_COMMIT_TOKEN` | a GitHub token with **Contents: Read and write** on this repo |
| `GH_REPO` | `txnujk09/personal-website` |
| `GH_BRANCH` | the branch Vercel deploys (your production branch) |

To create `GH_COMMIT_TOKEN`: GitHub → **Settings → Developer settings →
Fine-grained personal access tokens → Generate new token**, limit it to this one
repository, and give it **Repository permissions → Contents: Read and write**.
Keep it secret; if it ever leaks, revoke and regenerate it.

> The editor page is isolated in `public/`, so it can never break your site's
> build. Until the variables are set, Publish returns a friendly "not configured
> yet" message and the rest of the site works normally.

## Going live — the checklist

The site ships with **placeholder links** so you can see it working. Before you
launch, wire up real payments:

1. **Booking / mentoring payments** — create a
   [Cal.com](https://cal.com) or [Calendly](https://calendly.com) event type
   with Stripe payment enabled (or a
   [Stripe Payment Link](https://stripe.com/gb/payments/payment-links)). Paste
   the URL into each package's `bookingUrl` (in the editor, or in
   `data/content.json`).
2. **Digital product payments** — the fastest route is
   [Gumroad](https://gumroad.com) or Stripe Payment Links (both host the
   file/checkout for you). Paste each product URL into its "Buy link" (the
   `href` field of each product).
3. **Newsletter** — `components/Newsletter.tsx` currently just fakes a success
   state. Point the form at your provider (Mailchimp, ConvertKit, Beehiiv,
   Substack) — most give you an embeddable form action URL.
4. **Real copy & prices** — review the testimonials, About paragraphs, and
   prices via the editor and make them yours.
5. **Images** — add a `public/images/` folder with your photos and swap the grey
   placeholder `<div>`s in the Hero, About, and cards for `next/image`. Add
   `public/favicon.ico` and `public/images/og.jpg` (referenced in
   `app/layout.tsx`).

## Deploy

Push to GitHub and import the repo into [Vercel](https://vercel.com) (zero
config for Next.js), or run `npm run build && npm start` on any Node host.
