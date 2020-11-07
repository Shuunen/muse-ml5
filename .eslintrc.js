const rules = require('./.eslintrc.rules.js')

module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:unicorn/recommended',
  ],
  plugins: [
    'html',
    'unicorn',
  ],
  rules,
}
