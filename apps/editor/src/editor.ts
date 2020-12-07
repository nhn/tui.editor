/**
 * @fileoverview Implements Editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import extend from 'tui-code-snippet/object/extend';
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import { Emitter, EventTypes, Handler } from '@t/event';
import { EditorOptions, EditorType, PreviewStyle, ViewerOptions } from '@t/editor';
import { EditorCommandFn } from '@t/spec';

import { sendHostName, sanitizeLinkAttribute } from './utils/common';

import MarkdownEditor from './markdown/mdEditor';
import MarkdownPreview from './markdown/mdPreview';

import WysiwygEditor from './wysiwyg/wwEditor';

import Layout from './ui/layout';
import EventEmitter from './event/eventEmitter';
import CommandManager from './commands/commandManager';
import Convertor from './convertors/convertor';
import Viewer from './viewer';
import i18n, { I18n } from './i18n/i18n';
import DefaultUI from './ui/defaultUI';
import { invokePlugins, getPluginInfo } from './pluginHelper';

// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import isString from 'tui-code-snippet/type/isString';

/**
 * ToastUI Editor
 * @param {Object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} [options.height='300px'] - Editor's height style value. Height is applied as border-box ex) '300px', '100%', 'auto'
 *     @param {string} [options.minHeight='200px'] - Editor's min-height style value in pixel ex) '300px'
 *     @param {string} [options.initialValue] - Editor's initial value
 *     @param {string} [options.previewStyle] - Markdown editor's preview style (tab, vertical)
 *     @param {boolean} [options.previewHighlight = true] - Highlight a preview element corresponds to the cursor position in the markdwon editor
 *     @param {string} [options.initialEditType] - Initial editor type (markdown, wysiwyg)
 *     @param {Object} [options.events] - Events
 *         @param {function} [options.events.load] - It would be emitted when editor fully load
 *         @param {function} [options.events.change] - It would be emitted when content changed
 *         @param {function} [options.events.stateChange] - It would be emitted when format change by cursor position
 *         @param {function} [options.events.focus] - It would be emitted when editor get focus
 *         @param {function} [options.events.blur] - It would be emitted when editor loose focus
 *     @param {Object} [options.hooks] - Hooks
 *         @param {function} [options.hooks.previewBeforeHook] - Submit preview to hook URL before preview be shown
 *         @param {addImageBlobHook} [options.hooks.addImageBlobHook] - hook for image upload
 *     @param {string} [options.language='en-US'] - language
 *     @param {boolean} [options.useCommandShortcut=true] - whether use keyboard shortcuts to perform commands
 *     @param {boolean} [options.useDefaultHTMLSanitizer=true] - use default htmlSanitizer
 *     @param {boolean} [options.usageStatistics=true] - send hostname to google analytics
 *     @param {Array.<string|toolbarItemsValue>} [options.toolbarItems] - toolbar items.
 *     @param {boolean} [options.hideModeSwitch=false] - hide mode switch tab bar
 *     @param {Array.<function|Array>} [options.plugins] - Array of plugins. A plugin can be either a function or an array in the form of [function, options].
 *     @param {Object} [options.extendedAutolinks] - Using extended Autolinks specified in GFM spec
 *     @param {Object} [options.customConvertor] - convertor extention
 *     @param {string} [options.placeholder] - The placeholder text of the editable element.
 *     @param {Object} [options.linkAttribute] - Attributes of anchor element that should be rel, target, contenteditable, hreflang, type
 *     @param {Object} [options.customHTMLRenderer] - Object containing custom renderer functions correspond to markdown node
 *     @param {boolean} [options.referenceDefinition=false] - whether use the specification of link reference definition
 *     @param {function} [options.customHTMLSanitizer=null] - custom HTML sanitizer
 *     @param {boolean} [options.frontMatter=false] - whether use the front matter
 */
class ToastUIEditor {
  private initialHtml: string;

  private options: Required<EditorOptions>;

  private codeBlockLanguages: string[];

  private eventEmitter: Emitter;

  private layout: Layout;

  private toastMark: ToastMark;

  private mdEditor: MarkdownEditor;

  // @TODO: change wwe editor type
  private wwEditor: any;

  private preview: MarkdownPreview;

  private convertor: Convertor;

  private commandManager: CommandManager;

  private height!: string;

  private minHeight!: string;

  private currentMode!: EditorType;

  private mdPreviewStyle!: PreviewStyle;

  private i18n: I18n;

  // @TODO: deprecated
  private ui: any;

  constructor(options: EditorOptions) {
    this.initialHtml = options.el.innerHTML;
    options.el.innerHTML = '';

    this.options = extend(
      {
        previewStyle: 'tab',
        previewHighlight: true,
        initialEditType: 'markdown',
        height: '300px',
        minHeight: '200px',
        language: 'en-US',
        useDefaultHTMLSanitizer: true,
        useCommandShortcut: true,
        usageStatistics: true,
        toolbarItems: [
          'heading',
          'bold',
          'italic',
          'strike',
          'divider',
          'hr',
          'quote',
          'divider',
          'ul',
          'ol',
          'task',
          'indent',
          'outdent',
          'divider',
          'table',
          'image',
          'link',
          'divider',
          'code',
          'codeblock'
        ],
        hideModeSwitch: false,
        linkAttribute: null,
        extendedAutolinks: false,
        customConvertor: null,
        customHTMLRenderer: null,
        referenceDefinition: false,
        customHTMLSanitizer: null,
        frontMatter: false
      },
      options
    );

    this.codeBlockLanguages = [];

    this.eventEmitter = new EventEmitter();

    // @TODO: should add sanitizeLinkAttribute method type
    // @ts-ignore
    const linkAttribute = sanitizeLinkAttribute(this.options.linkAttribute);
    const { renderer, parser, plugins } = getPluginInfo(this.options.plugins);
    const {
      customHTMLRenderer,
      extendedAutolinks,
      referenceDefinition,
      frontMatter
    } = this.options;
    const rendererOptions = {
      linkAttribute,
      customHTMLRenderer: { ...renderer, ...customHTMLRenderer },
      extendedAutolinks,
      referenceDefinition,
      customParser: parser,
      frontMatter,
      customProp: { showFrontMatter: frontMatter }
    };

    if (this.options.hooks) {
      forEachOwnProperties(this.options.hooks, (fn, key) => this.addHook(key, fn));
    }

    if (this.options.events) {
      forEachOwnProperties(this.options.events, (fn, key) => this.on(key, fn));
    }

    this.layout = new Layout(this.options, this.eventEmitter);

    this.i18n = i18n;
    this.i18n.setCode(this.options.language);

    this.setUI(this.options.UI || new DefaultUI(this));

    this.toastMark = new ToastMark('', {
      disallowedHtmlBlockTags: ['br'],
      extendedAutolinks,
      referenceDefinition,
      disallowDeepHeading: true,
      customParser: parser,
      frontMatter
    });

    this.mdEditor = new MarkdownEditor(
      this.layout.getMdEditorContainerEl(),
      this.toastMark,
      this.eventEmitter
    );

    this.preview = new MarkdownPreview(this.layout.getPreviewEl(), this.eventEmitter, {
      ...rendererOptions,
      isViewer: false,
      highlight: this.options.previewHighlight
    });

    this.wwEditor = new WysiwygEditor(this.layout.getWwEditorContainerEl(), this.eventEmitter);

    this.convertor = new Convertor(this.wwEditor.getSchema());

    if (plugins) {
      invokePlugins(plugins, this);
    }

    this.changePreviewStyle(this.options.previewStyle);

    this.changeMode(this.options.initialEditType, true);

    this.setMinHeight(this.options.minHeight);

    this.setHeight(this.options.height);

    this.setMarkdown(this.options.initialValue, false);

    if (this.options.placeholder) {
      this.setPlaceholder(this.options.placeholder);
    }

    if (!this.options.initialValue) {
      this.setHTML(this.initialHtml, false);
    }

    this.eventEmitter.emit('load', this);

    this.commandManager = new CommandManager(
      this.eventEmitter,
      this.mdEditor.commands,
      this.wwEditor.commands
    );

    if (this.options.usageStatistics) {
      sendHostName();
    }

    // @TODO: should change for prosemirror
    // register(this);
  }

  /**
   * Factory method for Editor
   * @param {object} options Option for initialize TUIEditor
   * @returns {object} ToastUIEditor or ToastUIEditorViewer
   */
  static factory(options: (EditorOptions | ViewerOptions) & { viewer?: boolean }) {
    return options.viewer ? new Viewer(options) : new ToastUIEditor(options as EditorOptions);
  }

  /**
   * Set language
   * @param {string} code - code for I18N language
   * @param {object} data - language set
   */
  static setLanguage(code: string, data: Record<string, string>) {
    i18n.setLanguage(code, data);
  }

  /**
   * change preview style
   * @param {string} style - 'tab'|'vertical'
   */
  changePreviewStyle(style: PreviewStyle) {
    this.layout.changePreviewStyle(style);
    this.mdPreviewStyle = style;
    this.eventEmitter.emit('changePreviewStyle', style);
    this.eventEmitter.emit('previewNeedsRefresh', this.getMarkdown());
  }

  /**
   * call commandManager's exec method
   * @param {*} ...args Command argument
   */
  exec(type: EditorType, name: string, payload: Record<string, any>) {
    this.commandManager.exec(type, name, payload);
  }

  addCommand(type: EditorType, name: string, command: EditorCommandFn) {
    this.commandManager.addCommand(type, name, command);
  }

  /**
   * Bind eventHandler to event type
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  on(type: EventTypes, handler: Handler) {
    this.eventEmitter.listen(type, handler);
  }

  /**
   * Unbind eventHandler from event type
   * @param {string} type Event type
   */
  off(type: EventTypes) {
    this.eventEmitter.removeEventHandler(type);
  }

  /**
   * Add hook to TUIEditor event
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  addHook(type: EventTypes, handler: Handler) {
    this.eventEmitter.removeEventHandler(type);
    this.eventEmitter.listen(type, handler);
  }

  /**
   * Remove hook from TUIEditor event
   * @param {string} type Event type
   */
  removeHook(type: EventTypes) {
    this.eventEmitter.removeEventHandler(type);
  }

  /**
   * Set focus to current Editor
   */
  focus() {
    this.getCurrentModeEditor().focus();
  }

  /**
   * Remove focus of current Editor
   */
  blur() {
    this.getCurrentModeEditor().blur();
  }

  /**
   * Set cursor position to end
   */
  moveCursorToEnd() {
    this.getCurrentModeEditor().moveCursorToEnd();
  }

  /**
   * Set cursor position to start
   */
  moveCursorToStart() {
    this.getCurrentModeEditor().moveCursorToStart();
  }

  /**
   * Set markdown syntax text.
   * @param {string} markdown - markdown syntax text.
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  setMarkdown(markdown: string, cursorToEnd = true) {
    markdown = markdown ?? '';

    this.mdEditor.setMarkdown(markdown, cursorToEnd);

    if (this.isWysiwygMode()) {
      const mdNode = this.toastMark.getRootNode();
      const wwNode = this.convertor.toWysiwygModel(mdNode);

      this.wwEditor.setModel(wwNode, cursorToEnd);
    }

    this.eventEmitter.emit('setMarkdownAfter', markdown);
  }

  /**
   * Set html value.
   * @param {string} html - html syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  // @TODO: should implement API
  // eslint-disable-next-line
  setHTML(html: string, cursorToEnd = true) {}

  /**
   * Get markdown syntax text.
   * @returns {string}
   */
  getMarkdown() {
    let markdown;

    if (this.isMarkdownMode()) {
      markdown = this.mdEditor.getMarkdown();
    } else {
      markdown = this.convertor.toMarkdownText(this.wwEditor.getModel());
    }

    return markdown;
  }

  /**
   * Get html syntax text.
   * @returns {string}
   */
  getHtml() {
    if (this.isWysiwygMode()) {
      this.mdEditor.setMarkdown(this.convertor.toMarkdownText(this.wwEditor.getModel()));
    }

    return '';
  }

  /**
   * Insert text
   * @param {string} text - text string to insert
   */
  insertText(text: string) {
    if (this.isMarkdownMode()) {
      this.mdEditor.replaceSelection(text);
    } else {
      this.wwEditor.insertText(text);
    }
  }

  /**
   * Add widget to selection
   * @param {Range} selection Current selection
   * @param {Node} node widget node
   * @param {string} style Adding style "over" or "bottom"
   * @param {number} [offset] Offset for adjust position
   */
  // @TODO: should reimplment the API
  // @ts-ignore
  addWidget(selection, node, style, offset) {
    this.getCurrentModeEditor().addWidget(selection, node, style, offset);
  }

  /**
   * Set editor height
   * @param {string} height - editor height
   * @returns {string} editor height
   */
  setHeight(height: string) {
    const { el } = this.options;

    if (isString(height)) {
      if (height === 'auto') {
        addClass(el, 'auto-height');
        this.setMinHeight(this.getMinHeight());
      } else {
        removeClass(el, 'auto-height');
        this.setMinHeight(height);
      }
    }

    css(el, { height });
    this.height = height;
  }

  getHeight() {
    return this.height;
  }

  /**
   * Set / Get min content height
   * @param {string} minHeight - min content height in pixel
   * @returns {string} - min height in pixel
   */
  setMinHeight(minHeight: string) {
    this.minHeight = minHeight;

    const editorHeight = this.ui.getEditorHeight();
    const editorSectionHeight = this.ui.getEditorSectionHeight();
    const diffHeight = editorHeight - editorSectionHeight;

    let minHeightNum = parseInt(minHeight, 10);

    minHeightNum = Math.max(minHeightNum - diffHeight, 0);

    // this.wwEditor.setMinHeight(minHeightNum);
    this.mdEditor.setMinHeight(minHeightNum);
    this.preview.setMinHeight(minHeightNum);
  }

  getMinHeight() {
    return this.minHeight;
  }

  /**
   * Get current editor mode name
   * @returns {Object} MarkdownEditor or WysiwygEditor
   */
  getCurrentModeEditor() {
    let editor;

    if (this.isMarkdownMode()) {
      editor = this.mdEditor;
    } else {
      editor = this.wwEditor;
    }

    return editor;
  }

  /**
   * Return true if current editor mode is Markdown
   * @returns {boolean}
   */
  isMarkdownMode() {
    return this.currentMode === 'markdown';
  }

  /**
   * Return true if current editor mode is WYSIWYG
   * @returns {boolean}
   */
  isWysiwygMode() {
    return this.currentMode === 'wysiwyg';
  }

  /**
   * Return false
   * @returns {boolean}
   */
  isViewer() {
    return false;
  }

  /**
   * Get current Markdown editor's preview style
   * @returns {string}
   */
  getCurrentPreviewStyle() {
    return this.mdPreviewStyle;
  }

  /**
   * Change editor's mode to given mode string
   * @param {string} mode - Editor mode name of want to change
   * @param {boolean} [isWithoutFocus] - Change mode without focus
   */
  changeMode(mode: EditorType, isWithoutFocus?: boolean) {
    if (this.currentMode === mode) {
      return;
    }

    this.eventEmitter.emit('changeModeBefore', this.currentMode);

    this.currentMode = mode;

    if (this.isWysiwygMode()) {
      this.layout.switchToWYSIWYG();

      const mdNode = this.toastMark.getRootNode();
      const wwNode = this.convertor.toWysiwygModel(mdNode);

      this.wwEditor.setModel(wwNode);

      this.eventEmitter.emit('changeModeToWysiwyg');
    } else {
      this.layout.switchToMarkdown();

      const wwNode = this.wwEditor.getModel();

      this.mdEditor.setMarkdown(this.convertor.toMarkdownText(wwNode), !isWithoutFocus);
      this.eventEmitter.emit('changeModeToMarkdown');
    }

    this.eventEmitter.emit('changeMode', mode);

    if (!isWithoutFocus) {
      this.focus();
    }
  }

  /**
   * Remove TUIEditor from document
   */
  destroy() {
    this.wwEditor.destroy();
    this.mdEditor.destroy();
    this.layout.destroy();
    this.preview.destroy();

    if (this.getUI()) {
      this.getUI().remove();
    }

    this.eventEmitter.emit('removeEditor');
    this.eventEmitter.getEvents().forEach((_, type: EventTypes) => {
      this.off(type);
    });
  }

  /**
   * Hide TUIEditor
   */
  hide() {
    this.eventEmitter.emit('hide', this);
  }

  /**
   * Show TUIEditor
   */
  show() {
    this.eventEmitter.emit('show', this);
  }

  /**
   * Scroll Editor content to Top
   * @param {number} value Scroll amount
   * @returns {number}
   */
  scrollTop(value: number) {
    return this.getCurrentModeEditor().scrollTop(value);
  }

  // @TODO: deprecated
  setUI(UI: any) {
    this.ui = UI;
  }

  // @TODO: deprecated
  getUI() {
    return this.ui;
  }

  /**
   * Reset TUIEditor
   */
  reset() {
    this.wwEditor.reset();
    this.mdEditor.setMarkdown('');
  }

  /**
   * Get current range
   * @returns {{start, end}|Range}
   */
  // @TODO: implement the API
  getRange() {
    return this.getCurrentModeEditor().getRange();
  }

  /**
   * Get text object of current range
   * @param {{start, end}|Range} range Range object of each editor
   * @returns {MdTextObject|WwTextObject} TextObject class
   */
  // @TODO: change the way to provide API
  // eslint-disable-next-line
  getTextObject() {}

  /**
   * get selected text
   * @returns {string} - selected text
   */
  // @TODO: change the way to provide API
  // eslint-disable-next-line
  getSelectedText() {
    // const range = this.getRange();
    // const textObject = this.getTextObject(range);
    // return textObject.getTextContent() || '';
  }

  /**
   * Set the placeholder on all editors
   * @param {string} placeholder - placeholder to set
   */
  setPlaceholder(placeholder: string) {
    this.mdEditor.setPlaceholder(placeholder);
    this.wwEditor.setPlaceholder(placeholder);
  }

  /**
   * Set code block languages
   * @param {Array} languages - code language list
   */
  setCodeBlockLanguages(languages: string[] = []) {
    languages.forEach(lang => {
      if (this.codeBlockLanguages.indexOf(lang) < 0) {
        this.codeBlockLanguages.push(lang);
      }
    });
    this.eventEmitter.emit('setCodeBlockLanguages', this.codeBlockLanguages);
  }
}

// @TODO: remove below API
// // (Not an official API)
// // Create a function converting markdown to HTML using the internal parser and renderer.
// ToastUIEditor._createMarkdownToHTML = createMarkdownToHTML;

// /**
//  * Check whether is viewer (using in plugins)
//  * @type {boolean}
//  */
// ToastUIEditor.isViewer = false;

export default ToastUIEditor;
