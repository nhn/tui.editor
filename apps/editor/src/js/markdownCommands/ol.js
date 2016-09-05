/**
 * @fileoverview Implements OL markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import CommandManager from '../commandManager';

const FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/;
const FIND_MD_UL_RX = /^[ \t]*\* .*/;

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @exports OL
 * @augments Command
 */
const OL = CommandManager.command('markdown', /** @lends OL */{
    name: 'OL',
    keyMap: ['CTRL+O', 'META+O'],
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

        if (line.match(FIND_MD_UL_RX)) {
            line = line.replace(/\* /, '1. ');

            to = {
                line: from.line,
                ch: line.length - 1
            };

            doc.replaceRange(line, from, to);
        } else if (!line.match(FIND_MD_OL_RX)) {
            doc.replaceRange('1. ', from);
        }

        cm.focus();
    }
});

module.exports = OL;
