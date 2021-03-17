module.exports = {
  root: true,
  plugins: ['prettier', '@typescript-eslint'],
  extends: ['tui/es6', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: 'typescript-eslint-parser',
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  globals: {
    jest: true,
  },
  ignorePatterns: ['node_modules/*', 'dist'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-useless-constructor': 2,
    'lines-around-directive': 0,
    'newline-before-return': 0,
    'no-use-before-define': 0,
    'no-useless-constructor': 0,
    'padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    ],
    'no-useless-rename': 'error',
    'no-duplicate-imports': ['error', { includeExports: true }],
    'dot-notation': ['error', { allowKeywords: true }],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: true,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: true }],
    'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
    'no-sync': 0,
    complexity: 0,
    'max-nested-callbacks': ['error', 4],
    'no-cond-assign': 0,
    'max-depth': ['error', 4],
    'no-return-assign': 0,
  },
};
