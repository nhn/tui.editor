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
const MD_LIST_OL_SYNTAX_RX = /([\d]+\.) /;

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

    const oneDepthList = listManager.findOneDepthList(doc, startLineNumber, endLineNumber);
    let ordinalNumber = 1;
    oneDepthList.forEach(lineNumber => {
      changeToOL(listManager, doc, doc.getLine(lineNumber), lineNumber, ordinalNumber);
      ordinalNumber += 1;
    });

    let numbers = [];
    for (let i = startLineNumber; i <= endLineNumber; i += 1) {
      const lineText = doc.getLine(i);

      if (listManager.isListOrParagraph(lineText)) {
        const depth = listManager.getListDepth(doc, i);
        if (depth !== 1) {
          numbers[depth] = numbers[depth] ? numbers[depth] + 1 : 1;
          changeToOL(listManager, doc, lineText, i, numbers[depth]);
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
 * Change to ol list
 * @param {MdListManager} listManager MdListManager
 * @param {CodeMirror.Doc} doc doc of cm
 * @param {string} lineText text of the line
 * @param {number} lineNumber line number
 * @param {number} ordinalNumber ordinal number
 */
function changeToOL(listManager, doc, lineText, lineNumber, ordinalNumber) {
  if (isUlOrTask(lineText)) {
    listManager.replaceLineText(doc, lineNumber, MD_LIST_OR_TASK_SYNTAX_RX, `${ordinalNumber}. `);
  } else if (lineText.match(FIND_MD_OL_RX)) {
    listManager.replaceLineText(doc, lineNumber, MD_LIST_OL_SYNTAX_RX, `${ordinalNumber}. `);
  } else {
    doc.replaceRange(`${ordinalNumber}. `, {
      line: lineNumber,
      ch: 0
    });
  }
}

/**
 * Return whether passed line is UL or TASK or neither
 * @param {string} line Line text
 * @returns {boolean}
 */
function isUlOrTask(line) {
  return !!(line && (line.match(FIND_MD_TASK_RX) || line.match(FIND_MD_UL_RX)));
}

export default OL;
