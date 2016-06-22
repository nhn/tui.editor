/**
 * @fileoverview Implements StrikeThrough markdown command
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var strikeRegex = /^[~~](.*[\s\n]*.*)*[~~]$/;

/**
 * Strike
 * Add strike markdown syntax to markdown editor
 * @exports Strike
 * @augments Command
 */
var Strike = CommandManager.command('markdown', /** @lends Strike */{
    name: 'Strike',
    keyMap: ['CTRL+S', 'META+S'],
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var cm = mde.getEditor();
        var doc = cm.getDoc();
        var cursor = doc.getCursor();
        var selection = doc.getSelection();
        var isNeedToRemove, isEmptySelection, result;

        isNeedToRemove = this.hasStrikeSyntax(selection);
        if (isNeedToRemove) {
            result = this.remove(selection);
        } else {
            result = this.append(selection);
        }

        doc.replaceSelection(result, 'around');

        isEmptySelection = !selection;
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
    hasStrikeSyntax: function(text) {
        return strikeRegex.test(text);
    },
    /**
     * append
     * @param {string} text 적용할 텍스트
     * @returns {string} strikeThrough text
     */
    append: function(text) {
        return '~~' + text + '~~';
    },
    /**
     * remove
     * @param {string} text 제거할 텍스트
     * @returns {string} 제거된 텍스트
     */
    remove: function(text) {
        return text.substr(2, text.length - 4);
    },
    /**
     * setCursorToCenter
     * 커서를 중앙으로 이동시킨다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @param {boolean} isRemoved 변경사항이 지우는 변경이었는지 여부
     */
    setCursorToCenter: function(doc, cursor, isRemoved) {
        var pos = isRemoved ? -2 : 2;
        doc.setCursor(cursor.line, cursor.ch + pos);
    }
});

module.exports = Strike;
