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
     *  @param {Squire} editor Squire instance
     */
    exec: function(editor) {
        var range = editor.getSelection();

        if (range.collapsed) {
            return;
        }

        editor.changeFormat({tag: 'H3'}, null, range);
        editor.focus();
    },
    _getCurrentHeadingDepth: function(range) {
        var depth,
            i;

        for (i = 0; i <= 6; i += 1) {
            if (editor.hasFormat('h' + i, null, range)) {
                depth = i;
                break;
            }
        }

        return depth;
    }
});


module.exports = Heading;
