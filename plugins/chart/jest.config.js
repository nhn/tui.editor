module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/__test__/**/*.spec.js'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.js$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
