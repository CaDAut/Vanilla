module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    'react-hooks'
  ],
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['warn'],
    'no-console': ['warn'],
    'react/prop-types': ['warn'],
    'react/display-name': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react-hooks/rules-of-hooks': ['error'],
    'react-hooks/exhaustive-deps': ['warn']
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'vendor/',
    '*.min.js'
  ]
};