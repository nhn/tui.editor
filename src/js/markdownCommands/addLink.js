/**
 * @fileoverview Implements Addlink markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';
import {decodeURIGraceful, encodeMarkdownCharacters, escapeMarkdownCharacters} from '../importManager';

/**
 * AddLink
 * Add link markdown syntax to markdown editor
 * @exports AddLink
 * @augments Command
 * @ignore
 */
const AddLink = CommandManager.command('markdown', /** @lends AddLink */{
    name: 'AddLink',
    /**
     * command handler for AddLink
     * @param {MarkdownEditor} mde - MarkdownEditor instance
     * @param {object} data - data for image
     */
    exec(mde, data) {
        const cm = mde.getEditor();
        const doc = cm.getDoc();

        const range = mde.getCurrentRange();

        const from = {
            line: range.from.line,
            ch: range.from.ch
        };

        const to = {
            line: range.to.line,
            ch: range.to.ch
        };

        let {linkText, url} = data;
        linkText = decodeURIGraceful(linkText);
        linkText = escapeMarkdownCharacters(linkText);
        url = encodeMarkdownCharacters(url);

        const replaceText = `[${linkText}](${url})`;

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = AddLink;
