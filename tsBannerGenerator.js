/*eslint-disable*/
const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

const tsVersion = (/[0-9.]+/).exec(pkg.devDependencies.typescript)[0];
const declareFilePath = path.join(__dirname, 'index.d.ts');
const TS_BANNER = [
  '// Type definitions for TOAST UI Editor v' + pkg.version,
  '// TypeScript Version: ' + tsVersion
].join('\n');
let declareRows = [];

fs.readFile(declareFilePath, 'utf8', (error, data) => {
  if (error) {
    throw error;
  }

  declareRows = data.toString().split('\n');
  declareRows.splice(0, 2, TS_BANNER);

  fs.writeFile(declareFilePath, declareRows.join('\n'), 'utf8', (error, data) => {
    if (error) {
      throw error;
    }

    console.log('Completed Write Banner for Typescript!');
  });
});
