// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer({ target: 'http://localhost:8080' });

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'demo/esm': '/',
    src: '/dist',
  },
  devOptions: {
    port: 8081,
  },
  routes: [
    { match: 'routes', src: '.*', dest: '/editor.html' },
    {
      src: '/img/.*',
      dest: (req, res) => {
        proxy.web(req, res);
      },
    },
  ],
  buildOptions: {
    clean: true,
    sourceMaps: false,
    out: 'dist',
  },
};
