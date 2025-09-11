/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: '#1C7C54',
        accent: '#FFB703',
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
