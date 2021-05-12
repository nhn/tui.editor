/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/',
  },
  exclude: ['**/__test__/**/*'],
  buildOptions: {
    out: 'dist/esm',
  },
  optimize: {
    entrypoints: ['./src/index.ts'],
    bundle: true,
  },
  alias: {
    '@': './src',
    '@t': './types',
  },
};
