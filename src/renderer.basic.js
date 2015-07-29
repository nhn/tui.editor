/**
 * @fileoverview Implements basicRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Renderer = require('./renderer');

var FIND_LAST_RETURN_RX = /\n$/g,
    FIND_BR_AND_RETURN_RX = /[ \xA0]+\n\n/g,
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
        var managedText;

        managedText = this.trim(this.getSpaceCollapsedText(node.nodeValue));

        if (this._isNeedEscape(managedText)) {
            managedText = this.escapeText(managedText);
        }

        return this.getSpaceControlled(managedText, node);
    },
    'CODE TEXT_NODE': function(node) {
        return node.nodeValue;
    },
    'EM, I': function(node, subContent) {
        var res = '';

        if (!this.isEmptyText(subContent)) {
            res = '*' + subContent + '*';
        }

        return res;
    },
    'STRONG, B': function(node, subContent) {
        var res = '';

        if (!this.isEmptyText(subContent)) {
            res = '**' + subContent + '**';
        }

        return res;
    },
    'A': function(node, subContent) {
        var res = subContent,
            url = node.href;

        if (!this.isEmptyText(subContent) && url) {
            res = '[' + subContent + '](' + url + ')';
        }

        return res;
    },
    'IMG': function(node) {
        var res = '',
            src = node.src,
            alt = node.alt;

        if (src) {
            res = '![' + alt + '](' + src + ')';
        }

        return res;
    },
    'BR': function() {
        return '  \n';
    },
    'CODE': function(node, subContent) {
        var res = '';

        if (!this.isEmptyText(subContent)) {
            res = '`' + subContent + '`';
        }

        return res;
    },

    //Paragraphs
    'P': function(node, subContent) {
        var res = '';

        if (!this.isEmptyText(subContent)) {
            res = '\n' + subContent + '\n\n';
        }

        return res;
    },
    'BLOCKQUOTE P': function(node, subContent) {
        return subContent;
    },
    'LI P': function(node, subContent) {
        var res = '';

        if (!this.isEmptyText(subContent)) {
            res = subContent + '\n  \n';
        }

        return res;
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

        return '\n' + res + '\n\n';
    },
    'LI H1, LI H2, LI H3, LI H4, LI H5, LI H6': function(node) {
        return '<' + node.tagName.toLowerCase() + '>' + node.innerHTML + '</' + node.tagName.toLowerCase() + '>';
    },

    //List
    'UL, OL': function(node, subContent) {
        return '\n' + subContent + '\n';
    },
    'LI OL, LI UL': function(node, subContent) {
        var res, processedSubContent;

        //because parent LI converter add \n too
        processedSubContent = subContent.replace(FIND_LAST_RETURN_RX, '');
        //and br remove end of li
        processedSubContent = processedSubContent.replace(FIND_BR_AND_RETURN_RX, '\n');

        res = processedSubContent.replace(START_OF_LINES_RX, '    ');

        return '\n' + res;
    },
    'UL LI': function(node, subContent) {
        var res = '';

        res += '* ' + (subContent || ' ') + '\n';

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

        res += liCounter + '. ' + (subContent || ' ') + '\n';

        return res;
    },

    //HR
    'HR': function() {
        return '\n- - -\n\n';
    },

    //Blockquote
    'BLOCKQUOTE': function(node, subContent) {
        var res, trimmedText;

        trimmedText = this.trim(subContent);
        res = trimmedText.replace(START_OF_LINES_RX, '> ');

        return '\n' + res + '\n\n';
    },

    //Code Block
    'PRE CODE': function(node, subContent) {
        var res, lastNremoved;

        lastNremoved = subContent.replace(FIND_LAST_RETURN_RX, '');
        res = lastNremoved.replace(START_OF_LINES_RX, '    ');

        return '\n' + res + '\n\n';
    }
});

module.exports = basicRenderer;
