/**
 * @fileoverview Implements HR wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var WysiwygCommand = require('../wysiwygCommand');

/**
 * HR
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports HR
 * @augments Command
 * @augments WysiwygCommand
 */
var HR = WysiwygCommand.factory(/** @lends HR */{
    name: 'HR',
    /**
     *  커맨드 핸들러
     *  @param {Squire} editor Squire instance
     */
    exec: function(editor) {
        var hr = editor.createElement('HR');
        editor.insertElement(hr);
        editor.focus();
    }
});


module.exports = HR;
