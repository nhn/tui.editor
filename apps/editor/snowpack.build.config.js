// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const external = [
  'prosemirror-view',
  'prosemirror-model',
  'prosemirror-state',
  'prosemirror-transform',
  'prosemirror-commands',
  'prosemirror-keymap',
  'prosemirror-history',
  'prosemirror-inputrules',
];

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'src/esm': '/',
  },
  packageOptions: {
    external,
  },
  buildOptions: {
    out: 'dist/esm',
  },
  plugins: [
    [
      'snowpack-plugin-rollup-bundle',
      {
        emitHtmlFiles: false,
        entrypoints: [path.resolve(__dirname, 'dist/esm/index.js')],
        extendConfig: (config) => {
          config.inputOptions.external = external;
          config.outputOptions.entryFileNames = '[name].js';
          config.outputOptions.plugins = [];

          return config;
        },
      },
    ],
  ],
  alias: {
    '@': './src',
    '@t': './types',
  },
  workspaceRoot: '../../',
};
