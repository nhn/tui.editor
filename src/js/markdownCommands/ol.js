/**
 * @fileoverview Implements OL markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import CommandManager from '../commandManager';
import {
  FIND_MD_OL_RX,
  FIND_MD_UL_RX,
  FIND_MD_TASK_RX
} from './listRegex';

const MD_LIST_OR_TASK_SYNTAX_RX = /([-*]|[\d]+\.)( \[[ xX]])? /;

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/OL
 * @ignore
 */
const OL = CommandManager.command('markdown', /** @lends OL */{
  name: 'OL',
  keyMap: ['CTRL+O', 'META+O'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    const range = mde.getCurrentRange();
    const listManager = mde.componentManager.getManager('list');
    const lineRange = listManager.expandLineRangeIfNeed(doc, range, isUlOrTask);
    const startLineNumber = lineRange.start;
    const endLineNumber = lineRange.end;
    let ordinalNumber = 1;
    let line, currentLineStart;

    for (let i = startLineNumber; i <= endLineNumber; i += 1) {
      currentLineStart = {
        line: i,
        ch: 0
      };

      line = doc.getLine(i);

      if (listManager.isListOrParagraph(line)) {
        if (isUlOrTask(line)) {
          listManager.replaceLineText(doc, i, MD_LIST_OR_TASK_SYNTAX_RX, `${ordinalNumber}. `);
        } else if (!line.match(FIND_MD_OL_RX)) {
          doc.replaceRange(`${ordinalNumber}. `, currentLineStart);
        }

        ordinalNumber += 1;

        if (i === endLineNumber) {
          listManager.appendBlankLineIfNeed(cm, i, endLineNumber, startLineNumber);
        }
      } else {
        break;
      }
    }
    cm.focus();
  }
});

/**
 * Return whether passed line is UL or TASK or neither
 * @param {string} line Line text
 * @returns {boolean}
 */
function isUlOrTask(line) {
  return !!(line && (line.match(FIND_MD_TASK_RX) || line.match(FIND_MD_UL_RX)));
}

export default OL;
