/**
 * @fileoverview Implements basicRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Renderer = require('./renderer');

var FIND_LAST_RETURN_RX = /\n$/g,
    START_OF_LINES_RX = /^/gm;

/**
 * basicRenderer
 * Basic Markdown Renderer
 * @exports basicRenderer
 * @augments Renderer
 */
var basicRenderer = Renderer.factory({
    //inlines
    'TEXT_NODE': function(node) {
        var trimmedText = this.trim(node.nodeValue),
            escapedText = this.escapeText(trimmedText);

        return this.getSpaceControlled(escapedText, node);
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
    'BR': function() {
        return '  \n';
    },
    'CODE': function(node, subContent) {
        var res;

        res = '`' + subContent + '`';

        return res;
    },

    //Paragraphs
    'P': function(node, subContent) {
        return '\n' + subContent + '\n';
    },
    'BLOCKQUOTE P': function(node, subContent) {
        return subContent;
    },

    //Headings
    'H1, H2, H3, H4, H5, H6': function(node, subContent) {
        var res = '',
            headingNumber = parseInt(node.tagName.charAt(1), 10);

        while (headingNumber) {
            res += '#';
            headingNumber -= 1;
        }

        res += ' ';
        res += subContent;

        return '\n' + res + '\n';
    },
    'LI H1, LI H2, LI H3, LI H4, LI H5, LI H6': function(node) {
        //todo 각 요소들 처리
        return '<h1>' + node.innerHTML + '</h1>';
    },

    //List
    'UL, OL': function(node, subContent) {
        return '\n' + subContent + '\n';
    },
    'LI OL, LI UL': function(node, subContent) {
        var res, lastNremoved;

        //because parent LI converter add \n too
        lastNremoved = subContent.replace(FIND_LAST_RETURN_RX, '');

        res = lastNremoved.replace(START_OF_LINES_RX, '    ');

        return '\n' + res;
    },
    'UL LI': function(node, subContent) {
        var res = '';

        res += '* ' + subContent + '\n';

        return res;
    },
    'OL LI': function(node, subContent) {
        var res = '',
            liCounter = 1;

        while (node.previousSibling) {
            node = node.previousSibling;

            if (node.nodeType === 1 && node.tagName === 'LI') {
                liCounter += 1;
            }
        }

        res += liCounter + '. ' + subContent + '\n';

        return res;
    },

    //HR
    'HR': function() {
        return '\n- - -\n';
    },

    //Blockquote
    'BLOCKQUOTE': function(node, subContent) {
        var res, trimmedText;

        trimmedText = this.trim(subContent);
        res = trimmedText.replace(START_OF_LINES_RX, '> ');

        return '\n' + res + '\n';
    },

    //Code Block
    'PRE CODE': function(node, subContent) {
        var res, lastNremoved;

        lastNremoved = subContent.replace(FIND_LAST_RETURN_RX, '');
        res = lastNremoved.replace(START_OF_LINES_RX, '    ');

        return '\n' + res + '\n';
    }
});

module.exports = basicRenderer;
