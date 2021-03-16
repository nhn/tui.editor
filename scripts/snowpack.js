/* eslint-disable @typescript-eslint/no-var-requires */
const { startServer, loadConfiguration } = require('snowpack');
const path = require('path');

const configuration = ['type'];
const pathMap = {
  editor: path.resolve(__dirname, '../apps/editor'),
  toastmark: path.resolve(__dirname, '../libs/toastmark'),
};
const argv = process.argv.slice(2);
const [key, value] = argv;
const config = key.replace('--', '');

if (!configuration.includes(config)) {
  throw new Error(`${config} is wrong Configuration.`);
}

const snowpackRootPath = pathMap[value];

if (!snowpackRootPath) {
  throw new Error(
    `You should choose "editor", "toastmark", "chart-plugin", "color-syntax-plugin", "code-syntax-highlight-plugin", "uml-plugin", "table-merged-cell-plugin" 
    as the configuration of type
    `
  );
}

loadConfiguration({ root: snowpackRootPath }, `${snowpackRootPath}/snowpack.config.js`).then(
  (snowPackConfig) => {
    startServer({ config: snowPackConfig });
  }
);
