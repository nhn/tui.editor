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
        markdownResult = '';

    while (runner.next()) {
        markdownResult += basicRenderer.convert(runner);
    }

    return markdownResult;
}

module.exports = toMark;
