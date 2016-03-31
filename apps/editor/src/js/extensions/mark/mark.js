'use strict';

var extManager = require('../../extManager'),
    MarkerList = require('./markerList'),
    MarkerManager = require('./markerManager'),
    WysiwygMarkerHelper = require('./wysiwygMarkerHelper'),
    MarkdownMarkerHelper = require('./markdownMarkerHelper');

var util = tui.util;

var MARKER_UPDATE_DELAY = 100,
    FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

extManager.defineExtension('mark', function(editor) {
    var ml = new MarkerList(),
        mm = new MarkerManager(ml),
        wmh = new WysiwygMarkerHelper(editor.getSquire()),
        mmh = new MarkdownMarkerHelper(editor.getCodeMirror());

    editor.eventManager.addEventType('markerUpdated');

    $(window).resize(function() {
        var helper;

        if (editor.isWysiwygMode()) {
            helper = wmh;
        } else {
            helper = mmh;
        }

        ml.getAll().forEach(function(marker) {
            helper.updateMarkerWithExtraInfo(marker);
        });

        editor.eventManager.emit('markerUpdated', ml.getAll());
    });

    editor.on('setValueAfter', function() {
        var helper;

        if (editor.isWysiwygMode()) {
            helper = wmh;
        } else {
            helper = mmh;
        }

        mm.resetContent(helper.getTextContent());
    });

    editor.on('changeMode', function() {
        var helper;

        if (!ml.getAll().length) {
            return;
        }

        if (editor.isWysiwygMode()) {
            helper = wmh;
        } else {
            helper = mmh;
        }

        mm.getUpdatedMarkersByContent(helper.getTextContent());

        ml.getAll().forEach(function(marker) {
            helper.updateMarkerWithExtraInfo(marker);
        });

        editor.eventManager.emit('markerUpdated', ml.getAll());
    });

    editor.on('change', util.debounce(function(ev) {
        var textContent, helper;

        if (ev.source === 'wysiwyg') {
            helper = wmh;
        } else {
            helper = mmh;
        }

        textContent = helper.getTextContent();

        mm.getUpdatedMarkersByContent(textContent);

        ml.getAll().forEach(function(marker) {
            helper.updateMarkerWithExtraInfo(marker);
        });

        editor.eventManager.emit('markerUpdated', ml.getAll());
    }, MARKER_UPDATE_DELAY));


    editor.addMarker = function(start, end, id) {
        var marker, helper;

        if (editor.isWysiwygMode()) {
            helper = wmh;
        } else {
            helper = mmh;
        }

        if (!id) {
            id = start;
            marker = helper.getMarkerInfoOfCurrentSelection();
        } else {
            marker = {
                start: start,
                end: end
            };

            marker = helper.updateMarkerWithExtraInfo(marker);
        }

        if (marker) {
            marker.id = id;
            marker = ml.addMarker(marker);
            ml.sortWith('end');
            editor.eventManager.emit('markerUpdated', [marker]);
        }

        return marker;
    };

    editor.getMarker = function(id) {
        return ml.getMarker(id);
    };

    editor.removeMarker = function(id) {
        return ml.removeMarker(id);
    };

    editor.exportMarkers = function() {
        var markersData;

        if (editor.isWysiwygMode()) {
            mm.getUpdatedMarkersByContent(editor.getValue().replace(FIND_CRLF_RX, ''));
            markersData = ml.getMarkersData();
            mm.getUpdatedMarkersByContent(wmh.getTextContent());
        } else {
            markersData = ml.getMarkersData();
        }

        return markersData;
    };

    editor.setValueWithMarkers = function(value, markerDataCollection) {
        var helper;

        ml.resetMarkers();

        markerDataCollection.forEach(function(markerData) {
            ml.addMarker(markerData.start, markerData.end, markerData.id);
        });

        editor.setValue(value);

        mm.resetContent(value.replace(FIND_CRLF_RX, ''));

        if (editor.isWysiwygMode()) {
            helper = wmh;
            mm.getUpdatedMarkersByContent(helper.getTextContent());
        } else {
            helper = mmh;
        }

        ml.getAll().forEach(function(marker) {
            helper.updateMarkerWithExtraInfo(marker);
        });

        return ml.getAll();
    };
});
