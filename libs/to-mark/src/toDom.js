/**
 * @fileoverview Implements toDom
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var findFirstLastSpaceOrAllReturnsRx = /^[\s]+|[\s]+$|[\r\n\t]/g,
    findAllSpacesMoreThanOneRx = /[\s]+/g;

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
        html = html.replace(findFirstLastSpaceOrAllReturnsRx, '');

        //remove spaces more than 1(if need more space, must use &nbsp)
        html = html.replace(findAllSpacesMoreThanOneRx, ' ');

        wrapper.innerHTML = html;
    } else {
        wrapper = html;
    }

    wrapper.__htmlRootByToMark = true;

    return wrapper;
}

module.exports = toDom;
