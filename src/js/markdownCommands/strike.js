/**
 * @fileoverview Implements StrikeThrough markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';

const strikeRegex = /^[~~](.*[\s\n]*.*)*[~~]$/;

/**
 * Strike
 * Add strike markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Strike
 * @ignore
 */
const Strike = CommandManager.command('markdown', /** @lends Strike */{
  name: 'Strike',
  keyMap: ['CTRL+S', 'META+S'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    const cursor = doc.getCursor();
    const selection = doc.getSelection();
    const isNeedToRemove = this.hasStrikeSyntax(selection);

    let result;

    if (isNeedToRemove) {
      result = this.remove(selection);
    } else {
      result = this.append(selection);
    }

    doc.replaceSelection(result, 'around');

    const isEmptySelection = !selection;

    if (isEmptySelection && !isNeedToRemove) {
      this.setCursorToCenter(doc, cursor, isNeedToRemove);
    }

    cm.focus();
  },
  /**
   * hasStrikeSyntax
   * @param {string} text Source text
   * @returns {boolean} Boolean value of strike syntax removal
   */
  hasStrikeSyntax(text) {
    return strikeRegex.test(text);
  },
  /**
   * append
   * @param {string} text 적용할 텍스트
   * @returns {string} strikeThrough text
   */
  append(text) {
    return `~~${text}~~`;
  },
  /**
   * remove
   * @param {string} text 제거할 텍스트
   * @returns {string} 제거된 텍스트
   */
  remove(text) {
    return text.substr(2, text.length - 4);
  },
  /**
   * setCursorToCenter
   * 커서를 중앙으로 이동시킨다
   * @param {CodeMirror.doc} doc 코드미러 도큐먼트
   * @param {object} cursor 커서객체
   * @param {boolean} isRemoved 변경사항이 지우는 변경이었는지 여부
   */
  setCursorToCenter(doc, cursor, isRemoved) {
    const pos = isRemoved ? -2 : 2;
    doc.setCursor(cursor.line, cursor.ch + pos);
  }
});

export default Strike;
