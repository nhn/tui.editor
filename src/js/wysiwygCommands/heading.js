/**
 * @fileoverview Implements Heading wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Heading
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports Heading
 * @augments Command
 * @augments WysiwygCommand
 */
var Heading = CommandManager.command('wysiwyg',/** @lends Heading */{
    name: 'Heading',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            foundedHeading = wwe.hasFormatWithRx(/h[\d]/i),
            depth = 1,
            beforeDepth;

        if (sq.getSelection().collapsed && !sq.hasFormat('TABLE')) {
            if (foundedHeading) {
                beforeDepth = parseInt(foundedHeading[0].replace(/h/i, ''), 10);
            }

            if (beforeDepth && beforeDepth < 6) {
                depth = beforeDepth + 1;
            }

            wwe.changeBlockFormatTo('H' + depth);
        }

        sq.focus();
    }
});

module.exports = Heading;
