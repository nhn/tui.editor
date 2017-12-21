/**
* @fileoverview codemirror extension for fix ordered list number
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/

import CodeMirror from 'codemirror';

const listRE = /^(\s*)((\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(.*)/;

/**
 * simple wrapper for indentLess command
 * to run fixOrderedListNumber on Shift-Tab
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {CodeMirror.Pass|null} - next command
 * @ignore
 */
CodeMirror.commands.indentLessOrderedList = cm => {
  if (cm.getOption('disableInput')) {
    return CodeMirror.Pass;
  }
  cm.execCommand('indentLess');
  cm.execCommand('fixOrderedListNumber');

  return null;
};

/**
 * fix ordered list number
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {CodeMirror.Pass|null} - next command
 * @ignore
 */
CodeMirror.commands.fixOrderedListNumber = cm => {
  if (cm.getOption('disableInput')) {
    return CodeMirror.Pass;
  }

  const ranges = cm.listSelections();
  for (let i = 0; i < ranges.length; i += 1) {
    const pos = ranges[i].head;
    const lineNumber = findFirstListItem(pos.line, cm);

    if (lineNumber >= 0) {
      const lineText = cm.getLine(lineNumber);
      const [, indent, , index] = listRE.exec(lineText);
      fixNumber(lineNumber, indent.length, parseInt(index, 10), cm);
    }
  }

  return null;
};

/**
 * fix list numbers
 * @param {number} lineNumber - line number of list item to be normalized
 * @param {number} prevIndentLength - previous indent length
 * @param {number} startIndex - start index
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {number} - next line number
 * @ignore
 */
function fixNumber(lineNumber, prevIndentLength, startIndex, cm) {
  let indent, delimiter, text, indentLength;
  let index = startIndex;
  let lineText = cm.getLine(lineNumber);

  do {
    [, indent, , , delimiter, text] = listRE.exec(lineText);
    indentLength = indent.length;

    if (indentLength === prevIndentLength) {
      // fix number
      cm.replaceRange(`${indent}${index}${delimiter}${text}`, {
        line: lineNumber,
        ch: 0
      }, {
        line: lineNumber,
        ch: lineText.length
      });
      index += 1;
      lineNumber += 1;
    } else if (indentLength > prevIndentLength) {
      // nested list start
      lineNumber = fixNumber(lineNumber, indentLength, 1, cm);
    } else {
      // nested list end
      return lineNumber;
    }

    lineText = cm.getLine(lineNumber);
  } while (listRE.test(lineText));

  return lineNumber;
}

/**
 * find line number of list item which contains given lineNumber
 * @param {number} lineNumber - line number of list item
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {number} - line number of first list item
 * @ignore
 */
function findFirstListItem(lineNumber, cm) {
  let nextLineNumber = lineNumber;
  let lineText = cm.getLine(lineNumber);

  while (listRE.test(lineText)) {
    nextLineNumber -= 1;
    lineText = cm.getLine(nextLineNumber);
  }

  if (lineNumber === nextLineNumber) {
    nextLineNumber = -1;
  } else {
    nextLineNumber += 1;
  }

  return nextLineNumber;
}
