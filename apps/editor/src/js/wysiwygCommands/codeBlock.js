/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var CommandManager = require('../commandManager');

var codeBlockID = 0;
var CODEBLOCK_CLASS_PREFIX = 'te-content-codeblock-';
var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

/**
 * CodeBlock
 * Add CodeBlock to wysiwygEditor
 * @exports CodeBlock
 * @augments Command
 * @augments WysiwygCommand
 */
var CodeBlock = CommandManager.command('wysiwyg', /** @lends CodeBlock */{
    name: 'CodeBlock',
    keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
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
            attr = CODEBLOCK_ATTR_NAME + ' class = "' + CODEBLOCK_CLASS_PREFIX + codeBlockID + '"';

            if (type) {
                attr += ' data-language="' + type + '"';
            }

            codeBlockBody = getCodeBlockBody(range, wwe);
            sq.insertHTML('<pre ' + attr + '>' + codeBlockBody + '</pre>');

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

    range.setStartBefore($pre.find('div')[0].firstChild);
    range.collapse(true);

    wwe.getEditor().setSelection(range);
}
/**
 * getCodeBlockBody
 * get text wrapped by code
 * @param {object} range range object
 * @param {object} wwe wysiwyg editor
 * @returns {string}
 */
function getCodeBlockBody(range, wwe) {
    var codeBlock;
    var mgr = wwe.getManager('codeblock');
    var contents, nodes;

    if (range.collapsed) {
        nodes = [$('<div><br></div>')[0]];
    } else {
        contents = range.extractContents();
        nodes = [].slice.call(contents.childNodes);
    }

    codeBlock = mgr.convertToCodeblock(nodes).innerHTML;

    return codeBlock;
}

module.exports = CodeBlock;
