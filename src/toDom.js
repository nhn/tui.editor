/**
 * @fileoverview Implements toDom
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var FIND_FIRST_LAST_SPACE_OR_RETURN_OR_TAB_RX = /^[\s]+|[\s]+$|[\r\n\t]/g,
    FIND_WHOLE_SPACE_MORE_THAN_ONE_RX = /[\s]+/g;

/**
 * toDom
 * @exports toDom
 * @param {DOMElement|string} html DOM Node root or HTML string
 * @return {DOMElement[]} dom element
 */
function toDom(html) {
    var wrapper;

    if (Object.prototype.toString.call(html) === '[object String]') {
        wrapper = document.createElement('div');

        //trim text
        html = html.replace(FIND_FIRST_LAST_SPACE_OR_RETURN_OR_TAB_RX, '');

        //remove spaces more than 1(if need more space, must use &nbsp)
        html = html.replace(FIND_WHOLE_SPACE_MORE_THAN_ONE_RX, ' ');

        wrapper.innerHTML = html;
    } else {
        wrapper = html;
    }

    wrapper.__htmlRootByToMark = true;

    return wrapper;
}

module.exports = toDom;
