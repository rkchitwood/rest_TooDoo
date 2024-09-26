module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Optionally specify test file patterns if needed
    testMatch: ['**/*.test.ts', '**/*.spec.ts'],
    // Optional: ignore compiled JS files (if they're present in your build)
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
};