/**
 * @fileoverview Implements gfmRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Renderer = require('./renderer'),
    basicRenderer = require('./renderer.basic');

/**
 * gfmRenderer
 * github flavored Markdown Renderer
 * @exports gfmRenderer
 * @augments Renderer
 */
var gfmRenderer = Renderer.factory(basicRenderer, {
    'DEL': function(node, subContent) {
        return '~~' + subContent + '~~';
    },
    'PRE CODE': function(node, subContent) {
        var language = '';

        if (node.getAttribute('data-language')) {
            language = ' ' + node.getAttribute('data-language');
        }

        return '\n```' + language + '\n' + subContent + '\n```\n';
    },
    'LI INPUT': function(node) {
        var condition;

        if (node.type !== 'checkbox') {
            return;
        }

        condition = node.checked ? 'x' : ' ';

        return '[' + condition + ']';
    },

    //Table
    'TR TD, TR TH': function(node, subContent) {
        return ' ' + subContent + ' |';
    },
    'TR': function(node, subContent) {
        return '|' + subContent + '\n';
    },
    'THEAD': function(node, sbContent) {
        var i, ths, thsLength,
            result = '';

        ths = findChildTag(findChildTag(node, 'TR')[0], 'TH');
        thsLength = ths.length;

        for (i = 0; i < thsLength; i += 1) {
            result += ' ' + makeTableHeadAlignText(ths[i]) + ' |';
        }

        return sbContent + '|' + result + '\n';
    }
});

function makeTableHeadAlignText(th) {
    var align, leftAlignValue, rightAlignValue, textLength;

    align = th.align;
    textLength = th.textContent ? th.textContent.length : th.innerText.length;
    leftAlignValue = '';
    rightAlignValue = '';

    if (align) {
        if (align === 'left') {
            leftAlignValue = ':';
            textLength -= 1;
        } else if (align === 'right') {
            rightAlignValue = ':';
            textLength -= 1;
        } else if (align === 'center') {
            rightAlignValue = ':';
            leftAlignValue = ':';
            textLength -= 2;
        }
    }

    return leftAlignValue + repeatString('-', textLength) + rightAlignValue;
}

function findChildTag(node, tagName) {
    var i,
        childNodes = node.childNodes,
        childLength = childNodes.length,
        result = [];

    for (i = 0; i < childLength; i += 1) {
        if (childNodes[i].tagName && childNodes[i].tagName === tagName) {
            result.push(childNodes[i]);
        }
    }

    return result;
}

function repeatString(pattern, count) {
    var result = pattern;

    while (count > 1) {
        result += pattern;
        count -= 1;
    }

    return result;
}
module.exports = gfmRenderer;
