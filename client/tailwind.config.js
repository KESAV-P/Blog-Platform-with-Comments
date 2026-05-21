/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0f0f0f',
          card: '#161616',
          input: '#1d1d1d',
          accent: '#262626'
        },
        cream: {
          light: '#faf8f5',
          DEFAULT: '#f5f0e8',
          dark: '#e7e2d8',
          muted: '#a39f99',
          border: '#33302c'
        },
        amber: {
          light: '#fcd34d',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          deep: '#b45309'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backdropFilter: {
        glass: 'blur(12px)'
      }
    },
  },
  plugins: [],
}
