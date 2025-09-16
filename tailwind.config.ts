import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx,yaml}'],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '0.5rem',
      DEFAULT: 'var(--radius-xl)',
      md: 'calc(var(--radius-xl) - 0.25rem)',
      lg: 'calc(var(--radius-xl) - 0.125rem)',
      xl: 'var(--radius-xl)',
      '2xl': 'var(--radius-xl)',
      '3xl': 'calc(var(--radius-xl) * 1.4)',
      full: '9999px',
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      fontFamily: {
        sans: ['var(--font-ui)', '"Noto Sans"', 'sans-serif'],
        serif: ['var(--font-title)', '"Noto Serif"', 'serif'],
      },
      fontSize: {
        base: ['1.125rem', { lineHeight: '1.65' }],
        lg: ['1.25rem', { lineHeight: '1.7' }],
        xl: ['1.5rem', { lineHeight: '1.4' }],
      },
      maxWidth: {
        'screen-lg': '64rem',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-ink)',
            '--tw-prose-headings': 'var(--color-ink)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--color-ink)',
            '--tw-prose-quotes': 'var(--color-ink)',
            fontFamily: 'var(--font-ui)',
            h1: {
              fontFamily: 'var(--font-title)',
            },
            h2: {
              fontFamily: 'var(--font-title)',
            },
            h3: {
              fontFamily: 'var(--font-title)',
            },
          },
        },
      },
    },
  },
  plugins: [typography, forms],
};

export default config;
