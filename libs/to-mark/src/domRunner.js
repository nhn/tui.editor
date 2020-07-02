/**
 * @fileoverview Implements DomRunner
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
const NODE = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3
};

/**
 * DomRunner
 * @param {HTMLElement} node A root node that it has nodes to iterate(not iterate itself and its any siblings)
 * @class
 */
export default class DomRunner {
  static NODE_TYPE = NODE;

  constructor(node) {
    this._normalizeTextChildren(node);

    this._root = node;
    this._current = node;
  }

  /**
   * Iterate next node
   * @returns {HTMLElement} next node
   */
  next() {
    let current = this._current;
    let node;

    if (this._current) {
      node = this._getNextNode(current);

      while (this._isNeedNextSearch(node, current)) {
        current = current.parentNode;
        node = current.nextSibling;
      }

      this._current = node;
    }

    return this._current;
  }

  /**
   * Return current node
   * @returns {HTMLElement} current node
   */
  getNode() {
    this._normalizeTextChildren(this._current);

    return this._current;
  }

  _normalizeTextChildren(node) {
    if (!node || node.childNodes.length < 2) {
      return;
    }

    let childNode = node.firstChild;
    let nextNode;

    while (childNode.nextSibling) {
      nextNode = childNode.nextSibling;
      if (childNode.nodeType === NODE.TEXT_NODE && nextNode.nodeType === NODE.TEXT_NODE) {
        childNode.nodeValue += nextNode.nodeValue;
        node.removeChild(nextNode);
      } else {
        childNode = nextNode;
      }
    }
  }

  /**
   * Get current node's text content
   * @returns {string} text
   */
  getNodeText() {
    const node = this.getNode();
    let text;

    if (node.nodeType === NODE.TEXT_NODE) {
      text = node.nodeValue;
    } else {
      text = node.textContent || node.innerText;
    }

    return text;
  }

  /**
   * Check if there is next node to iterate
   * @private
   * @param {HTMLElement} node next node
   * @param {HTMLElement} current next node
   * @returns {boolean} result
   */
  _isNeedNextSearch(node, current) {
    return !node && current !== this._root && current.parentNode !== this._root;
  }

  /**
   * Return available next node
   * @private
   * @param {HTMLElement} current current node
   * @returns {node} next node
   */
  _getNextNode(current) {
    return current.firstChild || current.nextSibling;
  }
}
