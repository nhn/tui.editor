'use strict';

var util = tui.util;

/**
 * Markerlist
 * @exports Markerlist
 * @augments
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
 * @param {number} start start text offset
 * @param {number} end end text offset
 * @param {string|number} id id of marker
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

Markerlist.prototype.getMarker = function(id) {
    return this._markersWithId[id];
};

Markerlist.prototype.removeMarker = function(id) {
    var removedMarker, index;

    removedMarker = this._markersWithId[id];
    delete this._markersWithId[id];

    index = this._sortedMarkers.indexOf(removedMarker);
    this._sortedMarkers.splice(index, 1);

    return removedMarker;
};

Markerlist.prototype.updateMarker = function(id, obj) {
    var marker = this.getMarker(id);

    util.forEachOwnProperties(obj, function(value, key) {
        marker[key] = value;
    });

    return marker;
};

Markerlist.prototype.forEachByRangeAffected = function(start, end, iteratee) {
    var rangeMarkers;

    rangeMarkers = this._getMarkersByRangeAffected(start, end);

    rangeMarkers.forEach(iteratee);
};

Markerlist.prototype._getMarkersByRangeAffected = function(start, end) {
    var len, i, marker, rangeMarkers;

    rangeMarkers = [];

    for (i = 0, len = this._sortedMarkers.length; i < len; i += 1) {
        marker = this._sortedMarkers[i];

        if (marker.end > end || marker.end > start) {
            rangeMarkers.push(marker);
        }
    }

    return rangeMarkers;
};

Markerlist.prototype.getAll = function() {
    return this._sortedMarkers;
};

Markerlist.prototype.resetMarkers = function() {
    this._sortedMarkers = [];
    this._markersWithId = {};
};

Markerlist.prototype.sortWith = function(rangeKey) {
    this._sortedMarkers.sort(function(a, b) {
        if (a[rangeKey] > b[rangeKey]) {
            return 1;
        } else if (a[rangeKey] < b[rangeKey]) {
            return -1;
        }

        return 0;
    });
};

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
