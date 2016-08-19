/**
 * @fileoverview Implements WysiwygCommand
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */


var CommandManager = require('../commandManager');

/**
 * Strike
 * Add strike to selected wysiwyg editor content
 * @exports Strike
 * @augments Command
 * @augments WysiwygCommand
 */
var Strike = CommandManager.command('wysiwyg', /** @lends Strike */{
    name: 'Strike',
    keyMap: ['CTRL+S', 'META+S'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WysiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        if (sq.hasFormat('S')) {
            sq.changeFormat(null, {tag: 'S'});
        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
            if (sq.hasFormat('code')) {
                sq.changeFormat(null, {tag: 'code'});
            }
            sq.strikethrough();
        }

        sq.focus();
    }
});

module.exports = Strike;
