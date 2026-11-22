// Rules the React preset adds on top of the shared ones in rules.js.
export const REACT_RULES = {
  // Vite resolves extensionless imports and folder index files
  'import-x/extensions': 'off',
  // Vite path aliases (@components/...) aren't resolvable without extra resolver setup
  'import-x/no-unresolved': 'off',
  'no-restricted-imports': ['error', { patterns: [{ group: ['../../*'], message: 'Use a path alias instead.' }] }],
  // Common in existing code, so warn instead of blocking a project that adopts the preset
  'react-hooks/set-state-in-effect': 'warn',
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  // A <button> without a type submits the surrounding form
  'react/button-has-type': 'warn',
  'react/function-component-definition': [
    'error',
    { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
  ],
  'react/hook-use-state': 'warn',
  'react/jsx-boolean-value': 'error',
  'react/jsx-curly-brace-presence': 'error',
  'react/jsx-key': ['error', { checkFragmentShorthand: true }],
  'react/jsx-no-constructed-context-values': 'warn',
  'react/jsx-no-useless-fragment': 'warn',
  'react/no-array-index-key': 'warn',
  // A component defined inside another remounts and loses its state on every render
  'react/no-unstable-nested-components': 'error',
  'react/prop-types': 'off',
  'react/self-closing-comp': 'error',
};
