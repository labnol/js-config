import prettier from 'eslint-config-prettier/flat';
import googleappsscript from 'eslint-plugin-googleappsscript';
import globals from 'globals';

import { base, JS_FILES } from './base.js';

export default [
  ...base,
  {
    files: JS_FILES,
    languageOptions: {
      globals: {
        ...globals.node,
        ...googleappsscript.environments.googleappsscript.globals,
        __APP_VERSION__: 'readonly',
        google: 'readonly',
        OAuth1: 'readonly',
        OAuth2: 'readonly',
      },
    },
    rules: {
      // Apps Script has no module resolution, and the Vite bundle tolerates cycles
      'import-x/no-cycle': 'off',
      'import-x/no-unresolved': 'off',
    },
  },
  // Must be last: turns off stylistic rules that conflict with Prettier
  prettier,
];
