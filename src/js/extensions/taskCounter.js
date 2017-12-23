/**
* @fileoverview Implements Task counter
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import Editor from './editorProxy';

const FIND_TASK_RX = /^\s*\* \[[xX ]\] [^\n]*/mg;
const FIND_CHECKED_TASK_RX = /^\s*\* \[[xX]\] [^\n]*/mg;

/**
 * task counter extension
 * @param {Editor} editor - editor instance
 * @ignore
 */
function taskCounterExtension(editor) {
  editor.getTaskCount = () => {
    let found, count;

    if (editor.isViewer()) {
      count = editor.preview.$el.find('.task-list-item').length;
    } else if (editor.isMarkdownMode()) {
      found = editor.mdEditor.getValue().match(FIND_TASK_RX);
      count = found ? found.length : 0;
    } else {
      count = editor.wwEditor.get$Body().find('.task-list-item').length;
    }

    return count;
  };

  editor.getCheckedTaskCount = () => {
    let found, count;

    if (editor.isViewer()) {
      count = editor.preview.$el.find('.task-list-item.checked').length;
    } else if (editor.isMarkdownMode()) {
      found = editor.mdEditor.getValue().match(FIND_CHECKED_TASK_RX);
      count = found ? found.length : 0;
    } else {
      count = editor.wwEditor.get$Body().find('.task-list-item.checked').length;
    }

    return count;
  };
}

Editor.defineExtension('taskCounter', taskCounterExtension);
