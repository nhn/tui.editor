/**
 * @fileoverview Implements UL markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';

const FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/;
const FIND_MD_UL_RX = /^[ \t]*[-*] .*/;
const FIND_MD_TASK_RX = /^[ \t]*[-*]( \[[ xX]])? .*/;

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
        if (isOlOrTask(line)) {
          listManager.replaceLineText(doc, i, /[\d]+\. /, '* ');
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
 * Return whether passed line is OL or TASK or neither
 * @param {string} line Line text
 * @returns {boolean}
 */
function isOlOrTask(line) {
  return !!(line && (line.match(FIND_MD_TASK_RX) || line.match(FIND_MD_OL_RX)));
}

export default UL;
