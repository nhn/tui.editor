
/**
 * @fileoverview Implements toDom
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * toDom
 * @exports toDom
 * @param {string} htmlString HTML string
 * @return {DOMElement} dom element
 */
function toDom(htmlString) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = htmlString;
    return wrapper;
}


module.exports = toDom;
