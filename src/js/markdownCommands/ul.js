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

    const oneDepthList = listManager.findOneDepthList(doc, startLineNumber, endLineNumber);
    oneDepthList.forEach(lineNumber => {
      changeToUL(listManager, doc, doc.getLine(lineNumber), lineNumber);
    });

    for (let i = startLineNumber; i <= endLineNumber; i += 1) {
      const line = doc.getLine(i);

      if (listManager.isListOrParagraph(line)) {
        const depth = listManager.getListDepth(doc, i);
        if (depth !== 1) {
          changeToUL(listManager, doc, line, i);
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
 * Change to ul list
 * @param {MdListManager} listManager MdListManager
 * @param {object} doc CodeMirror doc instance
 * @param {string} lineText text of the line
 * @param {number} lineNumber line number
 * @param {number} ordinalNumber ordinal number
 */
function changeToUL(listManager, doc, lineText, lineNumber) {
  if (isUlTask(lineText)) {
    listManager.replaceLineText(doc, lineNumber, MD_UL_TASK_SYNTAX_RX, '$1 ');
  } else if (isOlOrTask(lineText)) {
    listManager.replaceLineText(doc, lineNumber, MD_UL_OR_UL_TASK_SYNTAX_RX, '* ');
  } else if (!lineText.match(FIND_MD_UL_RX)) {
    doc.replaceRange('* ', {
      line: lineNumber,
      ch: 0
    });
  }
}

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
