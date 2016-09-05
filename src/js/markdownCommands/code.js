/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import CommandManager from '../commandManager';

/**
 * Code
 * Add code markdown syntax to markdown editor
 * @exports Code
 * @augments Command
 */
const Code = CommandManager.command('markdown', /** @lends Code */{
    name: 'Code',
    keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
        const cm = mde.getEditor();
        const doc = cm.getDoc();

        const selection = doc.getSelection();
        const range = cm.getCursor();

        doc.replaceSelection(this.append(selection), 'around');

        if (!selection) {
            doc.setCursor(range.line, range.ch + 1);
        }

        cm.focus();
    },
    /**
     * Code를 적용한다
     * @param {string} text 셀렉션텍스트
     * @returns {string} 가 적용된 텍스트
     */
    append(text) {
        return `\`${text}\``;
    }
});

module.exports = Code;
