/**
* @fileoverview Implements mark extension for making text marker
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import util from 'tui-code-snippet';

import Editor from '../editorProxy';
import MarkerList from './markerList';
import MarkerManager from './markerManager';
import WysiwygMarkerHelper from './wysiwygMarkerHelper';
import ViewerMarkerHelper from './viewerMarkerHelper';
import MarkdownMarkerHelper from './markdownMarkerHelper';

const MARKER_UPDATE_DELAY = 100;
const FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

/**
 * mark extension
 * @param {Editor} editor - editor instance
 * @ignore
 */
function markExtension(editor) {
  const ml = new MarkerList();
  const mm = new MarkerManager(ml);
  let wmh, mmh, vmh;

  editor.eventManager.addEventType('markerUpdated');

  if (editor.isViewer()) {
    vmh = new ViewerMarkerHelper(editor.preview);
  } else {
    wmh = new WysiwygMarkerHelper(editor.getSquire());
    mmh = new MarkdownMarkerHelper(editor.getCodeMirror());
  }

  /**
   * getHelper
   * Get helper for current situation
   * @returns {object} helper
   */
  function getHelper() {
    let helper;

    if (editor.isViewer()) {
      helper = vmh;
    } else if (editor.isWysiwygMode()) {
      helper = wmh;
    } else {
      helper = mmh;
    }

    return helper;
  }

  /**
   * Update mark when resizing
   */
  function updateMarkWhenResizing() {
    const helper = getHelper();

    ml.getAll().forEach(marker => {
      helper.updateMarkerWithExtraInfo(marker);
    });

    editor.eventManager.emit('markerUpdated', ml.getAll());
  }

  // We need to update marker after window have been resized
  $(window).on('resize', updateMarkWhenResizing);

  editor.on('removeEditor', () => {
    $(window).off('resize', updateMarkWhenResizing);
  });

  // Reset marker content after set value
  editor.on('setMarkdownAfter', () => {
    const helper = getHelper();
    mm.resetContent(helper.getTextContent());
  });

  /**
   * setValueWithMarkers
   * Set value with markers
   * @param {string} value markdown content
   * @param {object} markerDataCollection marker data that obtain with exportMarkers method
   * @returns {Array.<object>} markers
   */
  editor.setValueWithMarkers = (value, markerDataCollection) => {
    let helper;

    ml.resetMarkers();

    markerDataCollection.forEach(markerData => {
      ml.addMarker(markerData.start, markerData.end, markerData.id);
    });

    editor.setValue(value);

    mm.resetContent(value.replace(FIND_CRLF_RX, ''));

    if (editor.isViewer() || editor.isWysiwygMode()) {
      helper = getHelper();
      mm.updateMarkersByContent(helper.getTextContent());
    } else {
      helper = mmh;
    }

    ml.getAll().forEach(marker => {
      helper.updateMarkerWithExtraInfo(marker);
    });

    editor.eventManager.emit('markerUpdated', ml.getAll());

    return ml.getAll();
  };

  /**
   * getMarker
   * Get markers that have given id
   * @param {string} id id of marker
   * @returns {object}
   */
  editor.getMarker = id => ml.getMarker(id);

  /**
   * getMarkersAll
   * Get all markers
   * @returns {Array.<object>}
   */
  editor.getMarkersAll = () => ml.getAll();

  /**
   * removeMarker
   * Remove marker with given id
   * @param {string} id of marker that should be removed
   * @returns {marker} removed marker
   */
  editor.removeMarker = id => ml.removeMarker(id);

  /**
   * getMarkersData
   * Get marker data to export so you can restore markers next time
   * @returns {object} markers data
   */
  editor.exportMarkers = () => {
    let markersData;

    if (editor.isMarkdownMode()) {
      markersData = ml.getMarkersData();
    } else if (editor.isViewer() || editor.isWysiwygMode()) {
      mm.updateMarkersByContent(editor.getValue().replace(FIND_CRLF_RX, ''));
      markersData = ml.getMarkersData();
      mm.updateMarkersByContent(getHelper().getTextContent());
    }

    return markersData;
  };

  /**
   * selectMarker
   * Make selection with marker that have given id
   * @param {string} id id of marker
   */
  editor.selectMarker = id => {
    const helper = getHelper();
    const marker = editor.getMarker(id);

    if (marker) {
      helper.selectOffsetRange(marker.start, marker.end);
    }
  };

  /**
   * addMarker
   * Add Marker with given id
   * if you pass just id then it uses current selection for marker
   * or you can pass start and end offset for marker
   * @param {number|string} start start offset or id
   * @param {number} end end offset
   * @param {string} id id of marker
   * @returns {object} marker that have made
   */
  editor.addMarker = (start, end, id) => {
    let marker;
    const helper = getHelper();

    if (!id) {
      id = start;
      marker = helper.getMarkerInfoOfCurrentSelection();
    } else {
      marker = {
        start,
        end
      };

      marker = helper.updateMarkerWithExtraInfo(marker);
    }

    if (marker) {
      marker.id = id;
      marker = ml.addMarker(marker);
      ml.sortBy('end');
      editor.eventManager.emit('markerUpdated', [marker]);
    }

    return marker;
  };

  /**
   * clearSelect
   * Clear selection
   */
  editor.clearSelect = () => {
    getHelper().clearSelect();
  };

  if (!editor.isViewer()) {
    editor.on('changeMode', () => {
      editor._updateMarkers();
    });

    editor.on('change', util.debounce(() => {
      editor._updateMarkers();
    }, MARKER_UPDATE_DELAY));

    /**
     * _updateMarkers
     * Update markers with current text content
     */
    editor._updateMarkers = () => {
      const helper = getHelper();

      if (!ml.getAll().length) {
        return;
      }

      mm.updateMarkersByContent(helper.getTextContent());

      ml.getAll().forEach(marker => {
        helper.updateMarkerWithExtraInfo(marker);
      });

      editor.eventManager.emit('markerUpdated', ml.getAll());
    };
  }
}

Editor.defineExtension('mark', markExtension);
