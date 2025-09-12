/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
        brand: 'var(--color-primary)',
        cream: 'var(--color-paper)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-nunito)', 'sans-serif'],
      },
      borderRadius: {
        '2xl': 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
};
