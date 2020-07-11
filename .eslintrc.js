module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'jsx-a11y',
  ],
  parserOptions: {
    project: './tsconfig.json',
    extraFileExtensions: ['.json'],
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'airbnb-typescript',
    'react-app',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    indent: ['error', 2],
    '@typescript-eslint/indent': ['error', 2],
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'react/prop-types': 'off', // Typescript types are enough for most cases
    'no-return-await': 'off',
    'no-console': 'off',
    'no-await-in-loop': 'off',
    'no-nested-ternary': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn', // not error
    'no-else-return': 'off',
    'no-alert': 'off',
  },
};
