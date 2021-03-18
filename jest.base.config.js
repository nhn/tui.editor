// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const setupFile = path.resolve(__dirname, './jest-setup.js');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [setupFile],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'jest-esm-transformer',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  snapshotSerializers: ['jest-serializer-html'],
  testMatch: ['**/__test__/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};
