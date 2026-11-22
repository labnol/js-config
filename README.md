# @labnol/js-config

Shared ESLint and Prettier settings for Google Apps Script, Node and React projects. Pick the preset that matches your project and set up each tool with a single line.

Built by [Amit Agarwal](https://www.labnol.org/about) for [Digital Inspiration](https://digitalinspiration.com/), where it is used in popular projects like [Mail Merge](https://digitalinspiration.com/mail-merge), [Document Studio](https://digitalinspiration.com/document-studio) and [labnol.org](https://www.labnol.org/).

## What's Included

| Preset              | Use it for                     | What it adds                                                                               |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ |
| `eslint/appsscript` | Google Apps Script projects    | Apps Script globals such as `SpreadsheetApp`, plus `google.script.run` and OAuth libraries |
| `eslint/node`       | Node.js projects               | Node globals and a warning for import cycles                                               |
| `eslint/react`      | React apps built with Vite     | React, Hooks, React Compiler and Fast Refresh rules                                        |
| `prettier`          | Any project                    | 120-character lines, single quotes, semicolons and LF line endings                         |
| `prettier/tailwind` | Projects that use Tailwind CSS | The same style, plus sorted Tailwind classes                                               |

Every ESLint preset is an ESLint 10 flat config. It sorts imports, lints JSON files, sorts keys in JSON other than `package.json`, `appsscript.json`, `tsconfig*.json` and `.clasp.json`, and leaves formatting to Prettier.

## Install

```bash
npm install -D @labnol/js-config
```

This also installs ESLint, Prettier and the ESLint plugins the presets import, so remove them from the project's own `devDependencies`. npm links the `eslint` and `prettier` commands into the project, so `npm run lint` works without listing them. pnpm and Yarn don't, so with those, add `eslint` and `prettier` to the project too.

Requires Node `^20.19.0`, `^22.13.0`, or `>=24`, the same range as ESLint 10.

### React Projects

A React project also needs the React plugins. Add `prettier-plugin-tailwindcss` when the project uses Tailwind:

```bash
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier-plugin-tailwindcss --legacy-peer-deps
```

`eslint-plugin-react` 7.x does not list ESLint 10 as a peer dependency yet, so this install uses `--legacy-peer-deps`. To keep later `npm install` runs from stopping on that same mismatch, add `legacy-peer-deps=true` to the project's `.npmrc`. That setting skips peer checks for every dependency in the project. Remove the line once `eslint-plugin-react` declares ESLint 10.

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

### React version

The React preset targets React 19. `eslint-plugin-react` 7.x crashes on ESLint 10 when the version is set to `detect` (`context.getFilename` was removed). For a React 18 app, set the version after the preset:

```js
import react from '@labnol/js-config/eslint/react';

export default [...react, { settings: { react: { version: '18' } } }];
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

   Use `patch` for a fix, `minor` for a new rule, or `major` for a change that flags existing code. The command runs the tests and the linter, bumps the version and pushes the commit and tag to GitHub. The tag starts a [GitHub Action](https://github.com/labnol/js-config/actions) that publishes the new version to npm within a few minutes.

2. In each project, install the new version:

   ```bash
   npm install -D @labnol/js-config@latest
   ```
