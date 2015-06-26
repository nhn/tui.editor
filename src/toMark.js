/**
 * @fileoverview Implements toMark
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var DomRunner = require('./domRunner'),
    toDom = require('./toDom'),
    basicRenderer = require('./renderer.basic'),
    gfmRenderer = require('./renderer.gfm');

var FIND_FIRST_LAST_RETURNS_RX = /^[\n]+|[\n]+$/g,
    FIND_DUPLICATED_RETURNS_RX = /[ \xA0]+\n\n/g;
/**
 * toMark
 * @exports toMark
 * @param {string} htmlStr html string to convert
 * @param {object} options option
 * @param {boolean} options.gfm if this property is false turn off it cant parse gfm
 * @param {Renderer} options.renderer pass renderer to use
 * @return {string} converted markdown text
 * @example
 * toMark('<h1>hello world</h1>'); // "# hello world"
 * toMark('<del>strike</del>'); // "~~strike~~"
 * toMark('<del>strike</del>', {gfm: false}); // "strike"
 */
function toMark(htmlStr, options) {
    var runner,
        renderer;

    if (!htmlStr) {
        return '';
    }

    renderer = gfmRenderer;

    if (options) {
        if (options.gfm === false) {
            renderer = basicRenderer;
        }

        renderer = options.renderer || renderer;
    }

    runner = new DomRunner(toDom(htmlStr));

    return parse(runner, renderer);
}

/**
 * parse
 * Parse dom to markdown
 * @param {DomRunner} runner runner
 * @param {Renderer} renderer renderer
 * @return {string} markdown text
 */
function parse(runner, renderer) {
    var markdownContent = '';

    while (runner.next()) {
        markdownContent += tracker(runner, renderer);
    }

    return finalize(markdownContent);
}

/**
 * finalize
 * Remove first and last return character
 * @param {string} text text to finalize
 * @return {string} result
 */
function finalize(text) {
    //collapse duplicated returns made by <br /> and block element
    text = text.replace(FIND_DUPLICATED_RETURNS_RX, '\n');
    //remove first and last \n
    text = text.replace(FIND_FIRST_LAST_RETURNS_RX, '');
    return text;
}

/**
 * tracker
 * Iterate childNodes and process conversion using recursive call
 * @param {DomRunner} runner dom runner
 * @param {Renderer} renderer renderer to use
 * @return {string} processed text
 */
function tracker(runner, renderer) {
    var i,
        t,
        subContent = '',
        content;

    var node = runner.getNode();

    for (i = 0, t = node.childNodes.length; i < t; i += 1) {
        runner.next();
        subContent += tracker(runner, renderer);
    }

    content = renderer.convert(node, subContent);

    return content;
}

module.exports = toMark;
