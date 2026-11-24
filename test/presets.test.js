import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { ESLint } from 'eslint';

import appsScript from '../eslint/appsscript.js';
import nodeConfig from '../eslint/node.js';
import react from '../eslint/react.js';

async function lint(config, code, filePath) {
  const eslint = new ESLint({ overrideConfig: config, overrideConfigFile: true });
  const [result] = await eslint.lintText(code, { filePath });

  return result;
}

function errorRules(result) {
  return result.messages.filter((message) => message.severity === 2).map((message) => message.ruleId);
}

const VALID_SCRIPT = `const items = [1];
const first = items[0];

function run() {
  return helper();
}

function helper() {
  return first;
}

export { run };
`;

describe('shared rules', () => {
  it('allows array index access and hoisted function declarations', async () => {
    const result = await lint(nodeConfig, VALID_SCRIPT, 'src/example.js');

    assert.deepEqual(errorRules(result), []);
  });

  it('reports var', async () => {
    const result = await lint(nodeConfig, 'var value = 1;\nexport { value };\n', 'src/example.js');

    assert.ok(errorRules(result).includes('no-var'));
  });

  it('reports unused variables, arguments, and catch bindings', async () => {
    const code = `const unused = 1;

export function run(skipped, used) {
  try {
    return used;
  } catch (error) {
    return used;
  }
}
`;
    const result = await lint(nodeConfig, code, 'src/example.js');

    assert.equal(result.messages.filter((message) => message.ruleId === 'no-unused-vars').length, 3);
  });

  it('ignores unused names that start with an underscore', async () => {
    const code = `const [_skipped, kept] = [1, 2];
const _unused = 1;
const { omitted, ...rest } = { omitted: 1, kept };

class Boot {
  static {
    globalThis.booted = true;
  }
}

export function run(_unusedArg) {
  using lock = { [Symbol.dispose]() {} };

  try {
    return kept + rest.kept;
  } catch (_error) {
    return kept;
  }
}
`;
    const result = await lint(nodeConfig, code, 'src/example.js');

    assert.deepEqual(errorRules(result), []);
  });

  it('reports a name marked unused when it is used', async () => {
    const code = `const _value = 1;

export const value = _value;
`;
    const result = await lint(nodeConfig, code, 'src/example.js');

    assert.ok(errorRules(result).includes('no-unused-vars'));
  });

  it('reports a duplicate import once per line', async () => {
    const code = `import { readFile } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';

export { readFile, writeFile };
`;
    const result = await lint(nodeConfig, code, 'src/example.js');

    assert.deepEqual(errorRules(result), ['import-x/no-duplicates', 'import-x/no-duplicates']);
  });

  it('ignores build output in nested folders', async () => {
    const eslint = new ESLint({ overrideConfig: nodeConfig, overrideConfigFile: true });

    assert.equal(await eslint.isPathIgnored('packages/app/dist/bundle.js'), true);
    assert.equal(await eslint.isPathIgnored('functions/package-lock.json'), true);
  });

  it('leaves jsconfig.json and VS Code settings key order alone', async () => {
    const jsconfig = await lint(nodeConfig, '{ "include": ["src"], "compilerOptions": {} }\n', 'jsconfig.json');
    const settings = await lint(nodeConfig, '{ "b": 1, "a": 2 }\n', '.vscode/settings.json');

    assert.equal(errorRules(jsconfig).includes('jsonc/sort-keys'), false);
    assert.equal(errorRules(settings).includes('jsonc/sort-keys'), false);
  });

  it('sorts keys in JSON files', async () => {
    const result = await lint(nodeConfig, '{ "b": 1, "a": 2 }\n', 'data.json');

    assert.ok(errorRules(result).includes('jsonc/sort-keys'));
  });

  it('leaves package.json key order alone', async () => {
    const result = await lint(nodeConfig, '{ "version": "1.0.0", "name": "demo" }\n', 'package.json');

    assert.equal(errorRules(result).includes('jsonc/sort-keys'), false);
  });

  it('leaves appsscript.json key order alone', async () => {
    const result = await lint(
      nodeConfig,
      '{ "timeZone": "Asia/Kolkata", "runtimeVersion": "V8" }\n',
      'appsscript.json'
    );

    assert.equal(errorRules(result).includes('jsonc/sort-keys'), false);
  });
});

describe('node preset', () => {
  it('accepts Node globals', async () => {
    const result = await lint(nodeConfig, 'const mode = process.env.NODE_ENV;\nexport { mode };\n', 'src/example.js');

    assert.deepEqual(errorRules(result), []);
  });
});

describe('Apps Script preset', () => {
  it('accepts Apps Script, google, and OAuth globals', async () => {
    const code = `const title = SpreadsheetApp.getActiveSpreadsheet().getName();
const service = OAuth2.createService(title);

export { service };
`;
    const result = await lint(appsScript, code, 'Code.js');

    assert.deepEqual(errorRules(result), []);
  });

  it('reports assignment to readonly globals', async () => {
    const result = await lint(appsScript, 'google = 1;\nOAuth1 = 1;\nOAuth2 = 1;\n', 'Code.js');

    assert.equal(result.messages.filter((message) => message.ruleId === 'no-global-assign').length, 3);
  });

  it('skips HTML files when linting a directory', async () => {
    const root = await mkdtemp(join(tmpdir(), 'js-config-'));

    try {
      await writeFile(join(root, 'sidebar.html'), '<html></html>\n');
      await writeFile(
        join(root, 'Code.js'),
        'const title = SpreadsheetApp.getActiveSpreadsheet().getName();\n\nexport { title };\n'
      );
      const eslint = new ESLint({ cwd: root, overrideConfig: appsScript, overrideConfigFile: true });
      const results = await eslint.lintFiles(['.']);

      assert.equal(
        results.some((result) => result.filePath.endsWith('.html')),
        false
      );
      assert.equal(results.find((result) => result.filePath.endsWith('Code.js')).errorCount, 0);
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});

describe('React preset', () => {
  it('accepts an arrow function component', async () => {
    const code = `const Button = () => <button type="button">Save</button>;

export default Button;
`;
    const result = await lint(react, code, 'src/Button.jsx');

    assert.deepEqual(errorRules(result), []);
  });

  it('requires arrow function components', async () => {
    const code = `function Button() {
  return <button type="button">Save</button>;
}

export default Button;
`;
    const result = await lint(react, code, 'src/Button.jsx');

    assert.ok(errorRules(result).includes('react/function-component-definition'));
  });

  it('accepts the google global', async () => {
    const code = `const Button = () => <button type="button">{google.script.host}</button>;

export default Button;
`;
    const result = await lint(react, code, 'src/Button.jsx');

    assert.deepEqual(errorRules(result), []);
  });

  it('reports deep relative imports', async () => {
    const code = `import { api } from '../../utils/api.js';

export { api };
`;
    const result = await lint(react, code, 'src/components/Button.jsx');

    assert.ok(errorRules(result).includes('no-restricted-imports'));
  });
});
