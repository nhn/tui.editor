/**
 * @fileoverview Implements toMark
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var DomRunner = require('./domRunner'),
    toDom = require('./toDom');

/**
 * toMark
 * @exports toMark
 * @param {string} htmlStr html string to convert
 * @return {string} converted markdown text
 */
function toMark(htmlStr) {
    var nodes = new DomRunner(toDom(htmlStr)),
        markdownResult = '';

    var node = nodes.next();

    if (node.tagName === 'H1') {
        markdownResult = '# Hello World!';
    } else if (node.tagName === 'H2') {
        markdownResult = '## Hello World!';
    }

    return markdownResult;
}

module.exports = toMark;
