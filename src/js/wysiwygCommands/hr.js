/**
 * @fileoverview Implements HR wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * HR
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports HR
 * @augments Command
 * @augments WysiwygCommand
 */
var HR = CommandManager.command('wysiwyg',/** @lends HR */{
    name: 'HR',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.modifyBlocks(function(frag) {
            /*
            var block = sq.createElement('DIV');
            var newFrag = sq._doc.createDocumentFragment();

            newFrag.appendChild(frag);
            newFrag.appendChild(block);

            block.appendChild(sq.createElement('BR'));
            block.appendChild(sq.createElement('HR'));
*/
            frag.appendChild(sq.createElement('HR'));

            return frag;
        });

        sq.focus();
    }
});


module.exports = HR;
