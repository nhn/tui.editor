// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('../../jest.base.config');

module.exports = {
  ...base,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
