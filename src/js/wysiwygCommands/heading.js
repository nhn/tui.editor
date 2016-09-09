/**
 * @fileoverview Implements Heading wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */


const CommandManager = require('../commandManager');
const domUtils = require('../domUtils');

/**
 * Heading
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports Heading
 * @augments Command
 * @augments WysiwygCommand
 */
const Heading = CommandManager.command('wysiwyg', /** @lends Heading */{
    name: 'Heading',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     *  @param {Number} size size
     */
    exec(wwe, size) {
        const sq = wwe.getEditor();

        sq.focus();

        const range = sq.getSelection().cloneRange();
        const nodeName = domUtils.getNodeName(range.commonAncestorContainer);

        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            if (range.collapsed || nodeName === 'DIV' || nodeName === 'TEXT') {
                wwe.changeBlockFormatTo(`H${size}`);
            }
        }

    }
});

module.exports = Heading;
