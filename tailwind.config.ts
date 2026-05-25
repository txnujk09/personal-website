import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#0A0A0A",
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF",
        },
        border: "#E5E7EB",
        surface: "#F9FAFB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
      },
      lineHeight: {
        hero: "1.08",
      },
    },
  },
  plugins: [],
};

export default config;
