/**
 * @fileoverview Implements markedCustomRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent
 */

'use strict';

/**
 * markedCustomRenderer
 * @exports markedCustomRenderer
 * @augments marked.Renderer
 * @class markedCustomRenderer
 */
var markedCustomRenderer = new window.marked.Renderer();

/**
 * Task list Regexp
 * @api
 * @memberOf markedCustomRenderer
 * @type {RegExp}
 */
var regexTaskList = /^((?:<p>|))(\[(?:x| )\]) /i;

/**
 * Render listItem by given text.
 * @api
 * @memberOf markedCustomRenderer
 * @param {string} text Source text
 * @returns {string}
 */
markedCustomRenderer.listitem = function(text) {
    var cap,
        checked,
        className = '',
        output = '';

    cap = regexTaskList.exec(text);

    if (cap) {
        text = text.substring(cap[0].length);
        className = ' class="task-list-item"';
        checked = cap[2].toLowerCase() === '[x]' ? ' checked' : '';
        output += cap[1] + '<input type="checkbox" class="task-list-item-checkbox"' + checked + '> ';
    }

    return '<li' + className + '>' + output + text + '</li>\n';
};

/**
 * Render code
 * @api
 * @memberOf markedCustomRenderer
 * @param {string} code Source text of code content
 * @param {string} lang Type of language
 * @param {boolean} escaped Whether text is escaped or not
 * @returns {string}
 */
markedCustomRenderer.code = function(code, lang, escaped) {
    var out;
    if (this.options.highlight) {
        out = this.options.highlight(code, lang);
        if (out !== null && out !== code) {
            escaped = true;
            code = out;
        }
    }

    if (!lang) {
        return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>';
    }

    return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '" data-language="' + escape(lang, true) + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

/**
 * Render table cell
 * @param {string} content Text content
 * @param {{align: string, header: boolean}} flags Flag object
 * @returns {string}
 */
markedCustomRenderer.tablecell = function(content, flags) {
    var type = flags.header ? 'th' : 'td';
    var $element = $('<' + type + '></' + type + '>');

    if (flags.align) {
        $element.attr('align', flags.align);
    }
    $element.text(content);

    return $element[0].outerHTML + '\n';
};

/**
 * Render table
 * @api
 * @memberOf markedCustomRenderer
 * @param {string} header Text for table header
 * @param {string} body Text for table body
 * @returns {string}
 */
markedCustomRenderer.table = function(header, body) {
    var cellLen = header.match(/\/th/g).length;
    var foundLastTr = body.match(/\n?<tr>[\s\S]*?<\/tr>\n$/g);
    var lastTr;

    if (foundLastTr && foundLastTr.length) {
        lastTr = foundLastTr[0];
    }

    if (lastTr && lastTr.match(/\/td/g).length < cellLen) {
        body = body.replace(/<\/td>\n<\/tr>\n$/g, '</td>\n<td></td>\n</tr>\n');
    }

    return '<table>\n'
        + '<thead>\n'
        + header
        + '</thead>\n'
        + '<tbody>\n'
        + body
        + '</tbody>\n'
        + '</table>\n';
};

/**
 * Replace 'del' to 's' tag
 * @api
 * @memberOf markedCustomRenderer
 * @override
 * @param {string} text Text content
 * @returns {string}
 */
markedCustomRenderer.del = function(text) {
    var textContent = '';

    if (text) {
        textContent = '<s>' + text + '</s>';
    }

    return textContent;
};

/**
 * escape code from marked
 * @param {string} html HTML string
 * @param {string} encode Boolean value of whether encode or not
 * @returns {string}
 */
function escape(html, encode) {
    return html
        .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

module.exports = markedCustomRenderer;
