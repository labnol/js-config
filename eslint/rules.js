// Shared rules for every preset (Apps Script, Node, React).
export const RULES = {
  'no-console': 'warn',
  'no-duplicate-imports': 'error',
  'no-unused-expressions': 'warn',
  // A leading underscore marks a name as intentionally unused. Using that name is an error.
  'no-unused-vars': [
    'error',
    {
      args: 'all',
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      ignoreClassWithStaticInitBlock: true,
      ignoreRestSiblings: true,
      ignoreUsingDeclarations: true,
      reportUsedIgnorePattern: true,
      varsIgnorePattern: '^_',
    },
  ],
  // Function declarations are hoisted, so calling one earlier in the file is valid
  'no-use-before-define': ['error', { functions: false }],
  'no-useless-rename': 'error',
  'no-var': 'error',
  'object-shorthand': 'error',
  'prefer-arrow-callback': 'error',
  'prefer-const': 'error',
  'prefer-destructuring': ['error', { array: false, object: true }, { enforceForRenamedProperties: false }],
  'prefer-template': 'error',

  'import-x/extensions': ['error', 'ignorePackages'],
  'import-x/first': 'error',
  'import-x/newline-after-import': 'error',
  'import-x/no-extraneous-dependencies': 'warn',
  'import-x/no-self-import': 'error',
  'import-x/no-useless-path-segments': 'error',
  'simple-import-sort/exports': 'error',
  'simple-import-sort/imports': 'error',
};
