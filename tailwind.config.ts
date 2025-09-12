import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', '"Noto Sans"', 'sans-serif'],
        serif: ['var(--font-serif)', '"Noto Serif"', 'serif'],
      },
      borderRadius: {
        '2xl': 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
    },
  },
  plugins: [],
};

export default config;
