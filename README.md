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

**Almost everything you'll want to change lives in [`lib/constants.ts`](lib/constants.ts).**
Prices, package features, product descriptions, testimonials, FAQs, nav links,
and social URLs are all plain data there — no need to touch the components.

## Going live — the checklist

The site ships with **placeholder links** so you can see it working. Before you
launch, wire up real payments:

1. **Booking / mentoring payments** — create a
   [Cal.com](https://cal.com) or [Calendly](https://calendly.com) event type
   with Stripe payment enabled (or a
   [Stripe Payment Link](https://stripe.com/gb/payments/payment-links)). Paste
   the URL into each package's `bookingUrl` in `lib/constants.ts`, and into
   `CONFIG.bookingUrl`.
2. **Digital product payments** — the fastest route is
   [Gumroad](https://gumroad.com) or Stripe Payment Links (both host the
   file/checkout for you). Paste each product URL into its `href` in the
   `PRODUCTS` array.
3. **Newsletter** — `components/Newsletter.tsx` currently just fakes a success
   state. Point the form at your provider (Mailchimp, ConvertKit, Beehiiv,
   Substack) — most give you an embeddable form action URL.
4. **Real copy & prices** — review the testimonials, About paragraphs, and
   prices in `lib/constants.ts` and make them yours.
5. **Images** — add a `public/images/` folder with your photos and swap the grey
   placeholder `<div>`s in the Hero, About, and cards for `next/image`. Add
   `public/favicon.ico` and `public/images/og.jpg` (referenced in
   `app/layout.tsx`).

## Deploy

Push to GitHub and import the repo into [Vercel](https://vercel.com) (zero
config for Next.js), or run `npm run build && npm start` on any Node host.
