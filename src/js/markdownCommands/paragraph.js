/**
 * @fileoverview Implements Paragraph markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 * @author Jiung Kang(jiung-kang@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';

const {util} = tui;

/**
 * Paragraph
 * Convert selected lines to paragraph
 * @exports Paragraph
 * @augments Command
 * @ignore
 */
const Paragraph = CommandManager.command('markdown', /** @lends Paragraph */{
    name: 'Paragraph',
    /**
     * Command Handler
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
        const to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };

        const lengthOfCurrentLineBefore = doc.getLine(to.line).length;
        const textToModify = doc.getRange(from, to);
        const textLines = textToModify.split('\n');

        util.forEachArray(textLines, (line, index) => {
            textLines[index] = getParagraphMarkdown(line);
        });

        doc.replaceRange(textLines.join('\n'), from, to);

        range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;

        doc.setSelection(from, to);

        cm.focus();
    }
});
/**
 * Get paragraph markdown lineText
 * @param {string} lineText line lineText
 * @returns {string}
 */
function getParagraphMarkdown(lineText) {
    const headingRx = /^(#{1,6}| *((?:\*|-|\d\.)(?: \[[ xX]])?)) /;

    return lineText.replace(headingRx, '');
}

module.exports = Paragraph;
