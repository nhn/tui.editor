'use strict';

var MarkdownCommand = require('../markdownCommand');

var boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/;
var italicRegex = /^[\*_][^\*_]*[\*_]$/;

/**
 * Italic
 * @exports Italic
 * @extends {MarkdownCommand}
 * @constructor
 * @class
 */
var Italic = MarkdownCommand.extend(/** @lends Italic.prototype */{
    keyMap: ['Ctrl-I', 'Ctrl-I'],
    init: function Italic() {
        MarkdownCommand.call(this, 'Italic');
    },
    /**
     * exec
     * 커맨드 핸들러
     * @return {number} 코드미러 상수
     */
    exec: function() {
        var cursor,
            selection,
            tmpSelection,
            isRemoved,
            result,
            isEmpty,
            isWithBold;

        if (!this.isAvailable()) {
            return this.getPass();
        }

        cursor = this.doc.getCursor();
        selection = this.doc.getSelection();
        isEmpty = !selection;
        isWithBold = false;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty) {
            if (cursor.ch > 2) {
                tmpSelection = this.expendWithBoldSelection(cursor);

                if (tmpSelection) {
                    isWithBold = 'with';
                }
            }

            if (isWithBold !== 'with' && cursor.ch > 1) {
                isWithBold = this.expendOnlyBoldSelection(cursor);
            }

            if (!isWithBold && cursor.ch > 0) {
                this.expendSelection(cursor);
                selection = tmpSelection || selection;
            }
        }

        isRemoved = this.isNeedRemove(selection);
        result = isRemoved ? this.remove(selection) : this.append(selection);

        this.doc.replaceSelection(result, 'around');

        if (isEmpty) {
            this.setCursorToCenter(cursor, isRemoved);
        }

        this.cm.focus();
    },
    /**
     * isNeedRemove
     * 이미 텍스트에 이탤릭이나 볼드가 적용되어 있는지 판단한다
     * @param {string} text 텍스트
     * @return {boolean} 적용 여부
     */
    isNeedRemove: function(text) {
        return italicRegex.test(text) || boldItalicRegex.test(text);
    },
    /**
     * append
     * 텍스트에 이탤릭을 적용한다
     * @param {string} text 적용할 텍스트
     * @return {string} 이탤릭이 적용된 텍스트
     */
    append: function(text) {
        return '*' + text + '*';
    },
    /**
     * remove
     * 텍스트에서 이탤릭을 제거한다
     * @param {string} text 제거할 텍스트
     * @return {string} 제거된 텍스트
     */
    remove: function(text) {
        return text.substr(1, text.length - 2);
    },
    /**
     * expendWithBoldSelection
     * 볼드와 함께 적용된 셀렉션 영역을 확장한다
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendWithBoldSelection: function(cursor) {
        var tmpSelection = this.doc.getSelection();

        this.doc.setSelection({line: cursor.line, ch: cursor.ch - 3}, {line: cursor.line, ch: cursor.ch + 3});

        if (tmpSelection === '******' || tmpSelection === '______') {
            return tmpSelection;
        } else {
            this.doc.setSelection(cursor);
        }
    },
    /**
     * expendOnlyBoldSelection
     * 볼드만 적용된 셀렉션 영역을 확장한다
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendOnlyBoldSelection: function(cursor) {
        var tmpSelection = this.doc.getSelection();

        this.doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

        if (tmpSelection === '****' || tmpSelection === '____') {
            this.doc.setSelection(cursor);
            return 'only';
        }

        return false;
    },
    /**
     * expendSelection
     * 이탤릭이 적용된 셀렉션 영역을 확장한다
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendSelection: function(cursor) {
        var tmpSelection = this.doc.getSelection();

        this.doc.setSelection({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

        if (tmpSelection === '**' || tmpSelection === '__') {
            return tmpSelection;
        } else {
            this.doc.setSelection(cursor);
        }
    },
    /**
     * setCursorToCenter
     * 커서를 중앙으로 이동시킨다
     * @param {object} cursor 커서객체
     * @param {boolean} isRemoved 변경사항이 지우는 변경이었는지 여부
     */
    setCursorToCenter: function(cursor, isRemoved) {
        var pos = isRemoved ? -1 : 1;
        this.doc.setCursor(cursor.line, cursor.ch + pos);
    }
});

module.exports = new Italic();
