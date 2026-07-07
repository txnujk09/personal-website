/**
 * All site content lives in `data/content.json` and is edited through the
 * visual editor at `/admin.html` (which commits changes back to this file).
 *
 * This module just re-exports typed slices of that JSON so the components can
 * keep importing named constants. If you'd rather edit by hand, edit
 * `data/content.json` directly — do not edit the values here.
 */
import content from "@/data/content.json";

export const CONFIG = content.config;
export const NAV_LINKS = content.nav;
export const HERO = content.hero;
export const PILLARS = content.pillars;
export const PACKAGES = content.packages;
export const PRODUCTS = content.products;
export const TESTIMONIALS = content.testimonials;
export const ABOUT = content.about;
export const FAQS = content.faqs;
export const SOCIALS = content.socials;
