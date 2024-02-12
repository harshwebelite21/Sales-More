module.exports = {
  env: {
    browser: true,
    es2021: true,
  },

  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    '@typescript-eslint/no-unsafe-argument': ['off'],
    'object-shorthand': ['error', 'always'],
    '@typescript-eslint/no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': ['error'],
    '@typescript-eslint/no-inferrable-types': ['error'],
    '@typescript-eslint/no-explicit-any': ['error'],
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '~/**',
            group: 'external',
            position: 'after',
          },
        ],
        groups: [
          'external',
          'internal',
          'unknown',
          'index',
          'object',
          'type',
          'builtin',
          'sibling',
          'parent',
        ],
      },
    ],
  },
};
