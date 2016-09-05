/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */


const CommandManager = require('../commandManager');

/**
 * AddLink
 * Add link markdown syntax to wysiwyg Editor
 * @exports AddLink
 * @augments Command
 * @augments WysiwygCommand
 */
const AddLink = CommandManager.command('wysiwyg', /** @lends AddLink */{
    name: 'AddLink',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     *  @param {object} data data for image
     */
    exec(wwe, data) {
        const sq = wwe.getEditor();

        sq.focus();

        if (!sq.hasFormat('PRE')) {
            sq.removeAllFormatting();

            if (sq.getSelectedText()) {
                sq.makeLink(data.url);
            } else {
                const link = sq.createElement('A', {href: data.url});
                $(link).text(data.linkText);
                sq.insertElement(link);
            }
        }
    }
});

module.exports = AddLink;
