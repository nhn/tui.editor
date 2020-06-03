module.exports = {
  extends: ['tui/es6', 'plugin:prettier/recommended', 'plugin:vue/base'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 7,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'object-property-newline': 0
  }
};
