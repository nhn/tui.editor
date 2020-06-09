module.exports = {
  plugins: ['prettier'],
  extends: ['tui/es6', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    commonjs: true,
    jasmine: true
  },
  globals: {
    fixture: true
  },
  rules: {
    'lines-around-directive': 0,
    'newline-before-return': 0,
    'padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
    ],
    'no-useless-rename': 'error',
    'no-duplicate-imports': ['error', { includeExports: true }],
    'dot-notation': ['error', { allowKeywords: true }],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: true,
          object: true
        },
        AssignmentExpression: {
          array: false,
          object: false
        }
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: true }],
    'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
    'complexity': ["error", 8],
    'max-depth': ["error", 4],
    'max-nested-callbacks': ["error", 4]
  }
};
