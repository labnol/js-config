import js from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import { configs as jsoncConfigs } from 'eslint-plugin-jsonc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

import { RULES } from './rules.js';

export const JS_FILES = ['**/*.{js,jsx,mjs,cjs}'];

// Common setup each preset builds on. Presets add their own globals and end with prettier.
export const base = [
  { ignores: ['dist/**', 'build/**', 'node_modules/**', 'package-lock.json'] },
  js.configs.recommended,
  importX.flatConfigs.recommended,
  {
    files: JS_FILES,
    plugins: { 'simple-import-sort': simpleImportSort },
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: RULES,
  },

  ...jsoncConfigs['flat/recommended-with-jsonc'],
  {
    files: ['**/*.json', '**/*.jsonc'],
    rules: { 'jsonc/no-comments': 'off' },
  },
  // Key order in these files is a convention, so leave it alone
  {
    files: ['**/*.json', '**/*.jsonc'],
    ignores: ['**/package.json', '**/appsscript.json', '**/tsconfig*.json', '**/.clasp.json'],
    rules: { 'jsonc/sort-keys': 'error' },
  },

  // Build and tool configs run in Node and may import devDependencies
  {
    files: ['*.config.js', '*.config.mjs'],
    languageOptions: { globals: globals.node },
    rules: { 'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }] },
  },
];
