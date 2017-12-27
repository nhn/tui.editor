/**
 * @fileoverview entry point for viewer with all extensions
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
const EditorViewer = require('./indexViewer');

import './extensions/chart/chart';
import './extensions/table/table';
import './extensions/colorSyntax';
import './extensions/uml';

module.exports = EditorViewer;
