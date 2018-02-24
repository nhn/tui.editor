/**
 * @fileoverview Implements editor preivew
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import MarkdownPreview from './mdPreview';
import EventManager from './eventManager';
import CommandManager from './commandManager';
import extManager from './extManager';
import Convertor from './convertor';
import domUtils from './domUtils';
import codeBlockManager from './codeBlockManager';

const TASK_ATTR_NAME = 'data-te-task';
const TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class ToastUIEditorViewer
 */
class ToastUIEditorViewer {
  /**
     * Viewer
     * @param {object} options Option object
        * @param {string} options.initialValue Editor's initial value
        * @param {object} options.events eventlist Event list
            * @param {function} options.events.load It would be emitted when editor fully load
            * @param {function} options.events.change It would be emitted when content changed
            * @param {function} options.events.stateChange It would be emitted when format change by cursor position
            * @param {function} options.events.focus It would be emitted when editor get focus
            * @param {function} options.events.blur It would be emitted when editor loose focus
        * @param {object} options.hooks Hook list
            * @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
    */
  constructor(options) {
    this.options = $.extend({
      useDefaultHTMLSanitizer: true
    }, options);

    this.eventManager = new EventManager();
    this.commandManager = new CommandManager(this);
    this.convertor = new Convertor(this.eventManager);
    this.toMarkOptions = null;

    if (this.options.useDefaultHTMLSanitizer) {
      this.convertor.initHtmlSanitizer();
    }

    if (this.options.hooks) {
      util.forEach(this.options.hooks, (fn, key) => {
        this.addHook(key, fn);
      });
    }

    if (this.options.events) {
      util.forEach(this.options.events, (fn, key) => {
        this.on(key, fn);
      });
    }

    this.preview = new MarkdownPreview($(this.options.el), this.eventManager, this.convertor, true);

    this.preview.$el.on('mousedown', $.proxy(this._toggleTask, this));

    extManager.applyExtension(this, this.options.exts);

    this.setValue(this.options.initialValue);

    this.eventManager.emit('load', this);
  }

  /**
   * Toggle task by detecting mousedown event.
   * @param {MouseEvent} ev - event
   * @private
   */
  _toggleTask(ev) {
    const isBeneathTaskBox = ev.offsetX < 18 && ev.offsetY > 18;

    if (ev.target.hasAttribute(TASK_ATTR_NAME) && !isBeneathTaskBox) {
      $(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
      this.eventManager.emit('change', {
        source: 'viewer',
        data: ev
      });
    }
  }

  /**
   * Set content for preview
   * @memberof ToastUIEditorViewer
   * @param {string} markdown Markdown text
   */
  setMarkdown(markdown) {
    this.markdownValue = markdown = markdown || '';

    this.preview.refresh(this.markdownValue);
    this.eventManager.emit('setMarkdownAfter', this.markdownValue);
  }

  /**
   * Set content for preview
   * @memberof ToastUIEditorViewer
   * @param {string} markdown Markdown text
   * @deprecated
   */
  setValue(markdown) {
    this.setMarkdown(markdown);
  }

  /**
   * Bind eventHandler to event type
   * @memberof ToastUIEditorViewer
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  on(type, handler) {
    this.eventManager.listen(type, handler);
  }

  /**
   * Unbind eventHandler from event type
   * @memberof ToastUIEditorViewer
   * @param {string} type Event type
   */
  off(type) {
    this.eventManager.removeEventHandler(type);
  }

  /**
   * Remove Viewer preview from document
   * @memberof ToastUIEditorViewer
   */
  remove() {
    this.eventManager.emit('removeEditor');
    this.preview.$el.off('mousedown', $.proxy(this._toggleTask, this));
    this.options = null;
    this.eventManager = null;
    this.commandManager = null;
    this.convertor = null;
    this.preview = null;
  }

  /**
   * Add hook to Viewer preview's event
   * @memberof ToastUIEditorViewer
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  addHook(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
  }

  /**
   * Return true
   * @memberof ToastUIEditorViewer
   * @returns {boolean}
   */
  isViewer() {
    return true;
  }

  /**
   * Return false
   * @memberof ToastUIEditorViewer
   * @returns {boolean}
   */
  isMarkdownMode() {
    return false;
  }

  /**
   * Return false
   * @memberof ToastUIEditorViewer
   * @returns {boolean}
   */
  isWysiwygMode() {
    return false;
  }

  /**
   * Define extension
   * @memberof ToastUIEditorViewer
   * @param {string} name Extension name
   * @param {ExtManager~extension} ext extension
   */
  static defineExtension(name, ext) {
    extManager.defineExtension(name, ext);
  }
}

/**
 * check whther is viewer
 * @type {boolean}
 */
ToastUIEditorViewer.isViewer = true;

/**
 * domUtil instance
 * @type {DomUtil}
 */
ToastUIEditorViewer.domUtils = domUtils;

/**
 * CodeBlockManager instance
 * @type {CodeBlockManager}
 */
ToastUIEditorViewer.codeBlockManager = codeBlockManager;

/**
 * MarkdownIt hightlight instance
 * @type {MarkdownIt}
 */
ToastUIEditorViewer.markdownitHighlight = Convertor.getMarkdownitHighlightRenderer();

/**
 * @ignore
 */
ToastUIEditorViewer.i18n = null;

/**
 * @ignore
 */
ToastUIEditorViewer.Button = null;

/**
 * @ignore
 */
ToastUIEditorViewer.WwCodeBlockManager = null;

/**
 * @ignore
 */
ToastUIEditorViewer.WwTableManager = null;

/**
 * @ignore
 */
ToastUIEditorViewer.WwTableSelectionManager = null;

module.exports = ToastUIEditorViewer;
