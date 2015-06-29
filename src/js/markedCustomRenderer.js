/**
 * @fileoverview Implements markedCustomRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent
 */

'use strict';

/**
 * markedCustomRenderer
 * @exports markedCustomRenderer
 * @augments marked.Renderer
 */
var markedCustomRenderer = new window.marked.Renderer();

var regexTaskList = /^((?:<p>|))\[(?:x| )\] /;

markedCustomRenderer.list = function (body, ordered) {
    var className = '',
    type = ordered ? 'ol' : 'ul';

    if (body.indexOf('<li class="task-list-item">') > -1) {
        className = ' class="task-list"';
    }

    return '<' + type + className + '>\n' + body + '</' + type + '>\n';
};

markedCustomRenderer.listitem = function (text) {
    var cap,
    checked,
    className = '',
        output = '';

    cap = regexTaskList.exec(text);

    if (cap) {
        text = text.substring(cap[0].length);
        className = ' class="task-list-item"';
        checked = cap[0] === '[x] ' ? ' checked' : '';
        output += cap[1] + '<input type="checkbox" class="task-list-item-checkbox"' + checked + '> ';
    }

    return '<li' + className + '>' + output + text + '</li>\n';
};

module.exports = markedCustomRenderer;
