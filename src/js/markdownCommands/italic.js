/**
 * @fileoverview Implements Italic markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';

const boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/;
const italicRegex = /^[\*_][^\*_]*[\*_]$/;

/**
 * Italic
 * Add italic markdown syntax to markdown editor
 * @exports Italic
 * @augments Command
 * @ignore
 */
const Italic = CommandManager.command('markdown', /** @lends Italic */{
    name: 'Italic',
    keyMap: ['CTRL+I', 'META+I'],
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
        const cm = mde.getEditor();
        const doc = cm.getDoc();

        const cursor = doc.getCursor();
        let selection = doc.getSelection();
        const isEmpty = !selection;
        let isWithBold = false;
        let tmpSelection;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty) {
            if (cursor.ch > 2) {
                tmpSelection = this.expendWithBoldSelection(doc, cursor);

                if (tmpSelection) {
                    isWithBold = 'with';
                }
            }

            if (isWithBold !== 'with' && cursor.ch > 1) {
                isWithBold = this.expendOnlyBoldSelection(doc, cursor);
            }

            if (!isWithBold && cursor.ch > 0) {
                this.expendSelection(doc, cursor);
                selection = tmpSelection || selection;
            }
        }

        const isRemoved = this.isNeedRemove(selection);
        const result = isRemoved ? this.remove(selection) : this.append(selection);

        doc.replaceSelection(result, 'around');

        if (isEmpty) {
            this.setCursorToCenter(doc, cursor, isRemoved);
        }

        cm.focus();
    },
    /**
     * isNeedRemove
     * 이미 텍스트에 이탤릭이나 볼드가 적용되어 있는지 판단한다
     * @param {string} text 텍스트
     * @returns {boolean} 적용 여부
     */
    isNeedRemove(text) {
        return italicRegex.test(text) || boldItalicRegex.test(text);
    },
    /**
     * append
     * 텍스트에 이탤릭을 적용한다
     * @param {string} text 적용할 텍스트
     * @returns {string} 이탤릭이 적용된 텍스트
     */
    append(text) {
        return `_${text}_`;
    },
    /**
     * remove
     * 텍스트에서 이탤릭을 제거한다
     * @param {string} text 제거할 텍스트
     * @returns {string} 제거된 텍스트
     */
    remove(text) {
        return text.substr(1, text.length - 2);
    },
    /**
     * expendWithBoldSelection
     * 볼드와 함께 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @returns {string} 확장된 영역의 텍스트
     */
    expendWithBoldSelection(doc, cursor) {
        const tmpSelection = doc.getSelection();
        let result;
        const start = {
            line: cursor.line,
            ch: cursor.ch - 3
        };
        const end = {
            line: cursor.line,
            ch: cursor.ch + 3
        };

        doc.setSelection(start, end);

        if (tmpSelection === '******' || tmpSelection === '______') {
            result = tmpSelection;
        } else {
            doc.setSelection(cursor);
        }

        return result;
    },
    /**
     * expendOnlyBoldSelection
     * 볼드만 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @returns {string} 확장된 영역의 텍스트
     */
    expendOnlyBoldSelection(doc, cursor) {
        const tmpSelection = doc.getSelection();
        let result = false;
        const start = {
            line: cursor.line,
            ch: cursor.ch - 2
        };
        const end = {
            line: cursor.line,
            ch: cursor.ch + 2
        };

        doc.setSelection(start, end);

        if (tmpSelection === '****' || tmpSelection === '____') {
            doc.setSelection(cursor);
            result = 'only';
        }

        return result;
    },
    /**
     * expendSelection
     * 이탤릭이 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @returns {string} 확장된 영역의 텍스트
     */
    expendSelection(doc, cursor) {
        const tmpSelection = doc.getSelection();
        let result;
        const start = {
            line: cursor.line,
            ch: cursor.ch - 2
        };
        const end = {
            line: cursor.line,
            ch: cursor.ch + 2
        };

        doc.setSelection(start, end);

        if (tmpSelection === '****' || tmpSelection === '____') {
            result = tmpSelection;
        } else {
            doc.setSelection(cursor);
        }

        return result;
    },
    /**
     * setCursorToCenter
     * 커서를 중앙으로 이동시킨다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @param {boolean} isRemoved 변경사항이 지우는 변경이었는지 여부
     */
    setCursorToCenter(doc, cursor, isRemoved) {
        const pos = isRemoved ? -1 : 1;
        doc.setCursor(cursor.line, cursor.ch + pos);
    }
});

module.exports = Italic;
