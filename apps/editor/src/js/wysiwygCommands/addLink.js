/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

const CommandManager = require('../commandManager');
import {decodeURIGraceful, encodeMarkdownCharacters} from '../importManager';

/**
 * AddLink
 * Add link markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddLink
 * @ignore
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
        let {url, linkText} = data;
        linkText = decodeURIGraceful(linkText);
        url = encodeMarkdownCharacters(url);

        wwe.focus();

        if (!sq.hasFormat('PRE')) {
            sq.removeAllFormatting();

            if (sq.getSelectedText()) {
                sq.makeLink(url);
            } else {
                const link = sq.createElement('A', {href: url});
                $(link).text(linkText);
                sq.insertElement(link);
            }
        }
    }
});

module.exports = AddLink;
