module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/__test__/**/*.spec.ts'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.js$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: ['jest-serializer-html'],
  setupFiles: ['<rootDir>/src/__test__/jest-setup.ts']
};
