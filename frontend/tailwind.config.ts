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
          bg: "#BCC5D1",       // Darker slate-grey background (no cream tint)
          card: "#D4DCEC",     // High contrast slate-grey card background
          border: "#7E8C9F",   // Crisp dark slate border
          text: "#0F172A",     // Deep black/navy high-contrast text
          muted: "#334155"    // Readable dark slate text
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
