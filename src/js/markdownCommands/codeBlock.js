/**
 * @fileoverview CodeBlock markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import CommandManager from '../commandManager';

/**
 * CodeBlock
 * Add CodeBlock markdown syntax to markdown editor
 * @exports CodeBlock
 * @augments Command
 * @ignore
 */
const CodeBlock = CommandManager.command('markdown', /** @lends CodeBlock */{
    name: 'CodeBlock',
    keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
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
        const to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };
        const textToModify = doc.getRange(from, to);
        const textLinesToModify = textToModify.split('\n');
        textLinesToModify.unshift('```');
        textLinesToModify.push('```');
        const lineLength = textLinesToModify.length;
        for (let i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = textLinesToModify[i];
        }
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += 1;

        doc.setCursor(range.to);

        cm.focus();
    }
});

module.exports = CodeBlock;
