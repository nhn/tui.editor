/* eslint max-len: 0, no-process-env: 0 */
'use strict';

var path = require('path');

var WEBPACK_MAIN_ENTRY = './src/js/index.js';
var WEBPACK_DIST_PATH = path.join(__dirname, 'dist');
var WEBPACK_DIST_FILE = 'tui-editor-core.js';

module.exports = {
    cache: false,
    entry: WEBPACK_MAIN_ENTRY,
    output: {
        path: WEBPACK_DIST_PATH,
        pathinfo: false,
        filename: WEBPACK_DIST_FILE
    }
};
