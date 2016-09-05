/**
 * @fileoverview Implements Task markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import CommandManager from '../commandManager';

/**
 * Task
 * @exports Task
 * @augments Command
 */

const Task = CommandManager.command('markdown', /** @lends Task */{
    name: 'Task',
    keyMap: ['CTRL+T', 'META+T'],
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
            ch: range.from.ch
        };

        const to = {
            line: range.to.line,
            ch: range.to.ch
        };

        const replaceText = '* [ ] ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = Task;
