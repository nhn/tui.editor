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
        let replaceText = '';
        let rowFix;

        const range = cm.getCursor();

        if (doc.getLine(range.line).length) {
            replaceText += '\n``` \n\n```\n\n';
            doc.setCursor(range.line + 1, 0);
            rowFix = 3;
        } else {
            replaceText += '\n``` \n\n```\n';
            rowFix = 2;
        }
        doc.replaceSelection(replaceText);
        cm.setCursor(doc.getCursor().line - rowFix, 0);

        cm.focus();
    }
});

module.exports = CodeBlock;
