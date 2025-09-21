const path = require('path');
const Module = require('module');

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolve(request, parent, isMain, options) {
  if (request === 'eslint-plugin-local') {
    return path.join(__dirname, 'eslint-rules', 'plugin-local.js');
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['local'],
  rules: {
    'local/no-unsafe-text-color': 'warn',
  },
  settings: {
    'import/resolver': { typescript: {} },
  },
};
