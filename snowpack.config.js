/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'test/demo': '/',
    src: '/dist',
    'src/img': '/img',
  },
  packageOptions: {
    polyfillNode: true,
  },
  devOptions: {
    port: 8080,
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
