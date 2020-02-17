module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    node: true,
    jest: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    'tui/es6',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    parser: 'typescript-eslint-parser'
  },
  rules: {
    'prefer-destructuring': 0,
    'newline-before-return': 0,
    'padding-line-between-statements': 0,
    'lines-between-class-members': 0,
    'no-useless-constructor': 0,
    'default-param-last': 1,
    'no-dupe-class-members': 0,
    'no-cond-assign': 0,
    'no-plusplus': 0,
    eqeqeq: 0,
    'no-empty': 0,
    'no-shadow': 0,
    'max-depth': 0,
    'max-nested-callbacks': 0,
    'no-useless-escape': 0,
    'no-control-regex': 0,
    'no-constant-condition': 0,
    'accessor-pairs': 0,
    'require-jsdoc': 0,
    'no-undefined': 0,
    'no-new': 0,
    'spaced-comment': 0,
    'no-lonely-if': 0,
    'no-nested-ternary': 0,
    curly: 2,
    complexity: 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-triple-slash-reference': 0,
    '@typescript-eslint/no-object-literal-type-assertion': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/triple-slash-reference': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-useless-constructor': 2,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-empty-function': 0
  }
};
