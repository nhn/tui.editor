/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownCommand = require('../markdownCommand');

var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;

/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @exports Bold
 * @augments Command
 * @augments MarkdownCommand
 */
var Bold = MarkdownCommand.factory(/** @lends Bold */{
    name: 'Bold',
    keyMap: ['Ctrl-B', 'Ctrl-B'],
    /**
     *  커맨드 핸들러
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function() {
        var cursor,
            selection,
            tmpSelection,
            isRemoved,
            result,
            isEmpty;

        if (!this.isAvailable()) {
            return this.getPass();
        }

        cursor = this.doc.getCursor();
        selection = this.doc.getSelection();
        isEmpty = !selection;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty && cursor.ch > 1) {
            tmpSelection = this.expendSelection(this.doc, cursor);
            selection = tmpSelection || selection;
        }

        isRemoved = this.isNeedRemove(selection);
        result = isRemoved ? this.remove(selection) : this.append(selection);

        this.doc.replaceSelection(result, 'around');

        if (isEmpty && !isRemoved) {
            this.setCursorToCenter(this.doc, cursor);
        }

        this.cm.focus();
    },
    /**
     * 이미 Bold가 적용이 되어있는지 확인
     * @param {string} text 셀렉션텍스트
     * @return {boolean} 볼드 적용 여부
     */
    isNeedRemove: function(text) {
        return boldRegex.test(text);
    },
    /**
     * Bold를 적용한다
     * @param {string} text 셀렉션텍스트
     * @return {string} 볼드가 적용된 텍스트
     */
    append: function(text) {
        return '**' + text + '**';
    },
    /**
     * Bold를 제거한다
     * @param {string} text 셀렉션텍스트
     * @return {string} 볼드가 제거된 텍스트
     */
    remove: function(text) {
        return text.substr(2, text.length - 4);
    },
    /**
     * 셀렉션영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
     * @param {object} cursor 코드미러 커서 객체
     * @return {string} 셀렉션의 텍스트
     */
    expendSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

        if (tmpSelection === '****' || tmpSelection === '____') {
            return tmpSelection;
        } else {
            doc.setSelection(cursor);
        }
    },
    /**
     * 커서를 센터로 이동시킨다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
     * @param {object} cursor 코드미러 커서 객체
     */
    setCursorToCenter: function(doc, cursor) {
        doc.setCursor(cursor.line, cursor.ch + 2);
    }
});

module.exports = Bold;
