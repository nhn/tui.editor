/**
 * @fileoverview Implement Module for managing import external data such as image
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var excelTableParser = require('./excelTableParser');

var util = tui.util;

var FIND_EXCEL_DATA = /^(([^\n\r]*|"[^"]+")(\t([^\n\r]*?|"[^"]+")){1,}[\r\n]*){1,}$/;

/**
 * ImportManager
 * @exports ImportManager
 * @constructor
 * @class ImportManager
 * @param {EventManager} eventManager eventManager
 */
function ImportManager(eventManager) {
    this.eventManager = eventManager;

    this._initDropEvent();
    this._initPasteEvent();
    this._initDefaultImageImporter();
}

/**
 * Initialize drop event
 * @memberOf ImportManager
 * @private
 */
ImportManager.prototype._initDropEvent = function() {
    var self = this;

    this.eventManager.listen('drop', function(ev) {
        var items = ev.data.dataTransfer && ev.data.dataTransfer.files;
        self._processBlobItems(items, ev.data);
    });
};

/**
 * Initialize paste event
 * @memberOf ImportManager
 * @private
 */
ImportManager.prototype._initPasteEvent = function() {
    var self = this;

    this.eventManager.listen('paste', function(ev) {
        self._processClipboard(ev.data);
    });
};

/**
 * Initialize default image importer
 * @memberOf ImportManager
 * @private
 */
ImportManager.prototype._initDefaultImageImporter = function() {
    this.eventManager.listen('addImageBlobHook', function(blob, callback) {
        var reader = new FileReader();

        reader.onload = function(event) {
            callback(event.target.result);
        };

        reader.readAsDataURL(blob);
    });
};

/**
 * Emit add image blob hook
 * @memberOf ImportManager
 * @param {object} item item
 * @private
 */
ImportManager.prototype._emitAddImageBlobHook = function(item) {
    var self = this,
        blob = item.name ? item : item.getAsFile(); //Blob or File

    this.eventManager.emit('addImageBlobHook', blob, function(url) {
        self.eventManager.emit('command', 'AddImage', {imageUrl: url, altText: blob.name || 'image'});
    });
};

/**
 * Add table with excel style data
 * @memberOf ImportManager
 * @param {string} content Table data
 * @private
 */
ImportManager.prototype._addExcelTable = function(content) {
    var tableInfo = excelTableParser(content);
    this.eventManager.emit('command', 'Table', tableInfo.col, tableInfo.row, tableInfo.data);
};

/**
 * Get blob or excel data from clipboard
 * @memberOf ImportManager
 * @param {object} evData Clipboard data
 * @private
 */
ImportManager.prototype._processClipboard = function(evData) {
    var blobItems,
        cbData, types;

    cbData = evData.clipboardData || window.clipboardData;

    blobItems = cbData && cbData.items;
    types = cbData.types;

    if (blobItems && types && types.length === 1 && util.inArray('Files', types) !== -1) {
        this._processBlobItems(blobItems, evData);
    } else {
        this._precessDataTransfer(cbData, evData);
    }
};

/**
 * Process for blob item
 * @memberOf ImportManager
 * @param {Array.<string>} items Item array
 * @param {object} evData Event data
 * @private
 */
ImportManager.prototype._processBlobItems = function(items, evData) {
    var self = this;

    if (items) {
        util.forEachArray(items, function(item) {
            if (item.type.indexOf('image') !== -1) {
                evData.preventDefault();
                evData.codemirrorIgnore = true;
                self._emitAddImageBlobHook(item);

                return false;
            }

            return true;
        });
    }
};

/**
 * Process for excel style data
 * @memberOf ImportManager
 * @param {HTMLElement} cbData Clipboard data
 * @param {object} evData Event data
 * @private
 */
ImportManager.prototype._precessDataTransfer = function(cbData, evData) {
    var textContent;

    textContent = cbData.getData('text');

    if (FIND_EXCEL_DATA.test(textContent) && confirm('테이블 포맷으로 붙여넣겠습니까?')) {
        evData.preventDefault();
        evData.codemirrorIgnore = true;
        this._addExcelTable(textContent);
    }
};

module.exports = ImportManager;
