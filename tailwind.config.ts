import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx,yaml}'],
  theme: {
    extend: {
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
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        paper: 'var(--paper)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        'on-primary': 'var(--on-primary)',
        'on-secondary': 'var(--on-secondary)',
        'on-accent': 'var(--on-accent)',
        'on-paper': 'var(--on-paper)',
        'on-surface-1': 'var(--on-surface-1)',
        'on-surface-2': 'var(--on-surface-2)',
        'on-surface-3': 'var(--on-surface-3)',
        border: 'var(--border)',
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
            '--tw-prose-body': 'var(--on-paper)',
            '--tw-prose-headings': 'var(--on-paper)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--on-paper)',
            '--tw-prose-quotes': 'var(--on-paper)',
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
