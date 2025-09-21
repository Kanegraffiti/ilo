const path = require('path');

module.exports = {
  rules: {
    'no-emojis-in-ui': require(path.join(process.cwd(), 'eslint-rules/no-emojis-in-ui')),
  },
};
