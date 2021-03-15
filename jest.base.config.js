module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'jest-esm-transformer',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  snapshotSerializers: ['jest-serializer-html'],
  testMatch: ['**/__test__/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};
