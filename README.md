# @labnol/js-config

Shared ESLint and Prettier settings for Google Apps Script, Node and React projects. Pick the preset that matches your project and set up each tool with a single line.

Built by [Amit Agarwal](https://www.labnol.org/about) for [Digital Inspiration](https://digitalinspiration.com/), where it is used in popular projects like [Mail Merge](https://digitalinspiration.com/mail-merge), [Document Studio](https://digitalinspiration.com/document-studio) and [labnol.org](https://www.labnol.org/).

## What's Included

| Preset              | Use it for                     | What it adds                                                                               |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ |
| `eslint/appsscript` | Google Apps Script projects    | Apps Script globals such as `SpreadsheetApp`, plus `google.script.run` and OAuth libraries |
| `eslint/node`       | Node.js projects               | Node globals and a warning for import cycles                                               |
| `eslint/react`      | React apps built with Vite     | React, Hooks, React Compiler and Fast Refresh rules                                        |
| `prettier`          | Any project                    | 120-character lines, single quotes and semicolons                                          |
| `prettier/tailwind` | Projects that use Tailwind CSS | The same style, plus sorted Tailwind classes                                               |

Every ESLint preset is an ESLint 10 flat config. It also sorts imports, lints JSON files and leaves formatting to Prettier.

## Install

```bash
npm install -D @labnol/js-config
```

This also installs `eslint` and `prettier`, so remove them and any ESLint plugins from the project's own `devDependencies`.

### React Projects

A React project also needs the React plugins. Leave out `prettier-plugin-tailwindcss` if the project doesn't use Tailwind:

```bash
echo legacy-peer-deps=true >> .npmrc
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier-plugin-tailwindcss
```

The first line keeps the project on ESLint 10. Without it, npm installs ESLint 9 instead, because `eslint-plugin-react` 7.x doesn't list ESLint 10 as supported yet.

## Set up ESLint

Create `eslint.config.js` in the project root with one line:

```js
export { default } from '@labnol/js-config/eslint/appsscript';
```

Change `appsscript` to `node` for a Node project or `react` for a React project.

### Override a Rule

To change a rule in one project, import the preset and add your overrides after it:

```js
import appsScript from '@labnol/js-config/eslint/appsscript';

export default [...appsScript, { rules: { 'no-console': 'off' } }];
```

## Set up Prettier

Delete the project's `.prettierrc` and add one line to `package.json`:

```json
"prettier": "@labnol/js-config/prettier"
```

For a project that uses Tailwind, add `/tailwind` to the end. Prettier then also sorts the Tailwind classes in your markup:

```json
"prettier": "@labnol/js-config/prettier/tailwind"
```

This needs `prettier-plugin-tailwindcss` in the project, which the [Install](#install) step covers.

## Publish an Update

1. Commit your change, then run:

   ```bash
   npm version patch
   ```

   Use `patch` for a fix, `minor` for a new rule, or `major` for a change that flags existing code. The command runs the linter, bumps the version and pushes the commit and tag to GitHub. The tag starts a [GitHub Action](https://github.com/labnol/js-config/actions) that publishes the new version to npm within a few minutes.

2. In each project, run `npm install -D @labnol/js-config@latest`.
