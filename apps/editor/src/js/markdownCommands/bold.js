/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';

const boldRegex = /^[*_]{2,}[^*_]*[*_]{2,}$/;

/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @exports Bold
 * @augments Command
 * @ignore
 */
const Bold = CommandManager.command('markdown', /** @lends Bold */{
    name: 'Bold',
    keyMap: ['CTRL+B', 'META+B'],
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
        const cm = mde.getEditor();
        const doc = cm.getDoc();

        const cursor = doc.getCursor();
        let selection = doc.getSelection();
        const isEmpty = !selection;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty && cursor.ch > 1) {
            const tmpSelection = this.expendSelection(doc, cursor);
            selection = tmpSelection || selection;
        }

        const isRemoved = this.isNeedRemove(selection);
        const result = isRemoved ? this.remove(selection) : this.append(selection);

        doc.replaceSelection(result, 'around');

        if (isEmpty && !isRemoved) {
            this.setCursorToCenter(doc, cursor);
        }

        cm.focus();
    },
    /**
     * 이미 Bold가 적용이 되어있는지 확인
     * @param {string} text 셀렉션텍스트
     * @returns {boolean} 볼드 적용 여부
     */
    isNeedRemove(text) {
        return boldRegex.test(text);
    },
    /**
     * Bold를 적용한다
     * @param {string} text 셀렉션텍스트
     * @returns {string} 볼드가 적용된 텍스트
     */
    append(text) {
        return `**${text}**`;
    },
    /**
     * Bold를 제거한다
     * @param {string} text 셀렉션텍스트
     * @returns {string} 볼드가 제거된 텍스트
     */
    remove(text) {
        return text.substr(2, text.length - 4);
    },
    /**
     * 셀렉션영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
     * @param {object} cursor 코드미러 커서 객체
     * @returns {string} 셀렉션의 텍스트
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
     * 커서를 센터로 이동시킨다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
     * @param {object} cursor 코드미러 커서 객체
     */
    setCursorToCenter(doc, cursor) {
        doc.setCursor(cursor.line, cursor.ch + 2);
    }
});

module.exports = Bold;
