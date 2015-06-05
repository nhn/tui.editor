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
    var runner = new DomRunner(toDom(htmlStr.replace(/^[\s\r\n\t]+|[\s\r\n\t]+$/g, ''))),
        markdownContent = '';

    while (runner.next()) {
        markdownContent += tracker(runner);
    }

    return finalize(markdownContent);
}

function finalize(text) {
    return text.replace(/^[\n]+|[\n]+$/g, '');
}

function tracker(runner) {
    var i,
        t,
        subContent = '',
        content;

    var node = runner.getNode();

    for (i = 0, t = node.childNodes.length; i < t; i += 1) {
        runner.next();
        subContent += tracker(runner);
    }

    content = basicRenderer.convert(node, subContent);

    return content;
}

module.exports = toMark;
