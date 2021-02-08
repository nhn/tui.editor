/**
 * @fileoverview Implements Editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import extend from 'tui-code-snippet/object/extend';
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import isString from 'tui-code-snippet/type/isString';

import { Emitter, Handler } from '@t/event';
import { EditorOptions, EditorType, PreviewStyle, ViewerOptions, WidgetStyle } from '@t/editor';
import { EditorCommandFn } from '@t/spec';

import { sendHostName, sanitizeLinkAttribute } from './utils/common';

import MarkdownEditor from './markdown/mdEditor';
import MarkdownPreview from './markdown/mdPreview';

import WysiwygEditor from './wysiwyg/wwEditor';

import EventEmitter from './event/eventEmitter';
import CommandManager from './commands/commandManager';
import Convertor from './convertors/convertor';
import Viewer from './viewer';
import i18n, { I18n } from './i18n/i18n';
import { invokePlugins, getPluginInfo } from './pluginHelper';

// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { WwToDOMAdaptor } from './wysiwyg/adaptor/wwToDOMAdaptor';
import { ScrollSync } from './markdown/scroll/scrollSync';
import { addDefaultImageBlobHook } from './helper/image';

/**
 * ToastUI Editor
 * @param {Object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} [options.height='300px'] - Editor's height style value. Height is applied as border-box ex) '300px', '100%', 'auto'
 *     @param {string} [options.minHeight='200px'] - Editor's min-height style value in pixel ex) '300px'
 *     @param {string} [options.initialValue] - Editor's initial value
 *     @param {string} [options.previewStyle] - Markdown editor's preview style (tab, vertical)
 *     @param {boolean} [options.previewHighlight = true] - Highlight a preview element corresponds to the cursor position in the markdown editor
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
 *     @param {Object} [options.customConvertor] - convertor extension
 *     @param {string} [options.placeholder] - The placeholder text of the editable element.
 *     @param {Object} [options.linkAttributes] - Attributes of anchor element that should be rel, target, hreflang, type
 *     @param {Object} [options.customHTMLRenderer] - Object containing custom renderer functions correspond to markdown node
 *     @param {boolean} [options.referenceDefinition=false] - whether use the specification of link reference definition
 *     @param {function} [options.customHTMLSanitizer=null] - custom HTML sanitizer
 *     @param {boolean} [options.frontMatter=false] - whether use the front matter
 */
class ToastUIEditor {
  private initialHtml: string;

  private codeBlockLanguages: string[];

  private toastMark: ToastMark;

  private mdEditor: MarkdownEditor;

  private wwEditor: WysiwygEditor;

  private preview: MarkdownPreview;

  private convertor: Convertor;

  private commandManager: CommandManager;

  private height!: string;

  private minHeight!: string;

  private mode!: EditorType;

  private mdPreviewStyle!: PreviewStyle;

  private i18n: I18n;

  private scrollSync: ScrollSync;

  protected eventEmitter: Emitter;

  protected options: Required<EditorOptions>;

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
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock'],
          ['scrollSync'],
        ],
        hideModeSwitch: false,
        linkAttributes: null,
        extendedAutolinks: false,
        customConvertor: null,
        customHTMLRenderer: null,
        customMarkdownRenderer: null,
        referenceDefinition: false,
        customHTMLSanitizer: null,
        frontMatter: false,
      },
      options
    );

    this.codeBlockLanguages = [];
    this.mode = this.options.initialEditType || 'markdown';

    this.eventEmitter = new EventEmitter();

    const linkAttributes = sanitizeLinkAttribute(this.options.linkAttributes);
    const { renderer, parser, plugins } = getPluginInfo(this.options.plugins);
    const {
      customHTMLRenderer,
      extendedAutolinks,
      referenceDefinition,
      frontMatter,
      customMarkdownRenderer,
    } = this.options;
    const rendererOptions = {
      linkAttributes,
      customHTMLRenderer: { ...renderer, ...customHTMLRenderer },
      extendedAutolinks,
      referenceDefinition,
      customParser: parser,
      frontMatter,
    };
    const wwToDOMAdaptor = new WwToDOMAdaptor(linkAttributes, rendererOptions.customHTMLRenderer);

    if (this.options.hooks) {
      forEachOwnProperties(this.options.hooks, (fn, key) => this.addHook(key, fn));
    }

    if (this.options.events) {
      forEachOwnProperties(this.options.events, (fn, key) => this.on(key, fn));
    }

    this.i18n = i18n;
    this.i18n.setCode(this.options.language);

    this.toastMark = new ToastMark('', {
      disallowedHtmlBlockTags: ['br', 'img'],
      extendedAutolinks,
      referenceDefinition,
      disallowDeepHeading: true,
      customParser: parser,
      frontMatter,
    });

    this.mdEditor = new MarkdownEditor(this.toastMark, this.eventEmitter);

    this.preview = new MarkdownPreview(this.eventEmitter, {
      ...rendererOptions,
      isViewer: false,
      highlight: this.options.previewHighlight,
    });

    this.wwEditor = new WysiwygEditor(this.eventEmitter, wwToDOMAdaptor, linkAttributes!);

    this.convertor = new Convertor(this.wwEditor.getSchema(), customMarkdownRenderer);

    if (plugins) {
      invokePlugins(plugins, this);
    }

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

    this.getCurrentModeEditor().focus();
    this.scrollSync = new ScrollSync(this.mdEditor, this.preview, this.eventEmitter);
    this.addInitEvent();
  }

  private addInitEvent() {
    this.on('changeModeByEvent', this.changeMode.bind(this));
    this.addCommand('markdown', 'toggleScrollSync', (payload) => {
      this.eventEmitter.emit('toggleScrollSync', payload!.active);
    });
    addDefaultImageBlobHook(this.eventEmitter);
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
    if (this.mdPreviewStyle !== style) {
      this.mdPreviewStyle = style;
      this.eventEmitter.emit('changePreviewStyle', style);
    }
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
   * Add hook to TUIEditor event
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  addHook(type: string, handler: Handler) {
    this.eventEmitter.removeEventHandler(type);
    this.eventEmitter.listen(type, handler);
  }

  /**
   * Remove hook from TUIEditor event
   * @param {string} type Event type
   */
  removeHook(type: string) {
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

      this.wwEditor.setModel(wwNode!, cursorToEnd);
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
   * Get content to markdown
   * @returns {string} markdown text
   */
  getMarkdown() {
    if (this.isMarkdownMode()) {
      return this.mdEditor.getMarkdown();
    }

    return this.convertor.toMarkdownText(this.wwEditor.getModel());
  }

  /**
   * Get content to html
   * @returns {string} html string
   */
  getHTML() {
    if (this.isWysiwygMode()) {
      this.mdEditor.setMarkdown(this.convertor.toMarkdownText(this.wwEditor.getModel()));
    }

    const mdNode = this.toastMark.getRootNode();
    const mdRenderer = this.preview.getRenderer();

    return mdRenderer.render(mdNode);
  }

  /**
   * Insert text
   * @param {string} text - text string to insert
   */
  insertText(text: string) {
    this.getCurrentModeEditor().replaceSelection(text);
  }

  /**
   * Add widget to selection
   * @param {Node} node widget node
   * @param {string} style Adding style "top" or "bottom"
   * @param {number} [offset] Offset for adjust position
   */
  addWidget(node: Node, style: WidgetStyle, offset: number) {
    this.getCurrentModeEditor().addWidget(node, style, offset);
  }

  insertWidgetNode(node: HTMLElement) {
    this.getCurrentModeEditor().insertWidgetNode(node);
  }

  /**
   * Set editor height
   * @param {string} height - editor height in pixel
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

  /**
   * Get editor height
   * @returns {string} editor height in pixel
   */
  getHeight() {
    return this.height;
  }

  /**
   * Set minimum height to editor content
   * @param {string} minHeight - min content height in pixel
   */
  setMinHeight(minHeight: string) {
    this.minHeight = minHeight;

    const editorHeight = this.options.el.clientHeight;
    const editorSectionHeight = document.querySelector('.te-editor-section')?.clientHeight || 0;
    const diffHeight = editorHeight - editorSectionHeight;

    let minHeightNum = parseInt(minHeight, 10);

    minHeightNum = Math.max(minHeightNum - diffHeight, 0);

    this.wwEditor.setMinHeight(minHeightNum);
    this.mdEditor.setMinHeight(minHeightNum);
    this.preview.setMinHeight(minHeightNum);
  }

  /**
   * Get minimum height of editor content
   * @returns {string} min height in pixel
   */
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
    return this.mode === 'markdown';
  }

  /**
   * Return true if current editor mode is WYSIWYG
   * @returns {boolean}
   */
  isWysiwygMode() {
    return this.mode === 'wysiwyg';
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
    if (this.mode === mode) {
      return;
    }

    this.eventEmitter.emit('changeModeBefore', this.mode);

    this.mode = mode;

    if (this.isWysiwygMode()) {
      const mdNode = this.toastMark.getRootNode();
      const wwNode = this.convertor.toWysiwygModel(mdNode);

      this.wwEditor.setModel(wwNode!);

      this.eventEmitter.emit('changeModeToWysiwyg');
    } else {
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
    this.preview.destroy();
    this.scrollSync.destroy();
    this.eventEmitter.emit('removeEditor');
    this.eventEmitter.getEvents().forEach((_, type: string) => {
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
   * Move on scroll position of the editor container
   * @param {number} value scrollTop value of editor container
   */
  setScrollTop(value: number) {
    this.getCurrentModeEditor().setScrollTop(value);
  }

  /**
   * Get scroll position value of editor container
   * @returns {number} scrollTop value of editor container
   */
  getScrollTop() {
    return this.getCurrentModeEditor().getScrollTop();
  }

  /**
   * Reset TUIEditor
   */
  reset() {
    // @ts-ignore
    this.wwEditor.setModel([]);
    this.mdEditor.setMarkdown('');
  }

  /**
   * Get current range
   * @returns {Array.<string[]>|Array.<string>} Returns the range of the selection depending on the editor mode
   * @example
   * // Markdown mode
   * const mdRange = editor.getRange();
   *
   * console.log(mdRange); // [[startLineOffset, startCurorOffset], [endLineOffset, endCurorOffset]]
   *
   * // WYSIWYG mode
   * const wwRange = editor.getRange();
   *
   * console.log(mdRange); // [startCursorOffset, endCursorOffset]]
   */
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
    languages.forEach((lang) => {
      if (this.codeBlockLanguages.indexOf(lang) < 0) {
        this.codeBlockLanguages.push(lang);
      }
    });
    this.eventEmitter.emit('setCodeBlockLanguages', this.codeBlockLanguages);
  }

  /**
   * get markdown editor, preview, wysiwyg editor DOM elements
   */
  getEditorElements() {
    return {
      mdEditor: this.mdEditor.getElement(),
      mdPreview: this.preview.getElement(),
      wwEditor: this.wwEditor.getElement(),
    };
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
