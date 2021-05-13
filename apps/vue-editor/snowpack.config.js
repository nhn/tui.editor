/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'demo/esm': '/',
    src: '/dist',
  },
  devOptions: {
    port: 8080,
  },
  plugins: ['@morgul/snowpack-plugin-vue2'],
};
