/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * Session
 * @exports Session
 * @extends {}
 * @constructor
 * @class
 */

function Session(editor) {
    this.editor = editor;
    this.selection = editor.selection;
}
var diffMatchPatch = new diff_match_patch();

Session.prototype.newLine = function(start, end) {
    var textContent = this.editor.getTextContent(),
        selection = this.selection;

    var status = {
        before: textContent.slice(0, start),
        after: textContent.slice(end),
        textContent: textContent
    };


    //todo lf에서 newLine시  contentChange루틴에서마지막 개행을 삭제해서 첫개행이 제대로 이루어지지 않는다.
    status.before += '\n';
    console.log('status', status);

    var value = status.before + status.after;

    //setValue
    var startOffset = diffMatchPatch.diff_commonPrefix(textContent, value);
    if(startOffset === textContent.length) {
        startOffset--;
    }
    var endOffset = Math.min(
        diffMatchPatch.diff_commonSuffix(this.textContent, value),
        textContent.length - startOffset,
        value.length - startOffset
    );

    var replacement = value.substring(startOffset, value.length - endOffset);
    var range = selection.createRange(startOffset, textContent.length - endOffset);
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));

    return {
        start: startOffset,
        end: value.length - endOffset
    };
};

Session.prototype.makeLine = function(text) {
    var line;

    if (text && text[text.length - 1] !== '\n') {
        text[text.length] = '\n';
    } else {
        text = '\n';
    }

    line = document.createElement('p');
    line.appendChild(document.createTextNode(text));
    line.className = 'line';

    return line;
};

Session.prototype._findLineEl = function(el) {
    var lineNode,
        current = el;

    while (!lineNode) {
        if (current.nodeType === 1 && current.className === 'line') {
            lineNode = current;
        } else {
            current = current.parentNode;
        }
    }

    return lineNode;
};



module.exports = Session;