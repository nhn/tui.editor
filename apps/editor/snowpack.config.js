/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'demo/esm': '/',
    'src/img': '/img',
    src: '/dist',
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
