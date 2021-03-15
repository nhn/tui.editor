/* eslint-disable @typescript-eslint/no-var-requires */
const { startServer, loadConfiguration } = require('snowpack');
const path = require('path');

const pathMap = {
  editor: path.resolve(__dirname, '../apps/editor'),
  toastmark: path.resolve(__dirname, '../libs/toastmark'),
};
const [type] = process.argv.slice(2);
const snowpackRootPath = pathMap[type];

loadConfiguration({ root: snowpackRootPath }, `${snowpackRootPath}/snowpack.config.js`).then(
  (config) => {
    startServer({ config });
  }
);
