/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'accent-red': 'var(--accent-red)',
        'accent-blue': 'var(--accent-blue)',
        'accent-yellow': 'var(--accent-yellow)',
        'accent-green': 'var(--accent-green)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}