/**
* @fileoverview Editor/Viewer proxy for extensions
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
/* eslint global-require: 0 no-empty: 0 */

let Editor;
try {
  Editor = require('../editor');
} catch (e) {}
if (!Editor) {
  try {
    Editor = require('../viewer');
  } catch (e) {}
}

export default Editor;
