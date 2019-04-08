/**
 * @fileoverview entry point for viewer with all extensions
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const EditorViewer = require('./indexViewer');

import './extensions/chart/chart';
import './extensions/table/table';
import './extensions/colorSyntax';
import './extensions/uml';

module.exports = EditorViewer;
