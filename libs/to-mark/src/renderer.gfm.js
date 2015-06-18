/**
 * @fileoverview Implements gfmRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Renderer = require('./renderer');
/*
var FIND_LAST_RETURN_RX = /\n$/g,
    START_OF_LINES_RX = /^/gm;
*/

/**
 * gfmRenderer
 * github flavored Markdown Renderer
 * @exports gfmRenderer
 * @augments Renderer
 */
var gfmRenderer = Renderer.factory({
    'PRE CODE': function(node, subContent) {
        var language = '';

        if (node.getAttribute('data-language')) {
            language = ' ' + node.getAttribute('data-language');
        }

        return '\n```' + language + '\n' + subContent + '\n```\n';
    },
    'INPUT': function(node) {
        var condition;

        if (node.type !== 'checkbox') {
            return;
        }

        condition = node.checked ? 'x' : ' ';

        return '[' + condition + ']';
    }
});

module.exports = gfmRenderer;
