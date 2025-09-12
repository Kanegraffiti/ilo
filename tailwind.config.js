/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Updated to a Duolingo-inspired palette
        brand: '#58CC02',
        accent: '#1CB0F6',
        cream: '#FFF8EF',
        ink: '#0F172A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-nunito)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
