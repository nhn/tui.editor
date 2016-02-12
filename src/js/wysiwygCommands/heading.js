/**
 * @fileoverview Implements Heading wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');
var domUtils = require('../domUtils');

/**
 * Heading
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports Heading
 * @augments Command
 * @augments WysiwygCommand
 */
var Heading = CommandManager.command('wysiwyg', /** @lends Heading */{
    name: 'Heading',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     *  @param {Number} size size
     */
    exec: function(wwe, size) {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange();

        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            if (range.collapsed
                || domUtils.getNodeName(range.commonAncestorContainer) === 'DIV'
                || domUtils.getNodeName(range.commonAncestorContainer) === 'TEXT'
            ) {
                wwe.changeBlockFormatTo('H' + size);
            }
        }

        sq.focus();
    }
});

module.exports = Heading;
