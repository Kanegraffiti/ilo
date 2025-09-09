/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9C5C2E',
        secondary: '#4A5B3F',
        accent: '#D37E2C',
        ink: '#2C221B',
        paper: '#F4E7CD',
      },
    },
  },
  plugins: [],
};
