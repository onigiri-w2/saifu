module.exports = {
  root: true,
  extends: ['universe', 'plugin:prettier/recommended'],
  plugins: ['import', 'unused-imports'],
  rules: {
    'import/no-cycle': 'error',
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        // 他のPrettier設定をここに追加
      },
    ],
    'comma-dangle': 'off',
    curly: ['error', 'multi-line'],
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
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
