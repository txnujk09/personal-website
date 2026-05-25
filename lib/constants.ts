export const NAV_LINKS = [
  { label: "A-Levels & UCAS", href: "#resources" },
  { label: "Imperial EFDS", href: "#resources" },
  { label: "Health", href: "#resources" },
  { label: "Internships", href: "#resources" },
] as const;

export const RESOURCES = [
  {
    title: "A-Levels & UCAS",
    description:
      "{RESOURCE_DESCRIPTION_ALEVELS}",
    image: "/images/card-alevels.jpg",
    href: "#",
  },
  {
    title: "Imperial EFDS",
    description:
      "{RESOURCE_DESCRIPTION_IMPERIAL}",
    image: "/images/card-imperial.jpg",
    href: "#",
  },
  {
    title: "Health",
    description:
      "{RESOURCE_DESCRIPTION_HEALTH}",
    image: "/images/card-health.jpg",
    href: "#",
  },
  {
    title: "Internships",
    description:
      "{RESOURCE_DESCRIPTION_INTERNSHIPS}",
    image: "/images/card-internships.jpg",
    href: "#",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote: "{TESTIMONIAL_QUOTE_1}",
    name: "{TESTIMONIAL_NAME_1}",
    descriptor: "{TESTIMONIAL_DESCRIPTOR_1}",
  },
  {
    quote: "{TESTIMONIAL_QUOTE_2}",
    name: "{TESTIMONIAL_NAME_2}",
    descriptor: "{TESTIMONIAL_DESCRIPTOR_2}",
  },
  {
    quote: "{TESTIMONIAL_QUOTE_3}",
    name: "{TESTIMONIAL_NAME_3}",
    descriptor: "{TESTIMONIAL_DESCRIPTOR_3}",
  },
] as const;

export const SOCIALS = [
  { label: "TikTok", href: "{SOCIAL_TIKTOK_URL}" },
  { label: "Instagram", href: "{SOCIAL_INSTAGRAM_URL}" },
  { label: "LinkedIn", href: "{SOCIAL_LINKEDIN_URL}" },
  { label: "X", href: "{SOCIAL_X_URL}" },
] as const;
