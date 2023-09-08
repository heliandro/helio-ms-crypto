/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    './src/config/'
  ],
  setupFilesAfterEnv: ['./tests/setup.ts'],
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts'
};