'use strict';

var DiffMatchPatch = require('../../vendor/diffMatchPatch');

var util = tui.util;

var CHANGE_NOTHING = 0,
    CHANGE_ADD = 1,
    CHANGE_MINUS = -1;

/**
 * MarkerManager
 * @exports MarkerManager
 * @augments
 * @constructor
 * @class
 * @param {MarkerList} markerList MarkerList object
 */
function MarkerManager(markerList) {
    this._dmp = new DiffMatchPatch();
    this.markerList = markerList;
    this.oldTextContent = null;
}

/**
 * resetContent
 * Reset content
 * @param {string} content reset base content
 */
MarkerManager.prototype.resetContent = function(content) {
    this.oldTextContent = (util.isString(content) ? content : null);
};

/**
 * uppdateMarkersByContent
 * Get updated markers by updated content
 * @param {string} newContent updated content
 * @returns {object} updated markers
 */
MarkerManager.prototype.updateMarkersByContent = function(newContent) {
    var markerDiffs;

    if (util.isNull(this.oldTextContent)) {
        this.resetContent(newContent);

        return [];
    }

    markerDiffs = this._makeMarkerDiffs(newContent);

    this.oldTextContent = newContent;

    return this._getUpdateMarkersWithDiffs(markerDiffs);
};

/**
 * _makeMarkerDiffs
 * Make diffs of marker by updated content
 * @param {string} newContent updated content
 * @returns {object} marker diffs
 */
MarkerManager.prototype._makeMarkerDiffs = function(newContent) {
    var markerList = this.markerList,
        self = this,
        markerDiffs = {};

    this._forEachChanges(newContent, function(changedStart, changedEnd, diffLen) {
        markerList.forEachByRangeAffected(changedStart, changedEnd, function(marker) {
            var markerDiff = markerDiffs[marker.id],
                startDiff, endDiff;

            startDiff = self._calculateStartDiff(changedStart, changedEnd, diffLen, marker);
            endDiff = self._calculateEndDiff(changedStart, changedEnd, diffLen, marker);

            if (markerDiff) {
                markerDiff.start += startDiff;
                markerDiff.end += endDiff;
            } else {
                markerDiffs[marker.id] = {
                    start: startDiff,
                    end: endDiff
                };
            }
        });
    });

    return markerDiffs;
};

/**
 * _forEachChanges
 * Iterate each change of updated content
 * @param {string} newContent updated content
 * @param {function} iteratee iteratee
 */
MarkerManager.prototype._forEachChanges = function(newContent, iteratee) {
    var changedStart = 0,
        changedEnd = 0,
        changes = this._dmp.diff_main(this.oldTextContent, newContent);

    changes.forEach(function(change) {
        var type = change[0],
            text = change[1],
            diffLen = 0;

        var changedLen = text.length;

        //이전 변경점 end를 이번 변경점 start로 만들어 위치를 조정한다.
        changedStart = changedEnd;

        if (type === CHANGE_NOTHING) {
            changedStart += changedLen;
            changedEnd += changedLen;

            return;
        }

        if (type === CHANGE_ADD) {
            diffLen += changedLen; //더해진경우는 End값이 변경될 필요가없다 변경전의 위치는 start와 end가 collapse일수밖에 없다.. 일반적인 컨트롤상황에서는
        } else if (type === CHANGE_MINUS) {
            diffLen -= changedLen;
            changedEnd += changedLen; //빠지면 빠지기전까지의 범위가 end가 되어야한다.
        }

        iteratee(changedStart, changedEnd, diffLen);
    });
};

/**
 * _calculateStartDiff
 * Calculate start diff
 * @param {number} start change start offset
 * @param {number} end change end offset
 * @param {number} diff diff count of change
 * @param {object} marker marker to calculate diff
 * @returns {number} start diff of marker
 */
MarkerManager.prototype._calculateStartDiff = function(start, end, diff, marker) {
    var startDiff;

    // ~AB~[CDE]F
    if (start <= marker.start && end <= marker.start) {
        startDiff = diff;
    // A~B[C~DE]F
    } else if (start <= marker.start && end > marker.start) {
        startDiff = start - marker.start;
    } else {
        startDiff = 0;
    }

    return startDiff;
};

/**
 * _calculateEndDiff
 * Calculate end diff
 * @param {number} start change start offset
 * @param {number} end change end offset
 * @param {number} diff diff count of change
 * @param {object} marker marker to calculate diff
 * @returns {number} end diff of marker
 */
MarkerManager.prototype._calculateEndDiff = function(start, end, diff, marker) {
    var endDiff;

    // ~AB[CDE~]F
    if (end <= marker.end) {
        endDiff = diff;
    // AB[CD~E]~F
    } else if (start <= marker.end && end > marker.start) {
        endDiff = start - marker.end;
    } else {
        endDiff = 0;
    }

    return endDiff;
};

/**
 * _getUpdateMarkersWithDiffs
 * Get updated markers with diffs
 * @param {object} markerDiffs marker diff object that contains diff info of specific marker
 * @returns {[object]} updated markers
 */
MarkerManager.prototype._getUpdateMarkersWithDiffs = function(markerDiffs) {
    var updatedMarkers = [],
        markerList = this.markerList;

    util.forEachOwnProperties(markerDiffs, function(markerDiff, id) {
        var marker = markerList.getMarker(id);

        markerList.updateMarker(id, {
            start: marker.start += markerDiff.start,
            end: marker.end += markerDiff.end
        });

        updatedMarkers.push(marker);
    });

    return updatedMarkers;
};

module.exports = MarkerManager;
