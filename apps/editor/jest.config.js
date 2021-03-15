// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('../../jest.base.config');

module.exports = {
  ...base,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['../../jest-setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
