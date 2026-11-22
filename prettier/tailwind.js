import base from './base.json' with { type: 'json' };

export default {
  ...base,
  plugins: ['prettier-plugin-tailwindcss'],
};
