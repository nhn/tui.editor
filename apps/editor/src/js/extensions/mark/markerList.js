

var util = tui.util;

/**
 * Markerlist
 * @exports Markerlist
 * @constructor
 * @class
 */
function Markerlist() {
    this._sortedMarkers = [];
    this._markersWithId = {};
}

/**
 * addMarker
 * Add Marker
 * @param {number|object} start start text offset
 * @param {number} end end text offset
 * @param {string} id id of marker
 * @returns {object} marker
 */
Markerlist.prototype.addMarker = function(start, end, id) {
    var marker;

    if (!id) {
        marker = start;
    } else {
        marker = {
            start: start,
            end: end,
            id: id
        };
    }

    if (!this._markersWithId[marker.id]) {
        this._sortedMarkers.push(marker);
        this._markersWithId[marker.id] = marker;
    }

    return marker;
};

/**
 * getMarker
 * Get marker with given id
 * @param {string} id id of marker
 * @returns {object} marker
 */
Markerlist.prototype.getMarker = function(id) {
    return this._markersWithId[id];
};

/**
 * removeMarker
 * Remove marker with given id
 * @param {string} id of marker that should be removed
 * @returns {marker} removed marker
 */
Markerlist.prototype.removeMarker = function(id) {
    var removedMarker, index;

    removedMarker = this._markersWithId[id];
    delete this._markersWithId[id];

    index = this._sortedMarkers.indexOf(removedMarker);
    this._sortedMarkers.splice(index, 1);

    return removedMarker;
};

/**
 * updateMarker
 * Update marker with extra information
 * @param {string} id id of marker
 * @param {object} obj extra information
 * @returns {object} marker
 */
Markerlist.prototype.updateMarker = function(id, obj) {
    var marker = this.getMarker(id);

    return util.extend(marker, obj);
};

/**
 * forEachByRangeAffected
 * Iterate markers affected by given range
 * @param {number} start start offset
 * @param {end} end end offset
 * @param {function} iteratee iteratee
 */
Markerlist.prototype.forEachByRangeAffected = function(start, end, iteratee) {
    var rangeMarkers;

    rangeMarkers = this._getMarkersByRangeAffected(start, end);

    rangeMarkers.forEach(iteratee);
};

/**
 * _getMarkersByRangeAffected
 * Get markers affected by given range
 * @param {number} start start offset
 * @param {end} end end offset
 * @returns {Array.<object>} markers
 */
Markerlist.prototype._getMarkersByRangeAffected = function(start, end) {
    var rangeMarkers;

    rangeMarkers = this._sortedMarkers.filter(function(marker) {
        if (marker.end > end || marker.end > start) {
            return true;
        }

        return false;
    });

    return rangeMarkers;
};

/**
 * getAll
 * Get markers all
 * @returns {Array.<object>} markers
 */
Markerlist.prototype.getAll = function() {
    return this._sortedMarkers;
};

/**
 * resetMarkers
 * Reset markerlist
 */
Markerlist.prototype.resetMarkers = function() {
    this._sortedMarkers = [];
    this._markersWithId = {};
};

/**
 * sortBy
 * Sort markers with given key of marker
 * @param {string} rangeKey, start or end
 */
Markerlist.prototype.sortBy = function(rangeKey) {
    this._sortedMarkers.sort(function(a, b) {
        return a[rangeKey] - b[rangeKey];
    });
};

/**
 * getMarkersData
 * Get marker data to export
 * @returns {object} markers data
 */
Markerlist.prototype.getMarkersData = function() {
    return this.getAll().map(function(marker) {
        return {
            start: marker.start,
            end: marker.end,
            id: marker.id
        };
    });
};

module.exports = Markerlist;
