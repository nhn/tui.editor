/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddLink
 * Add link markdown syntax to wysiwyg Editor
 * @exports AddLink
 * @augments Command
 * @augments WysiwygCommand
 */
var AddLink = CommandManager.command('wysiwyg', /** @lends AddLink */{
    name: 'AddLink',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     *  @param {object} data data for image
     */
    exec: function(wwe, data) {
        var sq = wwe.getEditor(),
            link;

        sq.focus();

        if (!sq.hasFormat('PRE')) {
            sq.removeAllFormatting();

            if (sq.getSelectedText()) {
                sq.makeLink(data.url);
            } else {
                link = sq.createElement('A', {href: data.url});
                $(link).text(data.linkText);
                sq.insertElement(link);
            }
        }
    }
});


module.exports = AddLink;
