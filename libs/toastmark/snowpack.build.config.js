// eslint-disable-next-line @typescript-eslint/no-var-requires
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/',
  },
  exclude: ['**/__sample__/**/*', '**/__test__/**/*'],
  buildOptions: {
    out: 'dist/esm',
  },
  optimize: {
    entrypoints: ['./src/index.ts'],
    bundle: true,
  },
  alias: {
    '@': './src',
  },
};
