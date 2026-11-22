import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { format } from 'prettier';

import base from '../prettier/base.json' with { type: 'json' };
import tailwind from '../prettier/tailwind.js';

describe('prettier', () => {
  it('uses LF and shares its options with the Tailwind config', () => {
    assert.equal(base.endOfLine, 'lf');
    assert.deepEqual(tailwind, { ...base, plugins: ['prettier-plugin-tailwindcss'] });
  });

  it('sorts Tailwind classes', async () => {
    const formatted = await format("<div className='p-2 flex'></div>\n", { ...tailwind, filepath: 'App.jsx' });

    assert.match(formatted, /className='flex p-2'/);
  });
});
