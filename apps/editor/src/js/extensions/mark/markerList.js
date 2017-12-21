/**
* @fileoverview Implements markdown marker helper for additional information
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import util from 'tui-code-snippet';

/**
 * Class Markerlist
 */
class Markerlist {
  /**
   * Creates an instance of Markerlist.
   * @memberof Markerlist
   */
  constructor() {
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
  addMarker(start, end, id) {
    let marker;

    if (!id) {
      marker = start;
    } else {
      marker = {
        start,
        end,
        id
      };
    }

    if (!this._markersWithId[marker.id]) {
      this._sortedMarkers.push(marker);
      this._markersWithId[marker.id] = marker;
    }

    return marker;
  }

  /**
   * getMarker
   * Get marker with given id
   * @param {string} id id of marker
   * @returns {object} marker
   */
  getMarker(id) {
    return this._markersWithId[id];
  }

  /**
   * removeMarker
   * Remove marker with given id
   * @param {string} id of marker that should be removed
   * @returns {marker} removed marker
   */
  removeMarker(id) {
    const removedMarker = this._markersWithId[id];
    delete this._markersWithId[id];

    const index = this._sortedMarkers.indexOf(removedMarker);
    this._sortedMarkers.splice(index, 1);

    return removedMarker;
  }

  /**
   * updateMarker
   * Update marker with extra information
   * @param {string} id id of marker
   * @param {object} obj extra information
   * @returns {object} marker
   */
  updateMarker(id, obj) {
    const marker = this.getMarker(id);

    return util.extend(marker, obj);
  }

  /**
   * forEachByRangeAffected
   * Iterate markers affected by given range
   * @param {number} start start offset
   * @param {end} end end offset
   * @param {function} iteratee iteratee
   */
  forEachByRangeAffected(start, end, iteratee) {
    const rangeMarkers = this._getMarkersByRangeAffected(start, end);

    rangeMarkers.forEach(iteratee);
  }

  /**
   * _getMarkersByRangeAffected
   * Get markers affected by given range
   * @param {number} start start offset
   * @param {end} end end offset
   * @returns {Array.<object>} markers
   * @private
   */
  _getMarkersByRangeAffected(start, end) {
    const rangeMarkers = this._sortedMarkers.filter(marker => {
      if (marker.end > end || marker.end > start) {
        return true;
      }

      return false;
    });

    return rangeMarkers;
  }

  /**
   * getAll
   * Get markers all
   * @returns {Array.<object>} markers
   */
  getAll() {
    return this._sortedMarkers;
  }

  /**
   * resetMarkers
   * Reset markerlist
   */
  resetMarkers() {
    this._sortedMarkers = [];
    this._markersWithId = {};
  }

  /**
   * sortBy
   * Sort markers with given key of marker
   * @param {string} rangeKey, start or end
   */
  sortBy(rangeKey) {
    this._sortedMarkers.sort((a, b) => a[rangeKey] - b[rangeKey]);
  }

  /**
   * getMarkersData
   * Get marker data to export
   * @returns {object} markers data
   */
  getMarkersData() {
    return this.getAll().map(marker => ({
      start: marker.start,
      end: marker.end,
      id: marker.id
    })
    );
  }
}

module.exports = Markerlist;
