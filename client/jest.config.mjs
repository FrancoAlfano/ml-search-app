import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: '.',
})

const customJestConfig = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': './src/components/$1',
    '^@/app/(.*)$': './src/app/$1',
  },
}

export default createJestConfig(customJestConfig)