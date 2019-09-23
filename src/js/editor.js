/**
 * @fileoverview Implements Editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import Button from './ui/button';
import MarkdownEditor from './markdownEditor';
import MarkdownPreview from './mdPreview';
import WysiwygEditor from './wysiwygEditor';
import Layout from './layout';
import EventManager from './eventManager';
import CommandManager from './commandManager';
import extManager from './extManager';
import ImportManager from './importManager';
import WwCodeBlockManager from './wwCodeBlockManager';
import Convertor from './convertor';
import Viewer from './viewer';
import i18n from './i18n';
import DefaultUI from './ui/defaultUI';
import domUtils from './domUtils';
import WwTableManager from './wwTableManager';
import WwTableSelectionManager from './wwTableSelectionManager';
import {CodeBlockManager} from './codeBlockManager';
import codeBlockManager from './codeBlockManager';
import toMarkRenderer from './toMarkRenderer';

// markdown commands
import mdBold from './markdownCommands/bold';
import mdItalic from './markdownCommands/italic';
import mdStrike from './markdownCommands/strike';
import mdBlockquote from './markdownCommands/blockquote';
import mdHeading from './markdownCommands/heading';
import mdParagraph from './markdownCommands/paragraph';
import mdHR from './markdownCommands/hr';
import mdAddLink from './markdownCommands/addLink';
import mdAddImage from './markdownCommands/addImage';
import mdUL from './markdownCommands/ul';
import mdOL from './markdownCommands/ol';
import mdIndent from './markdownCommands/indent';
import mdOutdent from './markdownCommands/outdent';
import mdTable from './markdownCommands/table';
import mdTask from './markdownCommands/task';
import mdCode from './markdownCommands/code';
import mdCodeBlock from './markdownCommands/codeBlock';

// wysiwyg Commands
import wwBold from './wysiwygCommands/bold';
import wwItalic from './wysiwygCommands/italic';
import wwStrike from './wysiwygCommands/strike';
import wwBlockquote from './wysiwygCommands/blockquote';
import wwAddImage from './wysiwygCommands/addImage';
import wwAddLink from './wysiwygCommands/addLink';
import wwHR from './wysiwygCommands/hr';
import wwHeading from './wysiwygCommands/heading';
import wwParagraph from './wysiwygCommands/paragraph';
import wwUL from './wysiwygCommands/ul';
import wwOL from './wysiwygCommands/ol';
import wwTable from './wysiwygCommands/table';
import wwTableAddRow from './wysiwygCommands/tableAddRow';
import wwTableAddCol from './wysiwygCommands/tableAddCol';
import wwTableRemoveRow from './wysiwygCommands/tableRemoveRow';
import wwTableRemoveCol from './wysiwygCommands/tableRemoveCol';
import wwTableAlignCol from './wysiwygCommands/tableAlignCol';
import wwTableRemove from './wysiwygCommands/tableRemove';
import wwIndent from './wysiwygCommands/indent';
import wwOutdent from './wysiwygCommands/outdent';
import wwTask from './wysiwygCommands/task';
import wwCode from './wysiwygCommands/code';
import wwCodeBlock from './wysiwygCommands/codeBlock';

// langs
import './langs/en_US';
import './langs/ko_KR';
import './langs/zh_CN';
import './langs/ja_JP';
import './langs/nl_NL';
import './langs/es_ES';
import './langs/de_DE';
import './langs/ru_RU';
import './langs/fr_FR';
import './langs/uk_UA';
import './langs/tr_TR';
import './langs/fi_FI';
import './langs/cs_CZ';
import './langs/ar_AR';
import './langs/pl_PL';
import './langs/zh_TW';
import './langs/gl_ES';
import './langs/sv_SE';
import './langs/it_IT';

const __nedInstance = [];
const gaTrackingId = 'UA-129966929-1';

const availableLinkAttributes = ['rel', 'target', 'contenteditable', 'hreflang', 'type'];

/**
 * @callback addImageBlobHook
 * @param {File|Blob} fileOrBlob - image blob
 * @param {callback} callback - callback function to be called after
 * @param {string} source - source of an event the item belongs to. 'paste', 'drop', 'ui'
 */

/**
 * ToastUI Editor
 * @param {object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} [options.height='300px'] - Editor's height style value. Height is applied as border-box ex) '300px', '100%', 'auto'
 *     @param {string} [options.minHeight='200px'] - Editor's min-height style value in pixel ex) '300px'
 *     @param {string} [options.initialValue] - Editor's initial value
 *     @param {string} [options.previewStyle] - Markdown editor's preview style (tab, vertical)
 *     @param {string} [options.initialEditType] - Initial editor type (markdown, wysiwyg)
 *     @param {object[]} [options.events] - eventlist Event list
 *         @param {function} options.events.load - It would be emitted when editor fully load
 *         @param {function} options.events.change - It would be emitted when content changed
 *         @param {function} options.events.stateChange - It would be emitted when format change by cursor position
 *         @param {function} options.events.focus - It would be emitted when editor get focus
 *         @param {function} options.events.blur - It would be emitted when editor loose focus
 *     @param {object[]} [options.hooks] - Hook list
 *         @param {function} options.hooks.previewBeforeHook - Submit preview to hook URL before preview be shown
 *         @param {addImageBlobHook} options.hooks.addImageBlobHook - hook for image upload.
 *     @param {string} [options.language='en_US'] - language
 *     @param {boolean} [options.useCommandShortcut=true] - whether use keyboard shortcuts to perform commands
 *     @param {boolean} [options.useDefaultHTMLSanitizer=true] - use default htmlSanitizer
 *     @param {string[]} [options.codeBlockLanguages] - supported code block languages to be listed. default is what highlight.js supports
 *     @param {boolean} [options.usageStatistics=true] - send hostname to google analytics
 *     @param {string[]} [options.toolbarItems] - toolbar items.
 *     @param {boolean} [options.hideModeSwitch=false] - hide mode switch tab bar
 *     @param {string[]} [options.exts] - extensions
 *     @param {object} [options.customConvertor] - convertor extention
 *     @param {string} [options.placeholder] - The placeholder text of the editable element.
 *     @param {string} [options.previewDelayTime] - the delay time for rendering preview
 *     @param {object} [options.linkAttribute] - Attributes of anchor element that shold be rel, target, contenteditable, hreflang, type
 */
class ToastUIEditor {
  constructor(options) {
    this.initialHtml = options.el.innerHTML;
    options.el.innerHTML = '';

    this.options = $.extend({
      previewStyle: 'tab',
      initialEditType: 'markdown',
      height: '300px',
      minHeight: '200px',
      language: 'en_US',
      useDefaultHTMLSanitizer: true,
      useCommandShortcut: true,
      codeBlockLanguages: CodeBlockManager.getHighlightJSLanguages(),
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
      customConvertor: null
    }, options);

    this.eventManager = new EventManager();

    this.importManager = new ImportManager(this.eventManager);

    this.commandManager = new CommandManager(this, {
      useCommandShortcut: this.options.useCommandShortcut
    });

    if (this.options.customConvertor) {
      // eslint-disable-next-line new-cap
      this.convertor = new this.options.customConvertor(this.eventManager);
    } else {
      this.convertor = new Convertor(this.eventManager);
    }

    if (this.options.useDefaultHTMLSanitizer) {
      this.convertor.initHtmlSanitizer();
    }

    if (this.options.hooks) {
      util.forEach(this.options.hooks, (fn, key) => this.addHook(key, fn));
    }

    if (this.options.events) {
      util.forEach(this.options.events, (fn, key) => this.on(key, fn));
    }

    this.layout = new Layout(options, this.eventManager);

    this.i18n = i18n;
    this.i18n.setCode(this.options.language);

    this.setUI(this.options.UI || new DefaultUI(this));

    this.mdEditor = MarkdownEditor.factory(this.layout.getMdEditorContainerEl(), this.eventManager, this.options);
    this.preview = new MarkdownPreview(
      this.layout.getPreviewEl(),
      this.eventManager,
      this.convertor,
      false,
      this.options.previewDelayTime);
    this.wwEditor = WysiwygEditor.factory(this.layout.getWwEditorContainerEl(), this.eventManager);
    this.toMarkOptions = {
      gfm: true,
      renderer: toMarkRenderer
    };

    if (this.options.linkAttribute) {
      const attribute = this._sanitizeLinkAttribute(this.options.linkAttribute);

      this.convertor.setLinkAttribute(attribute);
      this.wwEditor.setLinkAttribute(attribute);
    }

    this.changePreviewStyle(this.options.previewStyle);

    this.changeMode(this.options.initialEditType, true);

    this.minHeight(this.options.minHeight);

    this.height(this.options.height);

    this.setValue(this.options.initialValue, false);

    if (this.options.placeholder) {
      this.setPlaceholder(this.options.placeholder);
    }

    if (!this.options.initialValue) {
      this.setHtml(this.initialHtml, false);
    }

    extManager.applyExtension(this, this.options.exts);

    this.eventManager.emit('load', this);

    __nedInstance.push(this);

    this._addDefaultCommands();

    if (this.options.usageStatistics) {
      util.sendHostname('editor', gaTrackingId);
    }
  }

  /**
   * sanitize attribute for link
   * @param {object} attribute - attribute for link
   * @returns {object} sanitized attribute
   * @private
   */
  _sanitizeLinkAttribute(attribute) {
    const linkAttribute = {};

    availableLinkAttributes.forEach(key => {
      if (!util.isUndefined(attribute[key])) {
        linkAttribute[key] = attribute[key];
      }
    });

    return linkAttribute;
  }

  /**
   * change preview style
   * @param {string} style - 'tab'|'vertical'
   */
  changePreviewStyle(style) {
    this.layout.changePreviewStyle(style);
    this.mdPreviewStyle = style;
    this.eventManager.emit('changePreviewStyle', style);
    this.eventManager.emit('previewNeedsRefresh');
  }

  /**
   * call commandManager's exec method
   * @param {*} ...args Command argument
   */
  exec(...args) {
    this.commandManager.exec(...args);
  }

  /**
   * add default commands
   * @private
   */
  _addDefaultCommands() {
    this.addCommand(mdBold);
    this.addCommand(mdItalic);
    this.addCommand(mdBlockquote);
    this.addCommand(mdHeading);
    this.addCommand(mdParagraph);
    this.addCommand(mdHR);
    this.addCommand(mdAddLink);
    this.addCommand(mdAddImage);
    this.addCommand(mdUL);
    this.addCommand(mdOL);
    this.addCommand(mdIndent);
    this.addCommand(mdOutdent);
    this.addCommand(mdTable);
    this.addCommand(mdTask);
    this.addCommand(mdCode);
    this.addCommand(mdCodeBlock);
    this.addCommand(mdStrike);

    this.addCommand(wwBold);
    this.addCommand(wwItalic);
    this.addCommand(wwBlockquote);
    this.addCommand(wwUL);
    this.addCommand(wwOL);
    this.addCommand(wwAddImage);
    this.addCommand(wwAddLink);
    this.addCommand(wwHR);
    this.addCommand(wwHeading);
    this.addCommand(wwParagraph);
    this.addCommand(wwIndent);
    this.addCommand(wwOutdent);
    this.addCommand(wwTask);
    this.addCommand(wwTable);
    this.addCommand(wwTableAddRow);
    this.addCommand(wwTableAddCol);
    this.addCommand(wwTableRemoveRow);
    this.addCommand(wwTableRemoveCol);
    this.addCommand(wwTableAlignCol);
    this.addCommand(wwTableRemove);
    this.addCommand(wwCode);
    this.addCommand(wwCodeBlock);
    this.addCommand(wwStrike);
  }

  addCommand(type, props) {
    if (!props) {
      this.commandManager.addCommand(type);
    } else {
      this.commandManager.addCommand(CommandManager.command(type, props));
    }
  }

  /**
   * After added command.
   */
  afterAddedCommand() {
    this.eventManager.emit('afterAddedCommand', this);
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
   * Add hook to TUIEditor event
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  addHook(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
  }

  /**
   * Remove hook from TUIEditor event
   * @param {string} type Event type
   */
  removeHook(type) {
    this.eventManager.removeEventHandler(type);
  }

  /**
   * Get CodeMirror instance
   * @returns {CodeMirror}
   */
  getCodeMirror() {
    return this.mdEditor.getEditor();
  }

  /**
   * Get SquireExt instance
   * @returns {SquireExt}
   */
  getSquire() {
    return this.wwEditor.getEditor();
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
  setMarkdown(markdown, cursorToEnd = true) {
    markdown = markdown || '';

    if (this.isMarkdownMode()) {
      this.mdEditor.setValue(markdown, cursorToEnd);
    } else {
      this.wwEditor.setValue(this.convertor.toHTML(markdown), cursorToEnd);
    }

    this.eventManager.emit('setMarkdownAfter', markdown);
  }

  /**
   * Set html value.
   * @param {string} html - html syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  setHtml(html, cursorToEnd = true) {
    html = html || '';
    this.wwEditor.setValue(html, cursorToEnd);

    if (this.isMarkdownMode()) {
      const markdown = this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions);
      this.mdEditor.setValue(markdown, cursorToEnd);
      this.eventManager.emit('setMarkdownAfter', markdown);
    }
  }

  /**
   * Set markdown syntax text.
   * @param {string} value - markdown syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   * @deprecated
   */
  setValue(value, cursorToEnd = true) {
    this.setMarkdown(value, cursorToEnd);
  }

  /**
   * Get markdown syntax text.
   * @returns {string}
   */
  getMarkdown() {
    let markdown;

    if (this.isMarkdownMode()) {
      markdown = this.mdEditor.getValue();
    } else {
      markdown = this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions);
    }

    return markdown;
  }

  /**
   * Get html syntax text.
   * @returns {string}
   */
  getHtml() {
    if (this.isWysiwygMode()) {
      this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions));
    }

    return this.convertor.toHTML(this.mdEditor.getValue());
  }

  /**
   * Get editor value.
   * @returns {string}
   * @deprecated
   */
  getValue() {
    return this.getMarkdown();
  }

  /**
   * Insert text
   * @param {string} text - text string to insert
   */
  insertText(text) {
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
  addWidget(selection, node, style, offset) {
    this.getCurrentModeEditor().addWidget(selection, node, style, offset);
  }

  /**
   * Set and return edithr height
   * @param {string} height - editor height
   * @returns {string} editor height
   */
  height(height) {
    if (util.isExisty(height)) {
      if (height === 'auto') {
        $(this.options.el).addClass('auto-height');
        this.minHeight(this.minHeight());
      } else {
        $(this.options.el).removeClass('auto-height');
        this.minHeight(height);
      }
      if (util.isNumber(height)) {
        height = `${height}px`;
      }

      this.options.el.style.height = height;
      this._height = height;
    }

    return this._height;
  }

  /**
   * Set / Get min content height
   * @param {string} minHeight - min content height in pixel
   * @returns {string} - min height in pixel
   */
  minHeight(minHeight) {
    if (util.isExisty(minHeight)) {
      const editorHeight = this._ui.getEditorHeight();
      const editorSectionHeight = this._ui.getEditorSectionHeight();
      const diffHeight = editorHeight - editorSectionHeight;
      this._minHeight = minHeight;

      minHeight = parseInt(minHeight, 10);
      minHeight = Math.max(minHeight - diffHeight, 0);

      this.wwEditor.setMinHeight(minHeight);
      this.mdEditor.setMinHeight(minHeight);
      this.preview.setMinHeight(minHeight);
    }

    return this._minHeight;
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
  changeMode(mode, isWithoutFocus) {
    if (this.currentMode === mode) {
      return;
    }

    this.eventManager.emit('changeModeBefore', this.currentMode);

    this.currentMode = mode;

    if (this.isWysiwygMode()) {
      this.layout.switchToWYSIWYG();
      this.wwEditor.setValue(this.convertor.toHTML(this.mdEditor.getValue()), !isWithoutFocus);
      this.eventManager.emit('changeModeToWysiwyg');
    } else {
      this.layout.switchToMarkdown();
      this.mdEditor.resetState();
      this.mdEditor.setValue(
        this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions), !isWithoutFocus
      );
      this.getCodeMirror().refresh();
      this.eventManager.emit('changeModeToMarkdown');
    }

    this.eventManager.emit('changeMode', mode);

    if (!isWithoutFocus) {
      this.focus();
    }
  }

  /**
   * Remove TUIEditor from document
   */
  remove() {
    const self = this;
    let i = __nedInstance.length - 1;
    this.wwEditor.remove();
    this.mdEditor.remove();
    this.layout.remove();
    this.preview.remove();

    if (this.getUI()) {
      this.getUI().remove();
    }

    this.eventManager.emit('removeEditor');
    this.eventManager.events.forEach((value, key) => {
      self.off(key);
    });
    this.eventManager = null;

    for (; i >= 0; i -= 1) {
      if (__nedInstance[i] === this) {
        __nedInstance.splice(i, 1);
      }
    }
  }

  /**
   * Hide TUIEditor
   */
  hide() {
    this.eventManager.emit('hide', this);
  }

  /**
   * Show TUIEditor
   */
  show() {
    this.eventManager.emit('show', this);
    this.getCodeMirror().refresh();
  }

  /**
   * Scroll Editor content to Top
   * @param {number} value Scroll amount
   * @returns {number}
   */
  scrollTop(value) {
    return this.getCurrentModeEditor().scrollTop(value);
  }

  /**
   * Set UI to private UI property
   * @param {UI} UI UI instance
   */
  setUI(UI) {
    this._ui = UI;
  }

  /**
   * Get _ui property
   * @returns {DefaultUI|UI}
   */
  getUI() {
    return this._ui;
  }

  /**
   * Reset TUIEditor
   */
  reset() {
    this.wwEditor.reset();
    this.mdEditor.reset();
  }

  /**
   * Get current range
   * @returns {{start, end}|Range}
   */
  getRange() {
    return this.getCurrentModeEditor().getRange();
  }

  /**
   * Get text object of current range
   * @param {{start, end}|Range} range Range object of each editor
   * @returns {MdTextObject|WwTextObject} TextObject class
   */
  getTextObject(range) {
    return this.getCurrentModeEditor().getTextObject(range);
  }

  /**
   * get selected text
   * @returns {string} - selected text
   */
  getSelectedText() {
    const range = this.getRange();
    const textObject = this.getTextObject(range);

    return textObject.getTextContent() || '';
  }

  /**
   * Set the placeholder on all editors
   * @param {string} placeholder - placeholder to set
   */
  setPlaceholder(placeholder) {
    this.mdEditor.setPlaceholder(placeholder);
    this.wwEditor.setPlaceholder(placeholder);
  }

  /**
   * Get instance of TUIEditor
   * @returns {Array}
   */
  static getInstances() {
    return __nedInstance;
  }

  /**
   * Define extension
   * @param {string} name Extension name
   * @param {function} ext extension
   */
  static defineExtension(name, ext) {
    extManager.defineExtension(name, ext);
  }

  /**
   * Factory method for Editor
   * @param {object} options Option for initialize TUIEditor
   * @returns {object} ToastUIEditor or ToastUIEditorViewer
   */
  static factory(options) {
    let tuiEditor;

    if (options.viewer) {
      tuiEditor = new Viewer(options);
    } else {
      tuiEditor = new ToastUIEditor(options);
    }

    return tuiEditor;
  }
}

/**
 * check whther is viewer
 * @type {boolean}
 */
ToastUIEditor.isViewer = false;

/**
 * I18n instance
 * @type {I18n}
 */
ToastUIEditor.i18n = i18n;

/**
 * domUtil instance
 * @type {DomUtil}
 * @ignore
 */
ToastUIEditor.domUtils = domUtils;

/**
 * CodeBlockManager instance
 * @type {CodeBlockManager}
 */
ToastUIEditor.codeBlockManager = codeBlockManager;

/**
 * Button class
 * @type {Class.<Button>}
 * @deprecated
 */
ToastUIEditor.Button = Button;

/**
 * WwCodeBlockManager class
 * @type {Class.<WwCodeBlockManager>}
 * @ignore
 */
ToastUIEditor.WwCodeBlockManager = WwCodeBlockManager;

/**
 * WwTableManager class
 * @type {Class.<WwTableManager>}
 * @ignore
 */
ToastUIEditor.WwTableManager = WwTableManager;

/**
 * WwTableManager class
 * @type {Class.<WwTableSelectionManager>}
 * @ignore
 */
ToastUIEditor.WwTableSelectionManager = WwTableSelectionManager;

/**
 * CommandManager class
 * @type {Class.<CommandManager>}
 * @ignore
 */
ToastUIEditor.CommandManager = CommandManager;

/**
 * MarkdownIt hightlight instance
 * @type {MarkdownIt}
 */
ToastUIEditor.markdownitHighlight = Convertor.getMarkdownitHighlightRenderer();

/**
 * MarkdownIt instance
 * @type {MarkdownIt}
 */
ToastUIEditor.markdownit = Convertor.getMarkdownitRenderer();

module.exports = ToastUIEditor;
