// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer({ target: 'http://localhost:8080' });

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'demo/esm': '/',
    src: '/dist',
  },
  exclude: ['prsemirror-state'],
  devOptions: {
    port: 8081,
  },
  routes: [
    {
      src: '/img/.*',
      dest: (req, res) => {
        proxy.web(req, res);
      },
    },
  ],
  alias: {
    '@': './src',
    '@t': './types',
  },
};
