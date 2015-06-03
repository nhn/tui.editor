/**
 * @fileoverview Implements basicRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Renderer = require('./renderer');

/**
 * basicRenderer
 * @exports basicRenderer
 * @augments Renderer
 */
var basicRenderer = Renderer.factory({
    //inlines
    'TEXT_NODE': function(node) {
        return node.nodeValue;
    },
    'EM': function(node, subContent) {
        var res;

        res = '*' + subContent + '*';

        return res;
    },
    'STRONG': function(node, subContent) {
        var res;

        res = '**' + subContent + '**';

        return res;
    },
    'A': function(node, subContent) {
        var res,
            url = node.href;

        res = '[' + subContent + '](' + url + ')';

        return res;
    },
    'IMG': function(node) {
        var res,
            src = node.src,
            alt = node.alt;

        res = '![' + alt + '](' + src + ')';

        return res;
    },

    //Headings
    'H1, H2, H3, H4, H5, H6': function(node, subContent) {
        var res = '',
            headingNumber = parseInt(node.tagName[1], 10);

        while (headingNumber) {
            res += '#';
            headingNumber -= 1;
        }

        res += ' ';
        res += subContent;

        return res + '\n';
    },

    //List
    'LI OL, LI UL': function(node, subContent) {
        var res, lastNremoved;

        //because parent LI converter add \n too
        lastNremoved = subContent.replace(/\n$/g, '');

        res = lastNremoved.replace(/^/gm, '    ');

        return '\n' + res;
    },
    'UL LI': function(node, subContent) {
        var res = '';

        res += '* ' + subContent + '\n';

        return res;
    },
    'OL LI': function(node, subContent) {
        var res = '';

        res += '1. ' + subContent + '\n';

        return res;
    }
});

module.exports = basicRenderer;
