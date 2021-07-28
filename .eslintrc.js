module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'consistent-return': 'off',
    'no-return-await': 'off',
    'no-plusplus': 'off',
    'no-unused-vars': 'warn',
    'class-methods-use-this': ['error', { exceptMethods: ['data'] }],
    'no-shadow': ['error', { allow: ['state', 'getters'] }],
    'no-param-reassign': ['error', { props: false }],
    'func-names': ['error', 'as-needed'],
    'linebreak-style': ['error', 'unix'],
    curly: ['error'],

    'no-nested-ternary': 'warn',
    'no-underscore-dangle': 'warn',
    'no-unused-expressions': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-array-index-key': 'off',
    'react/destructuring-assignment': 'off',
    'jsx-a11y/alt-text': 'off',

    'import/prefer-default-export': 'off',
    'import/extensions': [
      'warn',
      {
        '.js': 'never',
        '.jsx': 'never',
        '.mjs': 'never',
        '.ts': 'never',
        '.tsx': 'never',
        '.vue': 'never',
      },
    ],
    'prettier/prettier': ['error'],
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
