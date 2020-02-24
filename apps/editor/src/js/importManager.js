/**
 * @fileoverview Implement Module for managing import external data such as image
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import forEachArray from 'tui-code-snippet/collection/forEachArray';
import inArray from 'tui-code-snippet/array/inArray';

const URLRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/g;

/**
 * Class ImportManager
 * @param {EventManager} eventManager - eventManager
 * @ignore
 */
class ImportManager {
  constructor(eventManager) {
    this.eventManager = eventManager;

    this._initEvent();
    this._initDefaultImageImporter();
  }

  /**
   * graceful decode uri component
   * @param {string} originalURI - string to be decoded
   * @returns {string} decoded string
   * @static
   */
  static decodeURIGraceful(originalURI) {
    const uris = originalURI.split(' ');
    const decodedURIs = [];
    let decodedURI;

    forEachArray(uris, uri => {
      try {
        decodedURI = decodeURIComponent(uri);
        decodedURI = decodedURI.replace(/ /g, '%20');
      } catch (e) {
        decodedURI = uri;
      }

      return decodedURIs.push(decodedURI);
    });

    return decodedURIs.join(' ');
  }

  /**
   * encode markdown critical characters
   * @param {string} text - string to encode
   * @returns {string} - markdown character encoded string
   * @static
   */
  static encodeMarkdownCharacters(text) {
    return text
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\[/g, '%5B')
      .replace(/\]/g, '%5D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E');
  }

  /**
   * escape markdown critical characters
   * @param {string} text - string to escape
   * @returns {string} - markdown character escaped string
   * @static
   */
  static escapeMarkdownCharacters(text) {
    return text
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/</g, '\\<')
      .replace(/>/g, '\\>');
  }

  /**
   * Initialize event handler
   * @private
   */
  _initEvent() {
    this.eventManager.listen('drop', ev => {
      const items = ev.data.dataTransfer && ev.data.dataTransfer.files;

      this._processBlobItems(items, ev.data);
    });

    this.eventManager.listen('willPaste', ev => {
      // IE has no interface to handle clipboard image. #976
      const { fragment } = ev.data;
      const descendant = fragment.querySelectorAll('*');

      // only if paste event data has one img element and the element has base64 encoded image
      if (
        descendant.length !== 1 ||
        descendant[0].tagName !== 'IMG' ||
        !/^data:image/.test(descendant[0].src)
      ) {
        return;
      }
      ev.data.preventDefault();

      const blob = dataURItoBlob(descendant[0].src);

      this._emitAddImageBlobHook(blob, 'paste');
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
   * @param {object} blob - blob or file
   * @param {string} type - type of an event the item belongs to. paste or drop
   * @private
   */
  _emitAddImageBlobHook(blob, type) {
    this.eventManager.emit(
      'addImageBlobHook',
      blob,
      (imageUrl, altText) => {
        this.eventManager.emit('command', 'AddImage', {
          imageUrl,
          altText: altText || blob.name || 'image'
        });
      },
      type
    );
  }

  /**
   * Decode url when paste link
   * @param {object} ev - event object
   * @private
   */
  _decodeURL(ev) {
    const { decodeURIGraceful, encodeMarkdownCharacters } = ImportManager;

    if (ev.source === 'markdown' && ev.data.text) {
      const texts = ev.data.text;
      let [text] = texts;

      if (texts.length === 1 && text.match(URLRegex)) {
        text = decodeURIGraceful(text);
        text = encodeMarkdownCharacters(text);
        ev.data.update(null, null, [text]);
      }
    } else if (ev.source === 'wysiwyg') {
      const container = ev.clipboardContainer;
      const [firstChild] = container.childNodes;
      const text = firstChild.innerText;

      if (container.childNodes.length === 1 && firstChild.tagName === 'A' && text.match(URLRegex)) {
        firstChild.innerText = decodeURIGraceful(text);
        firstChild.href = encodeMarkdownCharacters(firstChild.href);
      }
    }
  }

  /**
   * Get blob or excel data from clipboard
   * @param {object} evData Clipboard data
   * @private
   */
  _processClipboard(evData) {
    const cbData = evData.clipboardData || window.clipboardData;
    const blobItems = cbData && cbData.items;
    const { types } = cbData;

    if (blobItems && types && types.length === 1 && inArray('Files', [].slice.call(types)) !== -1) {
      this._processBlobItems(blobItems, evData);
    }
  }

  /**
   * Process for blob item
   * @param {Array.<string>} items Item array
   * @param {object} evData Event data
   * @private
   */
  _processBlobItems(items, evData) {
    if (items) {
      forEachArray(items, item => {
        if (item.type.indexOf('image') !== -1) {
          evData.preventDefault();
          evData.stopPropagation();
          evData.codemirrorIgnore = true;

          const blob = item.name ? item : item.getAsFile(); // Blob or File

          this._emitAddImageBlobHook(blob, evData.type);

          return false;
        }

        return true;
      });
    }
  }
}

/**
 * data URI to Blob
 * @param {string} dataURI - data URI string
 * @returns {Blob} - blob data
 * @ignore
 */
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  const [mimeString] = dataURI.split(',');
  const blob = new Blob([ab], { type: mimeString.split(':')[1].split(';')[0] });

  return blob;
}

export default ImportManager;
