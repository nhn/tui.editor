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
        const replaceText = [
            '```',
            doc.getSelection(),
            '```'
        ];
        let cursorOffset = 1;
        if (range.from.ch !== 0) {
            replaceText.unshift('');
            cursorOffset += 1;
        }
        if (doc.getLineHandle(range.to.line).text.length !== range.to.ch) {
            replaceText.push('');
        }
        doc.replaceSelection(replaceText.join('\n'));

        cm.setCursor(range.from.line + cursorOffset, 0);

        cm.focus();
    }
});

module.exports = CodeBlock;
