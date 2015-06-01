/**
 * @fileoverview Implements toMark
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var DomRunner = require('./domRunner'),
    toDom = require('./toDom'),
    basicRenderer = require('./renderer.basic');

/**
 * toMark
 * @exports toMark
 * @param {string} htmlStr html string to convert
 * @return {string} converted markdown text
 */
function toMark(htmlStr) {
    var runner = new DomRunner(toDom(htmlStr)),
        markdownLines = [];

    while (runner.next()) {
        markdownLines.push(basicRenderer.convert(runner));
    }

    return markdownLines.join('\n');
}

module.exports = toMark;
