/**
 * @fileoverview Implements AddImage wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddImage
 * Add Image markdown syntax to wysiwyg Editor
 * @exports AddImage
 * @augments Command
 * @augments WysiwygCommand
 */
var AddImage = CommandManager.command('wysiwyg', /** @lends AddImage */{
    name: 'AddImage',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     *  @param {object} data data for image
     */
    exec: function(wwe, data) {
        var sq = wwe.getEditor();

        sq.focus();

        if (!sq.hasFormat('PRE')) {
            sq.insertImage(data.imageUrl);
        }
    }
});


module.exports = AddImage;
