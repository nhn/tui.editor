/**
 * @fileoverview Implements UL markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';
import {
  FIND_MD_OL_RX,
  FIND_MD_UL_RX,
  FIND_MD_TASK_RX,
  FIND_MD_UL_TASK_RX
} from './listRegex';

const MD_UL_TASK_SYNTAX_RX = /([-*])( \[[ xX]]) /;
const MD_UL_OR_UL_TASK_SYNTAX_RX = /[\d]+\.( \[[ xX]])? /;

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/UL
 * @ignore
 */
const UL = CommandManager.command('markdown', /** @lends UL */{
  name: 'UL',
  keyMap: ['CTRL+U', 'META+U'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    const range = mde.getCurrentRange();
    const listManager = mde.componentManager.getManager('list');
    const lineRange = listManager.expandLineRangeIfNeed(doc, range, isOlOrTask);
    const startLineNumber = lineRange.start;
    const endLineNumber = lineRange.end;
    let line, currentLineStart;

    for (let i = startLineNumber; i <= endLineNumber; i += 1) {
      currentLineStart = {
        line: i,
        ch: 0
      };

      line = doc.getLine(i);

      if (listManager.isListOrParagraph(line)) {
        if (isUlTask(line)) {
          listManager.replaceLineText(doc, i, MD_UL_TASK_SYNTAX_RX, '$1 ');
        } else if (isOlOrTask(line)) {
          listManager.replaceLineText(doc, i, MD_UL_OR_UL_TASK_SYNTAX_RX, '* ');
        } else if (!line.match(FIND_MD_UL_RX)) {
          doc.replaceRange('* ', currentLineStart);
        }

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
 * Return whether the given line is UL TASK
 * @param {string} line Line text
 * @returns {boolean}
 */
function isUlTask(line) {
  return !!(line && line.match(FIND_MD_UL_TASK_RX));
}

/**
 * Return whether passed line is OL or TASK or neither
 * @param {string} line Line text
 * @returns {boolean}
 */
function isOlOrTask(line) {
  return !!(line && (line.match(FIND_MD_TASK_RX) || line.match(FIND_MD_OL_RX)));
}

export default UL;
