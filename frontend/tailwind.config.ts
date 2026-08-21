import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#090A0F",
          card: "#12141F",
          border: "#1E2235",
          text: "#E2E8F0",
          muted: "#94A3B8"
        },
        cream: {
          bg: "#E8E4DC",       // Darker, rich warm stone-parchment background
          card: "#F3EFE7",     // High contrast card background
          border: "#B8B2A6",   // Crisp, visible dark border
          text: "#111827",     // Deep high-contrast charcoal text
          muted: "#374151"    // Readable dark-muted text
        },
        alert: {
          red: "#EF4444",
          amber: "#F59E0B",
          emerald: "#10B981",
          cyan: "#06B6D4"
        }
      },
    },
  },
  plugins: [],
};
export default config;
