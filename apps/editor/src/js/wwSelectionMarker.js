/**
 * @fileoverview Implements selection marker for wysiwyg
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import domUtils from './domUtils';

const MARKER_CSS_CLASS = 'tui-editor-selection-marker';

/**
 * WwSelectionMarker
 * @exports WwSelectionMarker
 * @class WwSelectionMarker
 * @constructor
 */
class WwSelectionMarker {
    constructor() {
        this._markerNode = null;
    }

    /**
     * insertMarker
     * @param {Range} range range
     * @param {SquireExt} sq SquireExt instance
     * @returns {Range} range range
     * @memberOf WwSelectionMarker
     * @api
     */
    insertMarker(range, sq) {
        this._markerNode = this._makeMarker(sq);

        range.insertNode(this._markerNode);
        range.setStartAfter(this._markerNode);

        return range;
    }

    /**
     * _makeMarker
     * Make marker element
     * @param {SquireExt} sq SquireExt instance
     * @returns {Node} marker
     * @memberOf WwSelectionMarker
     * @private
     */
    _makeMarker(sq) {
        return sq.createElement('INPUT', {type: 'hidden', class: MARKER_CSS_CLASS});
    }

    /**
     * restore
     * Restore marker to selection
     * @param {SquireExt} sq SquireExt instance
     * @returns {Range} range
     * @memberOf WwSelectionMarker
     * @api
     */
    restore(sq) {
        const newRange = sq.getSelection().cloneRange();

        newRange.setStartBefore(this._markerNode);
        newRange.collapse(true);

        sq.setSelection(newRange);

        $(this._markerNode).remove();

        //task안의 컬러의 경우, 컨테이너가 컬러span 그리고 startOffset이 0인경우 컬러가 끊긴다.
        //입력시 컬러가 이어지도록하려면 추가 보정이 필요하다
        if (newRange.startOffset === 0
            && domUtils.isTextNode(newRange.startContainer.childNodes[0])
            && !newRange.startContainer.childNodes[0].textContent.replace(/\u200B/, '')
        ) {
            newRange.setStart(newRange.startContainer.childNodes[0], 1);
            sq.setSelection(newRange);
        }

        return newRange;
    }
}
module.exports = WwSelectionMarker;
