/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var codeBlockID = 0,
    CODEBLOCK_CLASS_PREFIX = 'te-content-codeblock-';
/**
 * CodeBlock
 * Add CodeBlock to wysiwygEditor
 * @exports CodeBlock
 * @augments Command
 * @augments WysiwygCommand
 */
var CodeBlock = CommandManager.command('wysiwyg', /** @lends CodeBlock */{
    name: 'CodeBlock',
    keyMap: ['SHIFT+CTRL+P', 'SHIFT+CTRL+P'],
    /**
     * Command handler
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     * @param {string} type of language
     */
    exec: function(wwe, type) {
        var attr, codeBlockBody;
        var sq = wwe.getEditor();
        var range = sq.getSelection().cloneRange();
        if (!sq.hasFormat('PRE')) {
            attr = ' class = "' + CODEBLOCK_CLASS_PREFIX + codeBlockID + '"';

            if (type) {
                attr += ' data-language="' + type + '"';
            }

            removeTextDecorations(sq);

            codeBlockBody = getCodeBlockBody(range);
            sq.insertHTML('<pre' + attr + '>' + codeBlockBody + '</pre>');

            focusToFirstCode(wwe.get$Body().find('.' + CODEBLOCK_CLASS_PREFIX + codeBlockID), wwe);

            codeBlockID += 1;
        }

        sq.focus();
    }
});

/**
 * focusToFirstCode
 * Focus to first code tag content of pre tag
 * @param {jQuery} $pre pre tag
 * @param {WysiwygEditor} wwe wysiwygEditor
 */
function focusToFirstCode($pre, wwe) {
    var range = wwe.getEditor().getSelection().cloneRange();

    range.setStart($pre.find('code')[0].firstChild, 0);
    range.collapse(true);

    wwe.getEditor().setSelection(range);
}
/**
 * getCodeBlockBody
 * get text wrapped by code
 * @param {object} range range object
 * @returns {string}
 */
function getCodeBlockBody(range) {
    var text, nodes;
    var line = '';

    if (range.collapsed) {
        text = '&#8203';
        line += '<div><code>' + text + '</code><br></div>';
    } else if (range.startContainer === range.endContainer) {
        text = $(range.startContainer).text().substring(range.startOffset, range.endOffset);
        line += '<div><code>' + text + '</code><br></div>';
    } else {
        nodes = [].slice.call(range.commonAncestorContainer.childNodes);

        tui.util.forEachArray(nodes, function(node) {
            text = $(node).text();
            line += '<div><code>' + text + '</code><br></div>';
        });
    }

    return line;
}

/**
 * removeTextDecorations
 * remove bold, italic, strikeThrough styles
 * @param {object} sq squire instance
 */
function removeTextDecorations(sq) {
    if (sq.hasFormat('b')) {
        sq.removeBold(sq.getSelection());
    } else if (sq.hasFormat('i')) {
        sq.removeItalic(sq.getSelection());
    } else if (sq.hasFormat('s')) {
        sq.removeStrikethrough(sq.getSelection());
    }
}

module.exports = CodeBlock;
