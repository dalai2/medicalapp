module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore dist directory and node modules
  setupFilesAfterEnv: ['./jest.setup.ts'],
};