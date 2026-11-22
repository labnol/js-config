import prettier from 'eslint-config-prettier/flat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { reactRefresh } from 'eslint-plugin-react-refresh';
import globals from 'globals';

import { base, JS_FILES } from './base.js';
import { REACT_RULES } from './react-rules.js';

export default [
  ...base,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  // 'detect' crashes eslint-plugin-react 7.x on ESLint 10 (context.getFilename was removed).
  // No `files` here: the React rules also run on JSON files and warn when the version is missing.
  { settings: { react: { version: '19' } } },
  { files: JS_FILES, ...reactHooks.configs.flat.recommended },
  {
    files: JS_FILES,
    plugins: { 'react-refresh': reactRefresh.plugin },
    languageOptions: { globals: { ...globals.browser, google: true, process: 'readonly' } },
    rules: REACT_RULES,
  },
  // Must be last: turns off stylistic rules that conflict with Prettier
  prettier,
];
