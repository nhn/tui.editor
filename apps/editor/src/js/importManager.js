/**
 * @fileoverview Implement Module for managing import external data such as image
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

/**
 * ImportManager
 * @exports ImportManager
 * @constructor
 * @class
 * @param {EventManager} eventManager eventManager
 */
function ImportManager(eventManager) {
    this.eventManager = eventManager;

    this._initDropEvent();
    this._initPasteEvent();
    this._initDefaultImporter();
}

ImportManager.prototype._initDropEvent = function() {
    var self = this;

    this.eventManager.listen('drop', function(ev) {
        var items = ev.data.dataTransfer && ev.data.dataTransfer.files;
        self._forEachItems(items);
    });
};

ImportManager.prototype._initPasteEvent = function() {
    var self = this;

    this.eventManager.listen('paste', function(ev) {
        var items = ev.data.clipboardData && ev.data.clipboardData.items;
        self._forEachItems(items);
    });
};

ImportManager.prototype._initDefaultImporter = function() {
    this.eventManager.listen('addImageBlobHook', function(blob, callback) {
        var reader = new FileReader();

        reader.onload = function(event) {
            callback(event.target.result);
        };

        reader.readAsDataURL(blob);
    });
};

ImportManager.prototype._emitAddImageBlobHook = function(item) {
    var self = this,
        blob = item.name ? item : item.getAsFile(); //Blob or File

    this.eventManager.emit('addImageBlobHook', blob, function(url) {
        self.eventManager.emit('command', 'AddImage', {imageUrl: url, altText: blob.name || 'image'});
    });
};

ImportManager.prototype._forEachItems = function(items) {
    var self = this;

    if (items) {
        util.forEachArray(items, function(item) {
            if (item.type.indexOf('image') !== -1) {
                self._emitAddImageBlobHook(item);
            }
        });
    }
};

module.exports = ImportManager;
