/**
 * @fileoverview Implements basicRenderer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var Renderer = require('./renderer');

var FIND_LAST_RETURN_RX = /\n$/g,
    FIND_BR_AND_RETURN_RX = /[ \xA0]+\n\n/g,
    FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX = /([ \xA0]+\n){2,}/g,
    FIND_LINK_HREF = /href\=\"(.*?)\"/,
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

        if (this._isNeedEscapeHtml(managedText)) {
            managedText = this.escapeTextHtml(managedText);
        } else if (this._isNeedEscape(managedText)) {
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
            res = '_' + subContent + '_';
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
        var res = subContent;
        var title = '';
        var foundedHref, url;


        //상황에따라 href속성은 상황에 따라 값을 예측하기 힘듬
        //그래서 html에 적용된 그대로를 사용
        foundedHref = FIND_LINK_HREF.exec(node.outerHTML);

        if (foundedHref) {
            url = foundedHref[1].replace(/&amp;/g, '&');
        }

        if (node.title) {
            title = ' "' + node.title + '"';
        }

        if (!this.isEmptyText(subContent) && url) {
            res = '[' + subContent + '](' + url + title + ')';
        }

        return res;
    },
    'IMG': function(node) {
        var res = '',
            src = node.getAttribute('src'),
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
        var backticks, numBackticks;
        var res = '';

        if (!this.isEmptyText(subContent)) {
            numBackticks = parseInt(node.getAttribute('data-backticks'), 10);
            backticks = isNaN(numBackticks) ? '`' : Array(numBackticks + 1).join('`');

            res = backticks + subContent + backticks;
        }

        return res;
    },

    //Paragraphs
    'P': function(node, subContent) {
        var res = '';

        //convert multiple brs to one br
        subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

        if (!this.isEmptyText(subContent)) {
            res = '\n\n' + subContent + '\n\n';
        }

        return res;
    },
    'BLOCKQUOTE P': function(node, subContent) {
        return subContent;
    },
    'LI P': function(node, subContent) {
        var res = '';

        if (!this.isEmptyText(subContent)) {
            res = subContent;
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

        return '\n\n' + res + '\n\n';
    },
    'LI H1, LI H2, LI H3, LI H4, LI H5, LI H6': function(node) {
        return '<' + node.tagName.toLowerCase() + '>' + node.innerHTML + '</' + node.tagName.toLowerCase() + '>';
    },

    //List
    'UL, OL': function(node, subContent) {
        return '\n\n' + subContent + '\n\n';
    },
    'LI OL, LI UL': function(node, subContent) {
        var res, processedSubContent;

        //remove last br of li
        processedSubContent = subContent.replace(FIND_BR_AND_RETURN_RX, '\n');

        //parent LI converter add \n too, so we remove last return
        processedSubContent = processedSubContent.replace(FIND_LAST_RETURN_RX, '');

        res = processedSubContent.replace(START_OF_LINES_RX, '    ');

        return '\n' + res;
    },
    'UL LI': function(node, subContent) {
        var res = '';

        //convert multiple brs to one br
        subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

        if (node.firstChild && node.firstChild.tagName === 'P') {
            res += '\n';
        }

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

        //convert multiple brs to one br
        subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

        if (node.firstChild && node.firstChild.tagName === 'P') {
            res += '\n';
        }

        res += liCounter + '. ' + subContent + '\n';

        return res;
    },

    //HR
    'HR': function() {
        return '\n\n- - -\n\n';
    },

    //Blockquote
    'BLOCKQUOTE': function(node, subContent) {
        var res, trimmedText;

        //convert multiple brs to one emptyline
        subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '\n\n');

        trimmedText = this.trim(subContent);
        res = trimmedText.replace(START_OF_LINES_RX, '> ');

        return '\n\n' + res + '\n\n';
    },

    //Code Block
    'PRE CODE': function(node, subContent) {
        var res, lastNremoved;

        lastNremoved = subContent.replace(FIND_LAST_RETURN_RX, '');
        res = lastNremoved.replace(START_OF_LINES_RX, '    ');

        return '\n\n' + res + '\n\n';
    }
});

module.exports = basicRenderer;
