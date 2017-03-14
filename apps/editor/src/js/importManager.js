/**
 * @fileoverview Implement Module for managing import external data such as image
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

const util = tui.util;

/**
 * ImportManager
 * @exports ImportManager
 * @constructor
 * @class ImportManager
 * @param {EventManager} eventManager eventManager
 */
class ImportManager {
    constructor(eventManager) {
        this.eventManager = eventManager;
        this._lastState = null;

        this._initEvent();
        this._initDefaultImageImporter();
    }

    /**
     * Initialize event handler
     * @memberOf ImportManager
     * @private
     */
    _initEvent() {
        this.eventManager.listen('stateChange', ev => {
            this._lastState = ev;
        });

        this.eventManager.listen('drop', ev => {
            const items = ev.data.dataTransfer && ev.data.dataTransfer.files;
            this._processBlobItems(items, ev.data);
        });

        this.eventManager.listen('paste', ev => {
            this._processClipboard(ev.data);
        });

        this.eventManager.listen('pasteBefore', ev => {
            this._decodeURL(ev);
        });
    }

    /**
     * Initialize default image importer
     * @memberOf ImportManager
     * @private
     */
    _initDefaultImageImporter() {
        this.eventManager.listen('addImageBlobHook', (blob, callback) => {
            const reader = new FileReader();

            reader.onload = event => {
                callback(event.target.result);
            };

            reader.readAsDataURL(blob);
        });
    }

    /**
     * Emit add image blob hook
     * @memberOf ImportManager
     * @param {object} item item
     * @private
     */
    _emitAddImageBlobHook(item) {
        const blob = item.name ? item : item.getAsFile(); // Blob or File

        this.eventManager.emit('addImageBlobHook', blob, url => {
            this.eventManager.emit('command', 'AddImage', {
                imageUrl: url,
                altText: blob.name || 'image'
            });
        });
    }

    /**
     * Decode url when paste link
     * @param {object} ev event object
     */
    _decodeURL(ev) {
        if (ev.source === 'markdown'
            && ev.data.text.length === 1
            && ev.data.text[0].match(/https?:\/\//g)
        ) {
            ev.data.update(null, null, [decodeURIComponent(ev.data.text[0])]);
        } else if (ev.source === 'wysiwyg' && ev.$clipboardContainer.find('A')) {
            const $anchor = ev.$clipboardContainer.find('A');

            $anchor.each((index, element) => {
                $(element).text(decodeURIComponent($(element).text()));
            });
        }
    }

    /**
     * Get blob or excel data from clipboard
     * @memberOf ImportManager
     * @param {object} evData Clipboard data
     * @private
     */
    _processClipboard(evData) {
        const cbData = evData.clipboardData || window.clipboardData;
        const blobItems = cbData && cbData.items;
        const types = cbData.types;

        if (blobItems && types && types.length === 1 && util.inArray('Files', types) !== -1) {
            this._processBlobItems(blobItems, evData);
        }
    }

    /**
     * Process for blob item
     * @memberOf ImportManager
     * @param {Array.<string>} items Item array
     * @param {object} evData Event data
     * @private
     */
    _processBlobItems(items, evData) {
        if (items) {
            util.forEachArray(items, item => {
                if (item.type.indexOf('image') !== -1) {
                    evData.preventDefault();
                    evData.codemirrorIgnore = true;
                    this._emitAddImageBlobHook(item);

                    return false;
                }

                return true;
            });
        }
    }

    /**
     * Returns if current cursor state is in block format ex) blockquote, list, task, codeblock
     * @returns {boolean}
     * @private
     */
    _isInBlockFormat() {
        const state = this._lastState;

        return state && (state.codeBlock || state.list || state.task || state.code);
    }
}

module.exports = ImportManager;
