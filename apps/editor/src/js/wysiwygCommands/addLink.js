/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var WysiwygCommand = require('../wysiwygCommand');

/**
 * AddLink
 * Add link markdown syntax to wysiwyg Editor
 * @exports AddLink
 * @augments Command
 * @augments WysiwygCommand
 */
var AddLink = WysiwygCommand.factory(/** @lends AddLink */{
    name: 'AddLink',
    /**
     *  커맨드 핸들러
     *  @param {Squire} editor Squire instance
     *  @param {object} data data for link
     */
    exec: function(editor, data) {
        this.editor.makeLink(data.url);
        this.editor.focus();
    }
});


module.exports = AddLink;
