/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    demo: '/',
    src: '/dist',
  },
  devOptions: {
    port: 8000,
  },
  alias: {
    '@t': './types',
  },
};
