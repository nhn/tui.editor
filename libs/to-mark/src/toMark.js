/**
 * @fileoverview Implements toMark
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var DomRunner = require('./domRunner'),
    toDom = require('./toDom'),
    basicRenderer = require('./renderer.basic'),
    gfmRenderer = require('./renderer.gfm');

var FIND_UNUSED_BRS_RX = /[ \xA0]+(\n\n)/g,
    FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX = /^[\n]+|[\s\n]+$/g,
    FIND_MULTIPLE_BRS_RX = /([ \xA0]+\n){2,}/g,
    FIND_RETURNS_RX = /([ \xA0]){2,}\n/g,
    FIND_RETURNS_AND_SPACE_RX = /[ \xA0\n]+/g;

/**
 * toMark
 * @exports toMark
 * @param {string} htmlStr html string to convert
 * @param {object} options option
 * @param {boolean} options.gfm if this property is false turn off it cant parse gfm
 * @param {Renderer} options.renderer pass renderer to use
 * @returns {string} converted markdown text
 * @example
 * toMark('<h1>hello world</h1>'); // "# hello world"
 * toMark('<del>strike</del>'); // "~~strike~~"
 * toMark('<del>strike</del>', {gfm: false}); // "strike"
 */
function toMark(htmlStr, options) {
    var runner,
        isGfm = true,
        renderer;

    if (!htmlStr) {
        return '';
    }

    renderer = gfmRenderer;

    if (options) {
        isGfm = options.gfm;

        if (isGfm === false) {
            renderer = basicRenderer;
        }

        renderer = options.renderer || renderer;
    }

    runner = new DomRunner(toDom(htmlStr));

    return finalize(parse(runner, renderer), isGfm, renderer.lineFeedReplacement);
}

/**
 * parse
 * Parse dom to markdown
 * @param {DomRunner} runner runner
 * @param {Renderer} renderer renderer
 * @returns {string} markdown text
 */
function parse(runner, renderer) {
    var markdownContent = '';

    while (runner.next()) {
        markdownContent += tracker(runner, renderer);
    }

    return markdownContent;
}

/**
 * finalize
 * Remove first and last return character
 * @param {string} text text to finalize
 * @param {boolean} isGfm isGfm flag
 * @param {string} lineFeedReplacement Line feed replacement text
 * @returns {string} result
 */
function finalize(text, isGfm, lineFeedReplacement) {
    //collapse return and <br>
    //BR뒤에 바로 \n이 이어지면 BR은 불필요하다
    text = text.replace(FIND_UNUSED_BRS_RX, '\n');
    //console.log(2, JSON.stringify(text));

    //collapse multiple br
    //두개 이상의 BR개행은 한개로
    text = text.replace(FIND_MULTIPLE_BRS_RX, '\n\n');
    //console.log(3, JSON.stringify(text));

    text = text.replace(FIND_RETURNS_AND_SPACE_RX, function(matched) {
        var returnCount = (matched.match(/\n/g) || []).length;

        if (returnCount >= 3) {
            return '\n\n';
        } else if (matched >= 1) {
            return '\n';
        }

        return matched;
    });
    //console.log(3, JSON.stringify(text));

    //remove first and last \n
    //시작과 마지막 개행제거
    text = text.replace(FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX, '');
    //console.log(JSON.stringify(text));

    text = text.replace(new RegExp(lineFeedReplacement, 'g'), '\n');
    //in gfm replace '  \n' make by <br> to '\n'
    //gfm모드인경우 임의 개행에 스페이스를 제거
    if (isGfm) {
        text = text.replace(FIND_RETURNS_RX, '\n');
    }
    //console.log(7, JSON.stringify(text));

    return text;
}


/**
 * tracker
 * Iterate childNodes and process conversion using recursive call
 * @param {DomRunner} runner dom runner
 * @param {Renderer} renderer renderer to use
 * @returns {string} processed text
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
