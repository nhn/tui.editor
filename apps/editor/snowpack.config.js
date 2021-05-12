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
  alias: {
    '@': './src',
    '@t': './types',
  },
  workspaceRoot: '../../',
};
