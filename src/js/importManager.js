/**
 * @fileoverview Implement Module for managing import external data such as image
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import excelTableParser from './excelTableParser';

const util = tui.util;
const FIND_EXCEL_DATA = /^(([^\n\r]*|"[^"]+")(\t([^\n\r]*?|"[^"]+")){1,}[\r\n]*){1,}$/;

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
        const blob = item.name ? item : item.getAsFile(); //Blob or File

        this.eventManager.emit('addImageBlobHook', blob, url => {
            this.eventManager.emit('command', 'AddImage', {imageUrl: url, altText: blob.name || 'image'});
        });
    }

    /**
     * Add table with excel style data
     * @memberOf ImportManager
     * @param {string} content Table data
     * @private
     */
    _addExcelTable(content) {
        const tableInfo = excelTableParser(content);
        this.eventManager.emit('command', 'Table', tableInfo.col, tableInfo.row, tableInfo.data);
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
        } else if (!this._isInBlockFormat()) {
            this._precessDataTransfer(cbData, evData);
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
     * Process for excel style data
     * @memberOf ImportManager
     * @param {HTMLElement} cbData Clipboard data
     * @param {object} evData Event data
     * @private
     */
    _precessDataTransfer(cbData, evData) {
        const textContent = cbData.getData('text');

        if (FIND_EXCEL_DATA.test(textContent) && confirm('테이블 포맷으로 붙여넣겠습니까?')) {
            evData.preventDefault();
            evData.codemirrorIgnore = true;
            this._addExcelTable(textContent);
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
