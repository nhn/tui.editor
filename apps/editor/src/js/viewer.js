/**
 * @fileoverview Implements editor preivew
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import extend from 'tui-code-snippet/object/extend';
import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';

import MarkdownPreview from './mdPreview';
import EventManager from './eventManager';
import CommandManager from './commandManager';
import Convertor from './convertor';
import domUtils from './utils/dom';
import codeBlockManager from './codeBlockManager';
import { invokePlugins, getPluginInfo } from './pluginHelper';
import { sanitizeLinkAttribute } from './utils/common';
import htmlSanitizer from './htmlSanitizer';

const TASK_ATTR_NAME = 'data-te-task';
const TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class ToastUIEditorViewer
 * @param {object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} [options.initialValue] Editor's initial value
 *     @param {Object} [options.events] - Events
 *         @param {function} [options.events.load] - It would be emitted when editor fully load
 *         @param {function} [options.events.change] - It would be emitted when content changed
 *         @param {function} [options.events.stateChange] - It would be emitted when format change by cursor position
 *         @param {function} [options.events.focus] - It would be emitted when editor get focus
 *         @param {function} [options.events.blur] - It would be emitted when editor loose focus
 *     @param {Object} [options.hooks] - Hooks
 *         @param {function} [options.hooks.previewBeforeHook] - Submit preview to hook URL before preview be shown
 *     @param {Array.<function|Array>} [options.plugins] - Array of plugins. A plugin can be either a function or an array in the form of [function, options].
 *     @param {boolean} [options.useDefaultHTMLSanitizer=true] - use default htmlSanitizer
 *     @param {Object} [options.extendedAutolinks] - Using extended Autolinks specified in GFM spec
 *     @param {Object} [options.customConvertor] - convertor extention
 *     @param {Object} [options.linkAttribute] - Attributes of anchor element that should be rel, target, contenteditable, hreflang, type
 *     @param {Object} [options.customHTMLRenderer] - Object containing custom renderer functions correspond to markdown node
 *     @param {boolean} [options.referenceDefinition=false] - whether use the specification of link reference definition
 *     @param {function} [options.customHTMLSanitizer=null] - custom HTML sanitizer
 */
class ToastUIEditorViewer {
  constructor(options) {
    this.options = extend(
      {
        useDefaultHTMLSanitizer: true,
        linkAttribute: null,
        extendedAutolinks: false,
        customConvertor: null,
        customHTMLRenderer: null,
        referenceDefinition: false,
        customHTMLSanitizer: null
      },
      options
    );

    this.codeBlockLanguages = [];

    this.eventManager = new EventManager();
    this.commandManager = new CommandManager(this);

    const linkAttribute = sanitizeLinkAttribute(this.options.linkAttribute);
    const { renderer, parser, plugins } = getPluginInfo(this.options.plugins);
    const {
      customHTMLRenderer,
      customHTMLSanitizer,
      extendedAutolinks,
      referenceDefinition
    } = this.options;
    const rendererOptions = {
      linkAttribute,
      customHTMLRenderer: { ...renderer, ...customHTMLRenderer },
      extendedAutolinks,
      referenceDefinition,
      customParser: parser
    };

    if (this.options.customConvertor) {
      // eslint-disable-next-line new-cap
      this.convertor = new this.options.customConvertor(this.eventManager, rendererOptions);
    } else {
      this.convertor = new Convertor(this.eventManager, rendererOptions);
    }

    const sanitizer =
      customHTMLSanitizer || (this.options.useDefaultHTMLSanitizer ? htmlSanitizer : null);

    if (sanitizer) {
      this.convertor.initHtmlSanitizer(sanitizer);
    }

    if (this.options.hooks) {
      forEachOwnProperties(this.options.hooks, (fn, key) => {
        this.addHook(key, fn);
      });
    }

    if (this.options.events) {
      forEachOwnProperties(this.options.events, (fn, key) => {
        this.on(key, fn);
      });
    }

    const { el, initialValue } = this.options;
    const existingHTML = el.innerHTML;

    el.innerHTML = '';

    this.preview = new MarkdownPreview(el, this.eventManager, this.convertor, {
      ...rendererOptions,
      isViewer: true
    });

    on(this.preview.el, 'mousedown', this._toggleTask.bind(this));

    if (plugins) {
      invokePlugins(plugins, this);
    }

    if (initialValue) {
      this.setMarkdown(initialValue);
    } else if (existingHTML) {
      this.preview.setHTML(existingHTML);
    }

    this.eventManager.emit('load', this);
  }

  /**
   * Toggle task by detecting mousedown event.
   * @param {MouseEvent} ev - event
   * @private
   */
  _toggleTask(ev) {
    const style = getComputedStyle(ev.target, ':before');

    if (
      ev.target.hasAttribute(TASK_ATTR_NAME) &&
      domUtils.isInsideTaskBox(style, ev.offsetX, ev.offsetY)
    ) {
      domUtils.toggleClass(ev.target, TASK_CHECKED_CLASS_NAME);
      this.eventManager.emit('change', {
        source: 'viewer',
        data: ev
      });
    }
  }

  /**
   * Set content for preview
   * @param {string} markdown Markdown text
   */
  setMarkdown(markdown) {
    this.markdownValue = markdown = markdown || '';

    this.preview.refresh(this.markdownValue);
    this.eventManager.emit('setMarkdownAfter', this.markdownValue);
  }

  /**
   * Bind eventHandler to event type
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  on(type, handler) {
    this.eventManager.listen(type, handler);
  }

  /**
   * Unbind eventHandler from event type
   * @param {string} type Event type
   */
  off(type) {
    this.eventManager.removeEventHandler(type);
  }

  /**
   * Remove Viewer preview from document
   */
  remove() {
    this.eventManager.emit('removeEditor');
    off(this.preview.el, 'mousedown', this._toggleTask.bind(this));
    this.preview.remove();
    this.options = null;
    this.eventManager = null;
    this.commandManager = null;
    this.convertor = null;
    this.preview = null;
  }

  /**
   * Add hook to Viewer preview's event
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  addHook(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
  }

  /**
   * Return true
   * @returns {boolean}
   */
  isViewer() {
    return true;
  }

  /**
   * Return false
   * @returns {boolean}
   */
  isMarkdownMode() {
    return false;
  }

  /**
   * Return false
   * @returns {boolean}
   */
  isWysiwygMode() {
    return false;
  }

  /**
   * Set code block languages
   * @param {Array} languages - code lauguage list
   */
  setCodeBlockLanguages(languages = []) {
    languages.forEach(lang => {
      if (this.codeBlockLanguages.indexOf(lang) < 0) {
        this.codeBlockLanguages.push(lang);
      }
    });
  }
}

/**
 * Check whether is viewer (using in plugins)
 * @type {boolean}
 * @ignore
 */
ToastUIEditorViewer.isViewer = true;

/**
 * domUtil instance
 * @type {DomUtil}
 * @ignore
 */
ToastUIEditorViewer.domUtils = domUtils;

/**
 * CodeBlockManager instance using in plugins
 * @type {CodeBlockManager}
 * @ignore
 */
ToastUIEditorViewer.codeBlockManager = codeBlockManager;

/**
 * WwCodeBlockManager class using in plugins
 * @type {Class.<WwCodeBlockManager>}
 * @ignore
 */
ToastUIEditorViewer.WwCodeBlockManager = null;

/**
 * WwTableManager class using in plugins
 * @type {Class.<WwTableManager>}
 * @ignore
 */
ToastUIEditorViewer.WwTableManager = null;

/**
 * WwTableManager class using in plugins
 * @type {Class.<WwTableSelectionManager>}
 * @ignore
 */
ToastUIEditorViewer.WwTableSelectionManager = null;

export default ToastUIEditorViewer;
