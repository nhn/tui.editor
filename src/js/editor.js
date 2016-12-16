/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import MarkdownEditor from './markdownEditor';
import Preview from './preview';
import WysiwygEditor from './wysiwygEditor';
import Layout from './layout';
import EventManager from './eventManager';
import CommandManager from './commandManager';
import extManager from './extManager';
import ImportManager from './importManager';
import codeBlockManager from './codeBlockManager';
import Convertor from './convertor';
import ViewOnly from './viewOnly';
import DefaultUI from './ui/defaultUI';
import i18n from './i18n';

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
import wwIncreaseDepth from './wysiwygCommands/increaseDepth';
import wwDecreaseDepth from './wysiwygCommands/decreaseDepth';
import wwTask from './wysiwygCommands/task';
import wwCode from './wysiwygCommands/code';
import wwCodeBlock from './wysiwygCommands/codeBlock';

const util = tui.util;

const __nedInstance = [];

/**
 * ToastUI Editor
 * @exports ToastUIEditor
 * @constructor
 * @class ToastUIEditor
 * @param {object} options Option object
     * @param {number} options.height Editor's height (px)
     * @param {string} options.initialValue Editor's initial value
     * @param {string} options.previewStyle Markdown editor's preview style (tab, vertical)
     * @param {string} options.initialEditType Initial editor type (markdown, wysiwyg)
     * @param {object} options.events eventlist Event list
         * @param {function} options.events.load It would be emitted when editor fully load
         * @param {function} options.events.change It would be emitted when content changed
         * @param {function} options.events.stateChange It would be emitted when format change by cursor position
         * @param {function} options.events.focus It would be emitted when editor get focus
         * @param {function} options.events.blur It would be emitted when editor loose focus
     * @param {object} options.hooks Hook list
         * @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
         * @param {function} options.hooks.addImageBlobHook hook for image upload.
    * @param {string} language language
    * @param {boolean} useDefaultHTMLSanitizer use default htmlSanitizer
 */
class ToastUIEditor {
    constructor(options) {
        const self = this;

        this.options = $.extend({
            'previewStyle': 'tab',
            'initialEditType': 'markdown',
            'height': 300,
            'language': 'en_US',
            'useDefaultHTMLSanitizer': true
        }, options);

        this.eventManager = new EventManager();

        this.importManager = new ImportManager(this.eventManager);

        this.commandManager = new CommandManager(this);

        this.codeBlockManager = codeBlockManager;

        this.convertor = new Convertor(this.eventManager);

        if (this.options.useDefaultHTMLSanitizer) {
            this.convertor.initHtmlSanitizer();
        }

        if (this.options.hooks) {
            util.forEach(this.options.hooks, (fn, key) => {
                self.addHook(key, fn);
            });
        }

        if (this.options.events) {
            util.forEach(this.options.events, (fn, key) => {
                self.on(key, fn);
            });
        }

        this.layout = new Layout(options, this.eventManager);

        this.i18n = i18n;
        this.i18n.setCode(this.options.language);

        this.setUI(this.options.UI || new DefaultUI(this));

        this.mdEditor = MarkdownEditor.factory(this.layout.getMdEditorContainerEl(), this.eventManager);
        this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager, this.convertor);
        this.wwEditor = WysiwygEditor.factory(this.layout.getWwEditorContainerEl(), this.eventManager);

        this.changePreviewStyle(this.options.previewStyle);

        this.changeMode(self.options.initialEditType, true);

        this.contentHeight(self.options.height);

        this.setValue(self.options.initialValue);

        extManager.applyExtension(self, self.options.exts);

        this.eventManager.emit('load', self);

        __nedInstance.push(this);
    }

    /**
     * 프리뷰가 보여지는 방식을 변경한다
     * @api
     * @memberOf ToastUIEditor
     * @param {string} style 스타일 이름 tab, vertical
     */
    changePreviewStyle(style) {
        this.layout.changePreviewStyle(style);
        this.mdPreviewStyle = style;
        this.eventManager.emit('changePreviewStyle', style);
        this.eventManager.emit('previewNeedsRefresh');
    }

    /**
     * call commandManager's exec method
     * @api
     * @memberOf ToastUIEditor
     */
    exec(...args) {
        this.commandManager.exec(...args);
    }

    addCommand(type, props) {
        if (!props) {
            this.commandManager.addCommand(type);
        } else {
            this.commandManager.addCommand(CommandManager.command(type, props));
        }
    }

    /**
     * Bind eventHandler to event type
     * @api
     * @memberOf ToastUIEditor
     * @param {string} type Event type
     * @param {function} handler Event handler
     */
    on(type, handler) {
        this.eventManager.listen(type, handler);
    }

    /**
     * Unbind eventHandler from event type
     * @api
     * @memberOf ToastUIEditor
     * @param {string} type Event type
     */
    off(type) {
        this.eventManager.removeEventHandler(type);
    }

    /**
     * Add hook to TUIEditor event
     * @api
     * @memberOf ToastUIEditor
     * @param {string} type Event type
     * @param {function} handler Event handler
     */
    addHook(type, handler) {
        this.eventManager.removeEventHandler(type);
        this.eventManager.listen(type, handler);
    }

    /**
     * Remove hook from TUIEditor event
     * @api
     * @memberOf ToastUIEditor
     * @param {string} type Event type
     */
    removeHook(type) {
        this.eventManager.removeEventHandler(type);
    }

    /**
     * Get CodeMirror instance
     * @api
     * @memberOf ToastUIEditor
     * @returns {CodeMirror}
     */
    getCodeMirror() {
        return this.mdEditor.getEditor();
    }

    /**
     * Get SquireExt instance
     * @api
     * @memberOf ToastUIEditor
     * @returns {SquireExt}
     */
    getSquire() {
        return this.wwEditor.getEditor();
    }

    /**
     * Set focus to current Editor
     * @api
     * @memberOf ToastUIEditor
     */
    focus() {
        this.getCurrentModeEditor().focus();
    }

    /**
     * Remove focus of current Editor
     * @api
     * @memberOf ToastUIEditor
     */
    blur() {
        this.getCurrentModeEditor().blur();
    }

    /**
     * Set cursor position to end
     * @api
     * @memberOf ToastUIEditor
     */
    moveCursorToEnd() {
        this.getCurrentModeEditor().moveCursorToEnd();
    }

    /**
     * Set cursor position to start
     * @api
     * @memberOf ToastUIEditor
     */
    moveCursorToStart() {
        this.getCurrentModeEditor().moveCursorToStart();
    }

    /**
     * Set markdown syntax text.
     * @api
     * @memberOf ToastUIEditor
     * @param {string} markdown - markdown syntax text.
     */
    setMarkdown(markdown) {
        markdown = markdown || '';

        if (this.isMarkdownMode()) {
            this.mdEditor.setValue(markdown);
        } else {
            this.wwEditor.setValue(this.convertor.toHTML(markdown));
        }

        this.eventManager.emit('setMarkdownAfter', markdown);
    }

    /**
     * Set html value.
     * @api
     * @memberOf ToastUIEditor
     * @param {string} html - html syntax text
     */
    setHtml(html) {
        html = html || '';
        this.wwEditor.setValue(html);

        if (this.isMarkdownMode()) {
            this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue()));
        }
    }

    /**
     * Set markdown syntax text.
     * @api
     * @memberOf ToastUIEditor
     * @param {string} value - markdown syntax text
     * @deprecated
     */
    setValue(value) {
        this.setMarkdown(value);
    }

    /**
     * Get markdown syntax text.
     * @api
     * @memberOf ToastUIEditor
     * @returns {string}
     */
    getMarkdown() {
        let markdown;

        if (this.isMarkdownMode()) {
            markdown = this.mdEditor.getValue();
        } else {
            markdown = this.convertor.toMarkdown(this.wwEditor.getValue());
        }

        return markdown;
    }

    /**
     * Get html syntax text.
     * @api
     * @memberOf ToastUIEditor
     * @returns {string}
     */
    getHtml() {
        if (this.isWysiwygMode()) {
            this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue()));
        }

        return this.convertor.toHTML(this.mdEditor.getValue());
    }

    /**
     * Get editor value.
     * @api
     * @memberOf ToastUIEditor
     * @returns {string}
     * @deprecated
     */
    getValue() {
        return this.getMarkdown();
    }

    /**
     * Add widget to selection
     * @api
     * @memberOf ToastUIEditor
     * @param {Range} selection Current selection
     * @param {Node} node widget node
     * @param {string} style Adding style "over" or "bottom"
     * @param {number} [offset] Offset for adjust position
     */
    addWidget(selection, node, style, offset) {
        this.getCurrentModeEditor().addWidget(selection, node, style, offset);
    }

    /**
     * Set and return content area height
     * @api
     * @memberOf ToastUIEditor
     * @param {number} height Content area height
     * @returns {number}
     */
    contentHeight(height) {
        if (height) {
            this._contentHeight = height;
            this.mdEditor.setHeight(height);
            this.preview.setHeight(height);
            this.wwEditor.setHeight(height);
        }

        return this._contentHeight;
    }

    /**
     * Get current editor mode name
     * @api
     * @memberOf ToastUIEditor
     * @returns {string}
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
     * @api
     * @memberOf ToastUIEditor
     * @returns {boolean}
     */
    isMarkdownMode() {
        return this.currentMode === 'markdown';
    }

    /**
     * Return true if current editor mode is WYSIWYG
     * @api
     * @memberOf ToastUIEditor
     * @returns {boolean}
     */
    isWysiwygMode() {
        return this.currentMode === 'wysiwyg';
    }

    /**
     * Return false
     * @api
     * @memberOf ToastUIEditor
     * @returns {boolean}
     */
    isViewOnly() {
        return false;
    }

    /**
     * Get current Markdown editor's preview style
     * @api
     * @memberOf ToastUIEditor
     * @returns {string}
     */
    getCurrentPreviewStyle() {
        return this.mdPreviewStyle;
    }

    /**
     * Change editor's mode to given mode string
     * @api
     * @memberOf ToastUIEditor
     * @param {string} mode Editor mode name of want to change
     * @param {boolean} isWithoutFocus Change mode without focus
     */
    changeMode(mode, isWithoutFocus) {
        if (this.currentMode === mode) {
            return;
        }

        this.eventManager.emit('changeModeBefore', this.currentMode);

        this.currentMode = mode;

        if (this.isWysiwygMode()) {
            this.layout.switchToWYSIWYG();
            this.wwEditor.setValue(this.convertor.toHTML(this.mdEditor.getValue()));
            this.eventManager.emit('changeModeToWysiwyg');
        } else {
            this.layout.switchToMarkdown();
            this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue()));
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
     * @api
     * @memberOf ToastUIEditor
     */
    remove() {
        const self = this;
        let i = __nedInstance.length - 1;
        this.wwEditor.remove();
        this.mdEditor.remove();
        this.layout.remove();

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
     * @api
     * @memberOf ToastUIEditor
     */
    hide() {
        this.eventManager.emit('hide', this);
    }

    /**
     * Show TUIEditor
     * @api
     * @memberOf ToastUIEditor
     */
    show() {
        this.eventManager.emit('show', this);
        this.getCodeMirror().refresh();
    }

    /**
     * Scroll Editor content to Top
     * @api
     * @memberOf ToastUIEditor
     * @param {number} value Scroll amount
     * @returns {number}
     */
    scrollTop(value) {
        return this.getCurrentModeEditor().scrollTop(value);
    }

    /**
     * Set UI to private UI property
     * @api
     * @memberOf ToastUIEditor
     * @param {UI} UI UI instance
     */
    setUI(UI) {
        this._ui = UI;
    }

    /**
     * Get _ui property
     * @api
     * @memberOf ToastUIEditor
     * @returns {UI}
     */
    getUI() {
        return this._ui;
    }

    /**
     * Reset TUIEditor
     * @api
     * @memberOf ToastUIEditor
     */
    reset() {
        this.wwEditor.reset();
        this.mdEditor.reset();
    }

    /**
     * Get current range
     * @api
     * @memberOf ToastUIEditor
     * @returns {{start, end}|Range}
     */
    getRange() {
        return this.getCurrentModeEditor().getRange();
    }

    /**
     * Get text object of current range
     * @api
     * @memberOf ToastUIEditor
     * @param {{start, end}|Range} range Range object of each editor
     * @returns {object} TextObject class
     */
    getTextObject(range) {
        return this.getCurrentModeEditor().getTextObject(range);
    }

    /**
     * Get instance of TUIEditor
     * @api
     * @memberOf ToastUIEditor
     * @returns {Array}
     */
    static getInstances() {
        return __nedInstance;
    }

    /**
     * Define extension
     * @api
     * @memberOf ToastUIEditor
     * @param {string} name Extension name
     * @param {ExtManager~extension} ext extension
     */
    static defineExtension(name, ext) {
        extManager.defineExtension(name, ext);
    }

    /**
     * Factory method for Editor
     * @api
     * @memberOf ToastUIEditor
     * @param {object} options Option for initialize TUIEditor
     * @returns {ToastUIEditor}
     */
    static factory(options) {
        let tuiEditor;

        if (options.viewOnly) {
            tuiEditor = new ViewOnly(options);
        } else {
            tuiEditor = new ToastUIEditor(options);

            tuiEditor.addCommand(mdBold);
            tuiEditor.addCommand(mdItalic);
            tuiEditor.addCommand(mdBlockquote);
            tuiEditor.addCommand(mdHeading);
            tuiEditor.addCommand(mdParagraph);
            tuiEditor.addCommand(mdHR);
            tuiEditor.addCommand(mdAddLink);
            tuiEditor.addCommand(mdAddImage);
            tuiEditor.addCommand(mdUL);
            tuiEditor.addCommand(mdOL);
            tuiEditor.addCommand(mdTable);
            tuiEditor.addCommand(mdTask);
            tuiEditor.addCommand(mdCode);
            tuiEditor.addCommand(mdCodeBlock);
            tuiEditor.addCommand(mdStrike);

            tuiEditor.addCommand(wwBold);
            tuiEditor.addCommand(wwItalic);
            tuiEditor.addCommand(wwBlockquote);
            tuiEditor.addCommand(wwUL);
            tuiEditor.addCommand(wwOL);
            tuiEditor.addCommand(wwAddImage);
            tuiEditor.addCommand(wwAddLink);
            tuiEditor.addCommand(wwHR);
            tuiEditor.addCommand(wwHeading);
            tuiEditor.addCommand(wwParagraph);
            tuiEditor.addCommand(wwIncreaseDepth);
            tuiEditor.addCommand(wwDecreaseDepth);
            tuiEditor.addCommand(wwTask);
            tuiEditor.addCommand(wwTable);
            tuiEditor.addCommand(wwTableAddRow);
            tuiEditor.addCommand(wwTableAddCol);
            tuiEditor.addCommand(wwTableRemoveRow);
            tuiEditor.addCommand(wwTableRemoveCol);
            tuiEditor.addCommand(wwTableAlignCol);
            tuiEditor.addCommand(wwTableRemove);
            tuiEditor.addCommand(wwCode);
            tuiEditor.addCommand(wwCodeBlock);
            tuiEditor.addCommand(wwStrike);
        }

        return tuiEditor;
    }
}

/**
 * Export i18n instance
 * @type {I18n}
 */
ToastUIEditor.i18n = i18n;

/**
 * MarkdownIt custom renderer with code highlighting
 */
ToastUIEditor.markdownItRenderer = Convertor.getMarkdownHighlightRenderer();

module.exports = ToastUIEditor;
