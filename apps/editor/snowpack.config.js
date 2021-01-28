/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'test/demo': '/',
    src: '/dist',
    'src/img': '/img',
  },
  installOptions: {
    installTypes: true,
    namedExports: ['@toast-ui/toastmark'],
  },
  devOptions: {
    port: 8080,
    fallback: './editor.html',
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
