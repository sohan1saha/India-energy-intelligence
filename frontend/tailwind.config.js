/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#090A0F',
          card: '#121620',
          border: '#1E2430',
          text: '#F8FAFC',
          muted: '#94A3B8'
        },
        cream: {
          bg: '#FDFBF7',
          card: '#F4EFE6',
          border: '#E5DDD0',
          text: '#1C1917',
          muted: '#78716C'
        },
        alert: {
          amber: '#D97706',
          red: '#DC2626',
          emerald: '#059669',
          cyan: '#0284C7'
        }
      }
    },
  },
  plugins: [],
}
