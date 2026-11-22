import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

import { base, JS_FILES } from './base.js';

export default [
  ...base,
  {
    files: JS_FILES,
    languageOptions: { globals: globals.node },
    rules: { 'import-x/no-cycle': 'warn' },
  },
  // Must be last: turns off stylistic rules that conflict with Prettier
  prettier,
];
