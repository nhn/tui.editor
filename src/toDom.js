/**
 * @fileoverview Implements toDom
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * toDom
 * @exports toDom
 * @param {string} html HTML string
 * @return {DOMElement[]} dom element
 */
function toDom(html) {
    var wrapper = document.createElement('div');

    //trim text
    html = html.replace(/^[\s]+|[\s]+$|[\r\n\t]/g, '');

    //remove spaces more than 1(if need more space, must use &nbsp)
    html = html.replace(/[\s]+/g, ' ');

    wrapper.innerHTML = html;
    wrapper.__htmlRootByToMark = true;

    return wrapper;
}

module.exports = toDom;
