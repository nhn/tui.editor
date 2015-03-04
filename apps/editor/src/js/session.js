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
function Session(base) {
    this.base = base;
}

Session.prototype.newLine = function(range) {
    console.log("Session:NewLine", range);
    var frag = document.createDocumentFragment(),
        newLine,
        lineRestText,
        preLine;


    range.deleteContents();
    range.collapse(true);

    preLine = this._findLineEl(range.startContainer);

    lineRestText = preLine.innerText.substring(range.startOffset);

    preLine.innerText = preLine.innerText.substring(0, range.startOffset);

    newLine = this.makeLine(lineRestText);

    //preLine.nodeValue.length - range.startContainer.nodeValue.length


    //현라인의 끝으로 커서 이동
    //현라인의 끝에서 newLine추가.
    range.setEndAfter(preLine);
    range.setStartAfter(preLine);
    frag.appendChild(newLine);
    range.insertNode(frag);

    range.setStartBefore(newLine);
    range.setEndBefore(newLine);

    return range;
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