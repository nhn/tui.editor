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
        markdownContent = '';

    while (runner.next()) {
        markdownContent += tracker(runner);
    }

    return finalize(markdownContent);
}

/**
 * finalize
 * remove first and last return character
 * @param {string} text text to finalize
 * @return {string} result
 */
function finalize(text) {
    //remove first and last \n
    text = text.replace(/^[\n]+|[\n]+$/g, '');

    return text;
}

/**
 * tracker
 * Iterate childNodes and process conversion using recursive call
 * @param {DomRunner} runner dom runner
 * @return {string} processed text
 */
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
