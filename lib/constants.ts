/**
 * Central configuration.
 *
 * Replace the values below with your real links before going live:
 *  - BOOKING_URL   → your Cal.com / Calendly link (with Stripe payment enabled)
 *  - Each package `bookingUrl` and product `href` can point at a Stripe
 *    Payment Link, Gumroad product, or any checkout URL you like.
 *
 * See README.md → "Going live" for the full checklist.
 */
export const CONFIG = {
  name: "Tanuj Kakumani",
  brand: "simplytk",
  email: "hello@simplytk.com",
  // Where "Book a call" buttons point. Use a Cal.com/Calendly link that
  // collects payment up front, or a Stripe Payment Link.
  bookingUrl: "https://cal.com/tanuj",
} as const;

export const NAV_LINKS = [
  { label: "How I help", href: "#help" },
  { label: "Mentoring", href: "#mentoring" },
  { label: "Resources", href: "#store" },
  { label: "FAQ", href: "#faq" },
] as const;

/** The four areas of expertise — shown as an overview grid. */
export const PILLARS = [
  {
    title: "A-Levels & UCAS",
    description:
      "The exact study systems, personal-statement structure, and application strategy I used to get into Imperial. No fluff — just what actually moves the needle on results and offers.",
    href: "#mentoring",
  },
  {
    title: "Imperial & uni life",
    description:
      "An honest insider view of studying at Imperial (EFDS and beyond): choosing modules, managing the workload, societies worth your time, and the things prospectuses never tell you.",
    href: "#mentoring",
  },
  {
    title: "Spring weeks & internships",
    description:
      "How I landed 6+ spring weeks. CV and application reviews, aptitude-test prep, and interview practice for banking, tech, and consulting — from someone who's sat on both sides of the table.",
    href: "#mentoring",
  },
  {
    title: "Health & fitness",
    description:
      "Build a physique you're proud of without wrecking your studies. Simple, sustainable training and nutrition frameworks that fit around a busy student schedule.",
    href: "#store",
  },
] as const;

/**
 * Paid 1:1 mentoring packages.
 * `bookingUrl` should be a checkout or booking link that collects payment.
 */
export const PACKAGES = [
  {
    name: "Kickstarter",
    price: "£45",
    cadence: "one 45-min call",
    description:
      "A single focused 1:1 session. Perfect for a specific question — a personal statement pass, a CV review, or a spring-week game plan.",
    features: [
      "45-minute 1:1 video call",
      "Screen-share review of your CV, PS, or application",
      "Written action list afterwards",
    ],
    highlighted: false,
    cta: "Book a session",
    bookingUrl: "https://cal.com/tanuj/kickstarter",
  },
  {
    name: "Spring Week Sprint",
    price: "£150",
    cadence: "3 sessions",
    description:
      "The complete application push. We build your CV, sharpen every application, and run mock interviews until you're sharp.",
    features: [
      "3 × 45-min 1:1 sessions",
      "Full CV + application rewrite",
      "Mock interview with feedback",
      "Aptitude-test prep resources",
      "Async support over WhatsApp between calls",
    ],
    highlighted: true,
    cta: "Start the sprint",
    bookingUrl: "https://cal.com/tanuj/spring-week-sprint",
  },
  {
    name: "The Full Playbook",
    price: "£399",
    cadence: "3 months",
    description:
      "Ongoing mentoring across A-Levels, UCAS, and internships. Your unfair advantage for the whole cycle.",
    features: [
      "6 × 1:1 sessions over 3 months",
      "Unlimited async support",
      "Every digital resource included",
      "Personal statement & CV done together",
      "Priority booking & fast replies",
    ],
    highlighted: false,
    cta: "Apply now",
    bookingUrl: "https://cal.com/tanuj/full-playbook",
  },
] as const;

/**
 * Digital products / resources.
 * `href` should point at a Stripe Payment Link, Gumroad product, or similar.
 */
export const PRODUCTS = [
  {
    title: "The Spring Week Application Playbook",
    format: "PDF · 40 pages",
    description:
      "The end-to-end system I used to land 6+ spring weeks — CV templates, cover-letter frameworks, and answers to every 'why this firm' question.",
    price: "£19",
    href: "#",
  },
  {
    title: "A-Level A*A*A* Study System",
    format: "Notion template",
    description:
      "My complete revision workflow: spaced-repetition schedules, past-paper trackers, and topic checklists for every subject.",
    price: "£15",
    href: "#",
  },
  {
    title: "UCAS Personal Statement Toolkit",
    format: "PDF + examples",
    description:
      "Structure, opening lines that work, and three annotated statements that won Imperial and Oxbridge offers.",
    price: "£12",
    href: "#",
  },
  {
    title: "Physique Foundations",
    format: "PDF guide",
    description:
      "A no-nonsense training and nutrition guide to build muscle and stay lean while carrying a full student workload.",
    price: "£15",
    href: "#",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Tanuj rewrote my CV and ran two mock interviews with me. Two weeks later I had a spring week offer from a bulge-bracket bank. Genuinely worth every penny.",
    name: "Aarav S.",
    descriptor: "First-year, LSE",
  },
  {
    quote:
      "I was completely lost with my personal statement. One session and a toolkit later, I had a structure I was proud of — and an offer from Imperial.",
    name: "Priya M.",
    descriptor: "A-Level student, London",
  },
  {
    quote:
      "The study system alone took me from BBB predicted to A*AA actual. Tanuj explains things like an older brother who actually knows what he's talking about.",
    name: "James O.",
    descriptor: "Now at Imperial",
  },
] as const;

export const FAQS = [
  {
    q: "Who is this for?",
    a: "Sixth-formers applying through UCAS, and university students chasing spring weeks and internships. If you want a clear plan from someone who's recently done it, you're in the right place.",
  },
  {
    q: "How do the 1:1 sessions work?",
    a: "You book a slot, we meet over video, and we work through your CV, application, or study plan live. You leave every call with a written action list.",
  },
  {
    q: "Do the digital resources come with anything else?",
    a: "Each is a standalone download you keep forever, including future updates. The Full Playbook mentoring package includes every resource for free.",
  },
  {
    q: "What if I'm not sure which option to pick?",
    a: "Start with a Kickstarter session or send me a message. I'll be honest about whether mentoring is worth it for your situation.",
  },
  {
    q: "Are refunds available?",
    a: "Digital products are non-refundable once downloaded. For mentoring, if you're not happy after your first session, I'll refund it — no questions asked.",
  },
] as const;

export const SOCIALS = [
  { label: "TikTok", href: "https://tiktok.com/@simplytk" },
  { label: "Instagram", href: "https://instagram.com/simplytk" },
  { label: "LinkedIn", href: "https://linkedin.com/in/tanujkakumani" },
  { label: "X", href: "https://x.com/simplytk" },
] as const;
