/**
 * @fileoverview Implements Heading markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var util = tui.util;

/**
 * Heading
 * Add heading markdown syntax to markdown editor
 * @exports Heading
 * @augments Command
 */
var Heading = CommandManager.command('markdown', /** @lends Heading */{
    name: 'Heading',
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     * @param {number} size heading size
     */
    exec: function(mde, size) {
        var textToModify, range, from, to, textLinesToModify, lengthOfCurrentLineBefore,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        // 선택된 영역을 가공함
        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: 0
        };

        to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };

        lengthOfCurrentLineBefore = doc.getLine(to.line).length;

        //영역의 텍스트를 가저오고
        textToModify = doc.getRange(from, to);

        //원하는 대로 가공한다
        textLinesToModify = textToModify.split('\n');

        util.forEachArray(textLinesToModify, function(line, index) {
            textLinesToModify[index] = getHeadingMarkdown(line, size);
        });

        //해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;

        doc.setCursor(range.to);

        cm.focus();
    }
});

var FIND_HEADING_RX = /^#+\s/g;

function getHeadingMarkdown(text, size) {
    var foundedHeading = text.match(FIND_HEADING_RX),
        heading = '';

    do {
        heading += '#';
        size -= 1;
    } while (size > 0);

    if (foundedHeading) {
        text = text.split(foundedHeading[0])[1];
    }

    return heading + ' ' + text;
}

module.exports = Heading;
