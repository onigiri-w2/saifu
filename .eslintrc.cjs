module.exports = {
  root: true,
  plugins: ['import', 'unused-imports', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  extends: ['universe', 'prettier'],
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "error",
    '@typescript-eslint/no-unused-vars': 'off',
    'comma-dangle': 'off',
    curly: ['error', 'multi-line'],
    'unused-imports/no-unused-imports': 'warn',
    'import/no-cycle': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroups: [
          {
            pattern: '{react,react-native}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'parent',
            position: 'before',
          },
        ],
      },
    ],
  },
};
