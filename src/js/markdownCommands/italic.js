/**
 * @fileoverview Implements Italic markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/;
var italicRegex = /^[\*_][^\*_]*[\*_]$/;

var CodeMirror = window.CodeMirror;

/**
 * Italic
 * Add italic markdown syntax to markdown editor
 * @exports Italic
 * @augments Command
 * @augments MarkdownCommand
 */
var Italic = CommandManager.command('markdown',/** @lends Italic */{
    name: 'Italic',
    keyMap: ['Ctrl-I', 'Ctrl-I'],
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var cursor, selection, tmpSelection, isRemoved, result, isEmpty, isWithBold,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        cursor = doc.getCursor();
        selection = doc.getSelection();
        isEmpty = !selection;
        isWithBold = false;

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

        isRemoved = this.isNeedRemove(selection);
        result = isRemoved ? this.remove(selection) : this.append(selection);

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
        return '_' + text + '_';
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
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendWithBoldSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 3}, {line: cursor.line, ch: cursor.ch + 3});

        if (tmpSelection === '******' || tmpSelection === '______') {
            return tmpSelection;
        } else {
            doc.setSelection(cursor);
        }
    },
    /**
     * expendOnlyBoldSelection
     * 볼드만 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendOnlyBoldSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

        if (tmpSelection === '****' || tmpSelection === '____') {
            doc.setSelection(cursor);
            return 'only';
        }

        return false;
    },
    /**
     * expendSelection
     * 이탤릭이 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

        if (tmpSelection === '**' || tmpSelection === '__') {
            return tmpSelection;
        } else {
            doc.setSelection(cursor);
        }
    },
    /**
     * setCursorToCenter
     * 커서를 중앙으로 이동시킨다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @param {boolean} isRemoved 변경사항이 지우는 변경이었는지 여부
     */
    setCursorToCenter: function(doc, cursor, isRemoved) {
        var pos = isRemoved ? -1 : 1;
        doc.setCursor(cursor.line, cursor.ch + pos);
    }
});

module.exports = Italic;
