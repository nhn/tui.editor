/**
 * @fileoverview Implements code WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * Code
 * Add bold to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Code
 * @ignore
 */
const Code = CommandManager.command('wysiwyg', /** @lends Code */{
  name: 'Code',
  keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();
    const range = sq.getSelection();
    const tableSelectionManager = wwe.componentManager.getManager('tableSelection');
    const _styleCode = util.bind(styleCode, null, wwe.getEditor());

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(_styleCode);
    } else {
      _styleCode(sq);
    }

    if (sq.hasFormat('table') && !domUtils.isTextNode(range.commonAncestorContainer)) {
      range.collapse(true);
      sq.setSelection(range);
    }
  }
});

/**
 * removeUnnecessaryCodeInNextToRange
 * Remove unnecessary code tag next to range, code tag made by squire
 * @param {Range} range range object
 */
function removeUnnecessaryCodeInNextToRange(range) {
  if (domUtils.getNodeName(range.startContainer.nextSibling) === 'CODE'
        && domUtils.getTextLength(range.startContainer.nextSibling) === 0
  ) {
    $(range.startContainer.nextSibling).remove();
  }
}

/**
 * Style code.
 * @param {object} editor - editor instance
 * @param {object} sq - squire editor instance
 */
function styleCode(editor, sq) {
  if (!sq.hasFormat('PRE') && sq.hasFormat('code')) {
    sq.changeFormat(null, {tag: 'code'});
    removeUnnecessaryCodeInNextToRange(editor.getSelection().cloneRange());
  } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
    if (sq.hasFormat('b')) {
      sq.removeBold();
    } else if (sq.hasFormat('i')) {
      sq.removeItalic();
    }

    sq.changeFormat({tag: 'code'});

    const range = sq.getSelection().cloneRange();
    range.setStart(range.endContainer, range.endOffset);
    range.collapse(true);

    sq.setSelection(range);
  }
}

export default Code;

