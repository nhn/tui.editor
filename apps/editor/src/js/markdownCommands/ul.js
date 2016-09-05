/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import CommandManager from '../commandManager';

const FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/;
const FIND_MD_UL_RX = /^[ \t]*\* .*/;

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @exports UL
 * @augments Command
 */
const UL = CommandManager.command('markdown', /** @lends UL */{
    name: 'UL',
    keyMap: ['CTRL+U', 'META+U'],
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
        const cm = mde.getEditor();
        const doc = cm.getDoc();
        const range = mde.getCurrentRange();

        const from = {
            line: range.from.line,
            ch: 0
        };

        let line = doc.getLine(from.line);

        let to;

        if (line.match(FIND_MD_OL_RX)) {
            line = line.replace(/[\d]+\. /, '* ');

            to = {
                line: from.line,
                ch: line.length + 1
            };

            doc.replaceRange(line, from, to);
        } else if (!line.match(FIND_MD_UL_RX)) {
            doc.replaceRange('* ', from);
        }

        cm.focus();
    }
});

module.exports = UL;
