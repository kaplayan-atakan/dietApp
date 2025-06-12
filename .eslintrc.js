module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es2020: true
  },  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // Temporarily disabled for build
    'prefer-const': 'error',
    'no-var': 'error'
  },
  overrides: [
    {
      files: ['apps/mobile/**/*.{ts,tsx}'],
      extends: ['@react-native-community'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'react-native/no-inline-styles': 'warn'
      }
    },
    {
      files: ['apps/web-app/**/*.{ts,tsx}', 'apps/landing-page/**/*.{ts,tsx}'],
      extends: ['next/core-web-vitals'],
      rules: {
        'react/prop-types': 'off',
        'react-hooks/exhaustive-deps': 'warn'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    'coverage/',
    'android/',
    'ios/',
    '*.config.js'
  ]
};
