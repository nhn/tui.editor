/**
 * @fileoverview Implements toDom
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
const FIND_FIRST_LAST_SPACE_OR_RETURN_OR_TAB_RX = /^[\s\r\n\t]+|[\s\r\n\t]+$/g;
const FIND_RETURN_OR_TAB_BETWEEN_TAGS_RX = />[\r\n\t]+</g;
const FIND_WHOLE_SPACE_MORE_THAN_ONE_BETWEEN_TAGS_RX = />[ ]+</g;

/**
 * toDom
 * @exports toDom
 * @param {HTMLElement|string} html DOM Node root or HTML string
 * @returns {HTMLElement[]} dom element
 */
export default function toDom(html) {
  let wrapper;

  if (Object.prototype.toString.call(html) === '[object String]') {
    wrapper = document.createElement('div');
    wrapper.innerHTML = preProcess(html);
  } else {
    wrapper = html;
  }

  wrapper.__htmlRootByToMark = true;

  return wrapper;
}

/**
 * Pre process for html string
 * @param {string} html Source HTML string
 * @returns {string}
 */
function preProcess(html) {
  // trim text
  html = html.replace(FIND_FIRST_LAST_SPACE_OR_RETURN_OR_TAB_RX, '');

  // trim between tags
  html = html.replace(FIND_RETURN_OR_TAB_BETWEEN_TAGS_RX, '><');

  // remove spaces more than 1(if need more space, must use &nbsp)
  html = html.replace(FIND_WHOLE_SPACE_MORE_THAN_ONE_BETWEEN_TAGS_RX, '> <');

  return html;
}

toDom.preProcess = preProcess;
