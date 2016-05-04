/**
 * @fileoverview Implements WwRangeContentExtractor
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

/**
 * WwRangeContentExtractor
 * @exports WwRangeContentExtractor
 * @augments
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe wysiwygEditor instance
 * @param {Range} range range to extract content
 */
function WwRangeContentExtractor(wwe, range) {
    this.wwe = wwe;

    this.range = range;
    this.clonedContents = range.cloneContents();
    this.extractedContents = null;

    this._extractContents();
}

/**
 * Extract content from range
 */
WwRangeContentExtractor.prototype._extractContents = function() {
    var range = this.range;
    var clonedContents = this.clonedContents;
    var self = this;

    if (this._isOneTextNodeFullySelected(range)) {
        this._eachCurrentPath(function(pathStep) {
            self.extractedContents = self._makeNodeAndAppend(pathStep, self.extractedContents || clonedContents);
        });
    } else if (this._isOrphanListItem(range)) {
        self.extractedContents = this._makeNodeAndAppend(range.commonAncestorContainer.tagName, clonedContents);
    } else if (this._isStartWithPartialTextNode(range)) {
        self.extractedContents = this._makeFirstChildToTextNodeIfNeed(clonedContents);
    }

    //wrap all result content with div to get HTML data
    this.extractedContents = this._makeNodeAndAppend('div', this.extractedContents || clonedContents);
};

/**
 * Get content as html string
 * @returns {string}
 */
WwRangeContentExtractor.prototype.getAsString = function() {
    return this.extractedContents.html();
};

/**
 * _isOneTextNodeFullySelected
 * check if one text node fully selected with range
 * @returns {boolean} result
 */
WwRangeContentExtractor.prototype._isOneTextNodeFullySelected = function() {
    var range = this.range;

    return (range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        && range.startContainer === range.endContainer
        && range.startContainer === range.commonAncestorContainer
        && range.startOffset === 0
        && range.endOffset === range.commonAncestorContainer.nodeValue.length);
};

/**
 * _isStartWithPartialTextNode
 * check if start is partial textnode
 * @param {Range} range range of selection
 * @returns {boolean} result
 */
WwRangeContentExtractor.prototype._isStartWithPartialTextNode = function() {
    var range = this.range;

    return (range.startContainer.nodeType === Node.TEXT_NODE
        && range.startOffset > 0);
};

/**
 * _isOrphanListItem
 * check if range have orphan list
 * @param {Range} range range of selection
 * @returns {boolean} result
 */
WwRangeContentExtractor.prototype._isOrphanListItem = function() {
    var range = this.range;

    return (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        && (range.commonAncestorContainer.tagName === 'UL' || range.commonAncestorContainer.tagName === 'OL'));
};

/**
 * _eachCurrentPath
 * iterate path depths
 * @param {function} iteratee callback
 */
WwRangeContentExtractor.prototype._eachCurrentPath = function(iteratee) {
    var paths = this.wwe.getEditor().getPath().split('>'),
        i;

    for (i = paths.length - 1; i > -1; i -= 1) {
        iteratee(paths[i]);
    }
};

/* _makeNodeAndAppend
 * make node and append childs
 * @param {string} tagName tagName to make
 * @param {Node} content nodes to append
 * @returns {Node} node
 */
WwRangeContentExtractor.prototype._makeNodeAndAppend = function(tagName, content) {
    var node = $('<' + tagName + '/>');
    node.append(content);

    return node;
};

/**
 * _makeFirstChildToTextNodeIfNeed
 * Make firstchild of fragment into textnode
 * @param {DocumentFragment} frag fragment
 * @returns {DocumentFragment} result fragment
 */
WwRangeContentExtractor.prototype._makeFirstChildToTextNodeIfNeed = function(frag) {
    var newFirstChild;

    if (domUtils.isElemNode(frag.firstChild) && frag.firstChild.tagName === 'DIV') {
        newFirstChild = this.wwe.getEditor().getDocument().createTextNode(frag.firstChild.textContent);
        $(frag).find('*').first().remove();
        $(frag).prepend(newFirstChild);
    }

    return frag;
};

module.exports = WwRangeContentExtractor;
