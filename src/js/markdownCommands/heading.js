/**
 * @fileoverview Implements Heading markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';

import CommandManager from '../commandManager';

const FIND_HEADING_RX = /^#+\s/g;

/**
 * Heading
 * Add heading markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Heading
 * @ignore
 */
const Heading = CommandManager.command('markdown', /** @lends Heading */{
  name: 'Heading',
  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   * @param {number} size heading size
   */
  exec(mde, size) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();

    // 선택된 영역을 가공함
    const range = mde.getCurrentRange();

    const from = {
      line: range.from.line,
      ch: 0
    };

    const to = {
      line: range.to.line,
      ch: doc.getLineHandle(range.to.line).text.length
    };

    const lengthOfCurrentLineBefore = doc.getLine(to.line).length;

    // 영역의 텍스트를 가저오고
    const textToModify = doc.getRange(from, to);

    // 원하는 대로 가공한다
    const textLinesToModify = textToModify.split('\n');

    util.forEachArray(textLinesToModify, (line, index) => {
      textLinesToModify[index] = getHeadingMarkdown(line, size);
    });

    // 해당 에디터의 내용을 변경한다
    doc.replaceRange(textLinesToModify.join('\n'), from, to);

    range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;

    doc.setSelection(from, range.to);

    cm.focus();
  }
});

/**
 * Get heading markdown
 * @param {string} text Source test
 * @param {number} size size
 * @returns {string}
 */
function getHeadingMarkdown(text, size) {
  const foundedHeading = text.match(FIND_HEADING_RX);
  let heading = '';

  do {
    heading += '#';
    size -= 1;
  } while (size > 0);

  if (foundedHeading) {
    [, text] = text.split(foundedHeading[0]);
  }

  return `${heading} ${text}`;
}

export default Heading;
