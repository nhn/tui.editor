/*eslint-disable*/
var fs = require('fs');
var path = require('path');
var pkg = require('./package.json');

var tsVersion = (/[0-9.]+/).exec(pkg.devDependencies.typescript)[0];
var declareFilePath = path.join(__dirname, 'index.d.ts');
var declareRows = [];
var TS_BANNER = [
    '// Type definitions for TOAST UI Chart v' + pkg.version,
    '// TypeScript Version: ' + tsVersion
].join('\n');

fs.readFile(declareFilePath, 'utf8', function(error, data) {
    if (error) {
        throw error;
    }

    declareRows = data.toString().split('\n');
    declareRows.splice(0, 2, TS_BANNER);

    fs.writeFile(declareFilePath, declareRows.join('\n'), 'utf8', function(error, data) {
        if (error) {
            throw error;
        }

        console.log('Completed Write Banner for Typescript!');
    });
});
