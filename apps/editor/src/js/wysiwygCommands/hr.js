/**
 * @fileoverview Implements HR wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager'),
    domUtils = require('../domUtils');

/**
 * HR
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports HR
 * @augments Command
 * @augments WysiwygCommand
 */
var HR = CommandManager.command('wysiwyg', /** @lends HR */{
    name: 'HR',
    keyMap: ['CTRL+L', 'META+L'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection(),
            currentNode, nextBlockNode, hr, previousSibling;

        if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            currentNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
            nextBlockNode = domUtils.getTopNextNodeUnder(currentNode, wwe.get$Body()[0]);

            if (!nextBlockNode) {
                nextBlockNode = sq.createDefaultBlock();
                wwe.get$Body().append(nextBlockNode);
            }

            hr = sq.createElement('HR');

            sq.modifyBlocks(function(frag) {
                frag.appendChild(hr);

                return frag;
            });

            previousSibling = hr.previousSibling;
            if (previousSibling
                && domUtils.isTextNode(previousSibling)
                && domUtils.getTextLength(previousSibling) === 0
            ) {
                hr.parentNode.removeChild(previousSibling);
            }

            range.selectNodeContents(nextBlockNode);
            range.collapse(true);

            sq.setSelection(range);
        }

        sq.focus();
    }
});


module.exports = HR;
