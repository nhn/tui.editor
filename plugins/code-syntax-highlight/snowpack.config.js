/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    demo: '/',
    src: '/dist',
  },
  packageOptions: {
    source: 'remote',
  },
  devOptions: {
    port: 8081,
  },
  buildOptions: {
    clean: true,
    sourceMaps: false,
    out: 'dist',
  },
  alias: {
    '@': './src',
    '@t': './types',
  },
};
