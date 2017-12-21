/**
 * @fileoverview Implements Task markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';

const FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/;
const FIND_MD_UL_RX = /^[ \t]*[-*] .*/;
const FIND_MD_TASK_RX = /^[ \t]*[-*]( \[[ xX]])? .*/;
const FIND_TASK_SYNTAX_RX = /([*-] |[\d]+\. )(\[[ xX]] )/;

/**
 * Task
 * @extends Command
 * @module markdownCommands/Task
 * @ignore
 */
const Task = CommandManager.command('markdown', /** @lends Task */{
  name: 'Task',
  keyMap: ['CTRL+T', 'META+T'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    const range = mde.getCurrentRange();
    const listManager = mde.componentManager.getManager('list');
    const lineRange = listManager.createSortedLineRange(range);
    const startLineNumber = lineRange.start;
    const endLineNumber = lineRange.end;
    let line, currentLineStart;

    for (let i = startLineNumber; i <= endLineNumber; i += 1) {
      currentLineStart = {
        line: i,
        ch: 0
      };

      line = doc.getLine(i);

      const hasTaskSyntax = !!line.match(FIND_TASK_SYNTAX_RX);

      if (listManager.isListOrParagraph(line)) {
        if (isOlOrUl(line) && hasTaskSyntax) {
          listManager.replaceLineText(doc, i, FIND_TASK_SYNTAX_RX, '$1');
        } else if (isOlOrUl(line) && !hasTaskSyntax) {
          listManager.replaceLineText(doc, i, /([*-] |[\d]+\. )/, '$1[ ] ');
        } else if (!line.match(FIND_MD_TASK_RX)) {
          doc.replaceRange('* [ ] ', currentLineStart);
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
 * Return whether passed line is OL or UL or neither
 * @param {string} line Line text
 * @returns {boolean}
 */
function isOlOrUl(line) {
  return !!(line && (line.match(FIND_MD_UL_RX) || line.match(FIND_MD_OL_RX)));
}

export default Task;
