import node from './eslint/node.js';

export default [
  ...node,
  // ESLint and Prettier load a shared config from its default export
  { files: ['eslint/*.js', 'prettier/*.js'], rules: { 'import-x/no-default-export': 'off' } },
];
