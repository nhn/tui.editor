/**
 * @fileoverview Editor/Viewer proxy for extensions
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
/* eslint global-require: 0 no-empty: 0 */

let Editor;

try {
  Editor = require('../editor').default;
} catch (e) {}
if (!Editor) {
  try {
    Editor = require('../viewer').default;
  } catch (e) {}
}

export default Editor;
