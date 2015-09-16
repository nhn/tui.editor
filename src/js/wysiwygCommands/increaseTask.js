/**
 * @fileoverview Implements inceaseTask wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var inlineNodeNames = /^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|EL|FN)|EM|FONT|HR|I(?:MG|NPUT|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:AMP|MALL|PAN|TR(?:IKE|ONG)|U[BP])?|U|VAR|WBR)$/;
/**
 * IncreaseTask
 * increase task depth to wysiwyg Editor
 * @exports IncreaseTask
 * @augments Command
 * @augments WysiwygCommand
 */
var IncreaseTask = CommandManager.command('wysiwyg',/** @lends HR */{
    name: 'IncreaseTask',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var parent, node, range;

        range = wwe.getEditor().getSelection();
        node = range.startContainer;

        if (range.collapsed && range.startContainer.textContent.replace(/^[\s]+/g, '') === '') {
            while (parent = node.parentNode) {
                // If we find a UL or OL (so are in a list, node must be an LI)
                if (parent.nodeName === 'UL' || parent.nodeName === 'OL') {
                    // AND the LI is not the first in the list
                    if (node.previousSibling) {
                        // Then increase the list level
                        wwe.getEditor().modifyBlocks(increaseTaskLevel);
/*
                        if (node.parentElement.parentElement.firstChild.tagName === 'DIV'
                            && node.parentElement.parentElement.firstChild.textContent === '') {
                                debugger;
                                $(node.parentElement.parentElement.firstChild).remove();
                        }*/
                    }

                    break;
                }
                node = parent;
            }
        }
    }
});

function isContainer(node) {
    var type = node.nodeType;
    return (type === Node.ELEMENT_NODE || type === Node.DOCUMENT_FRAGMENT_NODE) &&
        !isInline(node) && !isBlock(node);
}

function isInline(node) {
    return inlineNodeNames.test(node.nodeName);
}

function isBlock(node) {
    var type = node.nodeType;
    return (type === Node.ELEMENT_NODE || type === Node.DOCUMENT_FRAGMENT_NODE) &&
        !isInline(node) && every(node.childNodes, isInline);
}

function every(nodeList, fn) {
    var l = nodeList.length - 1;

    while (l >= 0) {
        if (!fn(nodeList[l])) {
            return false;
        }

        l -= 1;
    }

    return true;
}

function replaceWith(node, node2) {
    var parent = node.parentNode;
    if (parent) {
        parent.replaceChild(node2, node);
    }
}

function increaseTaskLevel(frag) {
    var i, l, item, type, newParent, listAttrs,
        items = frag.querySelectorAll('LI'),
        listItemAttrs = {class: 'task-list-item'};

    for (i = 0, l = items.length; i < l; i += 1) {
        item = items[i];
        if (!isContainer(item.firstChild)) {
            // type => 'UL' or 'OL'
            type = item.parentNode.nodeName;
            newParent = item.previousSibling;

            if (!newParent || !(newParent = newParent.lastChild) ||
                newParent.nodeName !== type) {
                replaceWith(
                    item,
                    this.createElement('LI', listItemAttrs, [
                        newParent = this.createElement(type)
                    ])
                );
            }
            newParent.appendChild(item);
        }
    }

    return frag;
};

module.exports = IncreaseTask;
