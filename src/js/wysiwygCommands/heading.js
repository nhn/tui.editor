/**
 * @fileoverview Implements Heading wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var WysiwygCommand = require('../wysiwygCommand');

/**
 * Heading
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports Heading
 * @augments Command
 * @augments WysiwygCommand
 */
var Heading = WysiwygCommand.factory(/** @lends Heading */{
    name: 'Heading',
    /**
     *  커맨드 핸들러
     */
    exec: function() {
        var range = this.editor.getSelection();

        if (range.collapsed) {
            return;
        }

        this.editor.changeFormat({tag: 'H3'}, null, range);
        this.editor.focus();
    },
    _getCurrentHeadingDepth: function(range) {
        var depth,
            i;

        for (i = 0; i <= 6; i += 1) {
            if (this.editor.hasFormat('h' + i, null, range)) {
                depth = i;
                break;
            }
        }

        return depth;
    }
});


module.exports = Heading;
