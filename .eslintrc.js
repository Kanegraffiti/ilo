require('./eslint-rules/no-emojis-in-ui');

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['local'],
  rules: {
    'local/no-emojis-in-ui': 'warn',
  },
};
