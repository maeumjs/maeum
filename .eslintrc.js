module.exports = {
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ['__test__/*', '__tests__/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // ecmaVersion: 2020,
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]+',
          match: true,
        },
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        custom: {
          regex: '^T[A-Z]+',
          match: true,
        },
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'off',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_.+$',
        argsIgnorePattern: '^_.+$',
      },
    ],
    'max-len': [
      'error',
      {
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        code: 120,
      },
    ],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration:not([const=true])',
        message: "Don't declare non-const enums",
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        // always try to resolve types under `<root>@types` directory even it doesn't contain any source code,
        // like `@types/unist`
        alwaysTryTypes: true,
        project: 'tsconfig.eslint.json',
      },
    },
  },
};
