/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

const CommandManager = require('../commandManager');

/**
 * Blockquote
 * Add Blockquote to selected wysiwyg editor content
 * @exports Blockquote
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */
const Blockquote = CommandManager.command('wysiwyg', /** @lends Blockquote */{
    name: 'Blockquote',
    keyMap: ['CTRL+Q', 'META+Q'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();

        wwe.focus();

        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            wwe.unwrapBlockTag();
            sq.increaseQuoteLevel();
        }
    }
});

module.exports = Blockquote;
