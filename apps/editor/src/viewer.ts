/**
 * @fileoverview Implements editor preivew
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import extend from 'tui-code-snippet/object/extend';
import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';

import { ViewerOptions } from '@t/editor';
import { Emitter, Handler } from '@t/event';
import MarkdownPreview from './markdown/mdPreview';
import domUtils from './utils/dom-legacy';
import { invokePlugins, getPluginInfo } from './pluginHelper';
import { sanitizeLinkAttribute } from './utils/common';
import EventEmitter from './event/eventEmitter';

const TASK_ATTR_NAME = 'data-task';
const DISABLED_TASK_ATTR_NAME = 'data-task-disabled';
const TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class ToastUIEditorViewer
 * @param {object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} [options.initialValue] Editor's initial value
 *     @param {Object} [options.events] - Events
 *         @param {function} [options.events.load] - It would be emitted when editor fully load
 *         @param {function} [options.events.change] - It would be emitted when content changed
 *         @param {function} [options.events.caretChange] - It would be emitted when format change by cursor position
 *         @param {function} [options.events.focus] - It would be emitted when editor get focus
 *         @param {function} [options.events.blur] - It would be emitted when editor loose focus
 *     @param {Array.<function|Array>} [options.plugins] - Array of plugins. A plugin can be either a function or an array in the form of [function, options].
 *     @param {boolean} [options.useDefaultHTMLSanitizer=true] - use default htmlSanitizer
 *     @param {Object} [options.extendedAutolinks] - Using extended Autolinks specified in GFM spec
 *     @param {Object} [options.customConvertor] - convertor extention
 *     @param {Object} [options.linkAttributes] - Attributes of anchor element that should be rel, target, hreflang, type
 *     @param {Object} [options.customHTMLRenderer] - Object containing custom renderer functions correspond to markdown node
 *     @param {boolean} [options.referenceDefinition=false] - whether use the specification of link reference definition
 *     @param {function} [options.customHTMLSanitizer=null] - custom HTML sanitizer
 *     @param {boolean} [options.frontMatter=false] - whether use the front matter
 */
class ToastUIEditorViewer {
  private options: Required<ViewerOptions>;

  private codeBlockLanguages: string[];

  private eventEmitter: Emitter;

  private preview: MarkdownPreview;

  constructor(options: ViewerOptions) {
    this.options = extend(
      {
        useDefaultHTMLSanitizer: true,
        linkAttributes: null,
        extendedAutolinks: false,
        customConvertor: null,
        customHTMLRenderer: null,
        referenceDefinition: false,
        customHTMLSanitizer: null,
        frontMatter: false,
      },
      options
    );

    this.codeBlockLanguages = [];

    this.eventEmitter = new EventEmitter();

    const linkAttributes = sanitizeLinkAttribute(this.options.linkAttributes);
    const { renderer, parser, plugins } = getPluginInfo(this.options.plugins);
    const {
      customHTMLRenderer,
      extendedAutolinks,
      referenceDefinition,
      frontMatter,
    } = this.options;

    const rendererOptions = {
      linkAttributes,
      customHTMLRenderer: { ...renderer, ...customHTMLRenderer },
      extendedAutolinks,
      referenceDefinition,
      customParser: parser,
      frontMatter,
    };

    if (this.options.events) {
      forEachOwnProperties(this.options.events, (fn, key) => {
        this.on(key, fn);
      });
    }

    const { el, initialValue } = this.options;
    const existingHTML = el.innerHTML;

    el.innerHTML = '';

    this.preview = new MarkdownPreview(this.eventEmitter, {
      ...rendererOptions,
      isViewer: true,
    });

    on(this.preview.el!, 'mousedown', this.toggleTask.bind(this));

    if (plugins) {
      invokePlugins(plugins, this);
    }

    if (initialValue) {
      this.setMarkdown(initialValue);
    } else if (existingHTML) {
      this.preview.setHTML(existingHTML);
    }

    this.eventEmitter.emit('load', this);
  }

  /**
   * Toggle task by detecting mousedown event.
   * @param {MouseEvent} ev - event
   * @private
   */
  private toggleTask(ev: MouseEvent) {
    const element = ev.target as HTMLElement;
    const style = getComputedStyle(element, ':before');

    if (
      !element.hasAttribute(DISABLED_TASK_ATTR_NAME) &&
      element.hasAttribute(TASK_ATTR_NAME) &&
      domUtils.isInsideTaskBox(style, ev.offsetX, ev.offsetY)
    ) {
      domUtils.toggleClass(element, TASK_CHECKED_CLASS_NAME);
    }
  }

  /**
   * Set html value.
   * @param {string} html - html syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  // @TODO: should implement API
  // eslint-disable-next-line
  setHTML(html: string) {}

  /**
   * Set content for preview
   * @param {string} markdown Markdown text
   */
  setMarkdown(markdown: string) {
    markdown = markdown || '';

    this.preview.refresh();
    this.eventEmitter.emit('setMarkdownAfter', markdown);
  }

  /**
   * Bind eventHandler to event type
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  on(type: string, handler: Handler) {
    this.eventEmitter.listen(type, handler);
  }

  /**
   * Unbind eventHandler from event type
   * @param {string} type Event type
   */
  off(type: string) {
    this.eventEmitter.removeEventHandler(type);
  }

  /**
   * Remove Viewer preview from document
   */
  destroy() {
    this.preview.destroy();
    this.eventEmitter.emit('destroy');
    off(this.preview.el!, 'mousedown', this.toggleTask.bind(this));
  }

  /**
   * Add hook to Viewer preview's event
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  addHook(type: string, handler: Handler) {
    this.eventEmitter.removeEventHandler(type);
    this.eventEmitter.listen(type, handler);
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
    languages.forEach((lang) => {
      if (this.codeBlockLanguages.indexOf(lang) < 0) {
        this.codeBlockLanguages.push(lang);
      }
    });
  }
}

// /**
//  * Check whether is viewer (using in plugins)
//  * @type {boolean}
//  * @ignore
//  */
// ToastUIEditorViewer.isViewer = true;

export default ToastUIEditorViewer;
