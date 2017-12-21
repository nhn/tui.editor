/**
 * @fileoverview Implements Blockquote markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';

/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Blockquote
 * @ignore
 */
const Blockquote = CommandManager.command('markdown', /** @lends Blockquote */{
    name: 'Blockquote',
    keyMap: ['CTRL+Q', 'META+Q'],
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
        const cm = mde.getEditor();
        const doc = cm.getDoc();

        // range 을 가공함
        const range = mde.getCurrentRange();

        const from = {
            line: range.from.line,
            ch: 0
        };

        const to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };

        // 영역의 텍스트를 가저오고
        const textToModify = doc.getRange(from, to);

        // 텍스트 컨텐트를 변경 한다
        const textLinesToModify = textToModify.split('\n');
        const lineLength = textLinesToModify.length;

        for (let i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = `>${textLinesToModify[i]}`;
        }

        // 해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += 1;

        doc.setCursor(range.to);

        cm.focus();
    }
});

export default Blockquote;
