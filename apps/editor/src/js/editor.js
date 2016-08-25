/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var MarkdownEditor = require('./markdownEditor'),
    Preview = require('./preview'),
    WysiwygEditor = require('./wysiwygEditor'),
    Layout = require('./layout'),
    EventManager = require('./eventManager'),
    CommandManager = require('./commandManager'),
    extManager = require('./extManager'),
    ImportManager = require('./importManager'),
    Convertor = require('./convertor'),
    ViewOnly = require('./viewOnly'),
    markedRenderer = require('./markedCustomRenderer'),
    DefaultUI = require('./ui/defaultUI');

//markdown commands
var mdBold = require('./markdownCommands/bold'),
    mdItalic = require('./markdownCommands/italic'),
    mdStrike = require('./markdownCommands/strike'),
    mdBlockquote = require('./markdownCommands/blockquote'),
    mdHeading = require('./markdownCommands/heading'),
    mdHR = require('./markdownCommands/hr'),
    mdAddLink = require('./markdownCommands/addLink'),
    mdAddImage = require('./markdownCommands/addImage'),
    mdUL = require('./markdownCommands/ul'),
    mdOL = require('./markdownCommands/ol'),
    mdTable = require('./markdownCommands/table'),
    mdTask = require('./markdownCommands/task'),
    mdCode = require('./markdownCommands/code'),
    mdCodeBlock = require('./markdownCommands/codeBlock');

//wysiwyg Commands
var wwBold = require('./wysiwygCommands/bold'),
    wwItalic = require('./wysiwygCommands/italic'),
    wwStrike = require('./wysiwygCommands/strike'),
    wwBlockquote = require('./wysiwygCommands/blockquote'),
    wwAddImage = require('./wysiwygCommands/addImage'),
    wwAddLink = require('./wysiwygCommands/addLink'),
    wwHR = require('./wysiwygCommands/hr'),
    wwHeading = require('./wysiwygCommands/heading'),
    wwUL = require('./wysiwygCommands/ul'),
    wwOL = require('./wysiwygCommands/ol'),
    wwTable = require('./wysiwygCommands/table'),
    wwTableAddRow = require('./wysiwygCommands/tableAddRow'),
    wwTableAddCol = require('./wysiwygCommands/tableAddCol'),
    wwTableRemoveRow = require('./wysiwygCommands/tableRemoveRow'),
    wwTableRemoveCol = require('./wysiwygCommands/tableRemoveCol'),
    wwTableAlignCol = require('./wysiwygCommands/tableAlignCol'),
    wwTableRemove = require('./wysiwygCommands/tableRemove'),
    wwIncreaseDepth = require('./wysiwygCommands/increaseDepth'),
    wwDecreaseDepth = require('./wysiwygCommands/decreaseDepth'),
    wwTask = require('./wysiwygCommands/task'),
    wwCode = require('./wysiwygCommands/code'),
    wwCodeBlock = require('./wysiwygCommands/codeBlock');

var util = tui.util;

var __nedInstance = [];

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
 */
function ToastUIEditor(options) {
    var self = this;

    this.options = $.extend({
        'previewStyle': 'tab',
        'initialEditType': 'markdown',
        'height': 300
    }, options);

    this.eventManager = new EventManager();

    this.importManager = new ImportManager(this.eventManager);

    this.commandManager = new CommandManager(this);
    this.convertor = new Convertor(this.eventManager);

    if (this.options.hooks) {
        util.forEach(this.options.hooks, function(fn, key) {
            self.addHook(key, fn);
        });
    }

    if (this.options.events) {
        util.forEach(this.options.events, function(fn, key) {
            self.on(key, fn);
        });
    }

    this.layout = new Layout(options, this.eventManager);

    this.setUI(this.options.UI || new DefaultUI(this));

    this.mdEditor = new MarkdownEditor(this.layout.getMdEditorContainerEl(), this.eventManager);
    this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager, this.convertor);
    this.wwEditor = WysiwygEditor.factory(this.layout.getWwEditorContainerEl(), this.eventManager);

    this.changePreviewStyle(this.options.previewStyle);

    this.mdEditor.init();

    this.changeMode(self.options.initialEditType);

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
ToastUIEditor.prototype.changePreviewStyle = function(style) {
    this.layout.changePreviewStyle(style);
    this.mdPreviewStyle = style;
    this.eventManager.emit('changePreviewStyle', style);
    this.eventManager.emit('previewNeedsRefresh');
};

/**
 * call commandManager's exec method
 * @api
 * @memberOf ToastUIEditor
 */
ToastUIEditor.prototype.exec = function() {
    this.commandManager.exec.apply(this.commandManager, arguments);
};

ToastUIEditor.prototype.addCommand = function(type, props) {
    if (!props) {
        this.commandManager.addCommand(type);
    } else {
        this.commandManager.addCommand(CommandManager.command(type, props));
    }
};

/**
 * Bind eventHandler to event type
 * @api
 * @memberOf ToastUIEditor
 * @param {string} type Event type
 * @param {function} handler Event handler
 */
ToastUIEditor.prototype.on = function(type, handler) {
    this.eventManager.listen(type, handler);
};

/**
 * Unbind eventHandler from event type
 * @api
 * @memberOf ToastUIEditor
 * @param {string} type Event type
 */
ToastUIEditor.prototype.off = function(type) {
    this.eventManager.removeEventHandler(type);
};

/**
 * Add hook to TUIEditor event
 * @api
 * @memberOf ToastUIEditor
 * @param {string} type Event type
 * @param {function} handler Event handler
 */
ToastUIEditor.prototype.addHook = function(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
};

/**
 * Remove hook from TUIEditor event
 * @api
 * @memberOf ToastUIEditor
 * @param {string} type Event type
 */
ToastUIEditor.prototype.removeHook = function(type) {
    this.eventManager.removeEventHandler(type);
};

/**
 * Get CodeMirror instance
 * @api
 * @memberOf ToastUIEditor
 * @returns {CodeMirror}
 */
ToastUIEditor.prototype.getCodeMirror = function() {
    return this.mdEditor.getEditor();
};

/**
 * Get SquireExt instance
 * @api
 * @memberOf ToastUIEditor
 * @returns {SquireExt}
 */
ToastUIEditor.prototype.getSquire = function() {
    return this.wwEditor.getEditor();
};

/**
 * Set focus to current Editor
 * @api
 * @memberOf ToastUIEditor
 */
ToastUIEditor.prototype.focus = function() {
    this.getCurrentModeEditor().focus();
};

/**
 * Set cursor position to end
 * @api
 * @memberOf ToastUIEditor
 */
ToastUIEditor.prototype.moveCursorToEnd = function() {
    this.getCurrentModeEditor().moveCursorToEnd();
};

/**
 * Set cursor position to start
 * @api
 * @memberOf ToastUIEditor
 */
ToastUIEditor.prototype.moveCursorToStart = function() {
    this.getCurrentModeEditor().moveCursorToStart();
};

/**
 * Set Editor value
 * @api
 * @memberOf ToastUIEditor
 * @param {string} markdown Markdown syntax text
 */
ToastUIEditor.prototype.setValue = function(markdown) {
    markdown = markdown || '';

    if (this.isMarkdownMode()) {
        this.mdEditor.setValue(markdown);
    } else {
        this.wwEditor.setValue(this.convertor.toHTML(markdown));
    }

    this.eventManager.emit('setValueAfter', markdown);
};

/**
 * Get editor value
 * @api
 * @memberOf ToastUIEditor
 * @returns {string}
 */
ToastUIEditor.prototype.getValue = function() {
    var markdown;

    if (this.isMarkdownMode()) {
        markdown = this.mdEditor.getValue();
    } else {
        markdown = this.convertor.toMarkdown(this.wwEditor.getValue());
    }

    return markdown;
};

/**
 * Add widget to selection
 * @api
 * @memberOf ToastUIEditor
 * @param {Range} selection Current selection
 * @param {Node} node widget node
 * @param {string} style Adding style "over" or "bottom"
 * @param {number} [offset] Offset for adjust position
 */
ToastUIEditor.prototype.addWidget = function(selection, node, style, offset) {
    this.getCurrentModeEditor().addWidget(selection, node, style, offset);
};

/**
 * Set and return content area height
 * @api
 * @memberOf ToastUIEditor
 * @param {number} height Content area height
 * @returns {number}
 */
ToastUIEditor.prototype.contentHeight = function(height) {
    if (height) {
        this._contentHeight = height;
        this.mdEditor.setHeight(height);
        this.preview.setHeight(height);
        this.wwEditor.setHeight(height);
    }

    return this._contentHeight;
};

/**
 * Get current editor mode name
 * @api
 * @memberOf ToastUIEditor
 * @returns {string}
 */
ToastUIEditor.prototype.getCurrentModeEditor = function() {
    var editor;

    if (this.isMarkdownMode()) {
        editor = this.mdEditor;
    } else {
        editor = this.wwEditor;
    }

    return editor;
};

/**
 * Return true if current editor mode is Markdown
 * @api
 * @memberOf ToastUIEditor
 * @returns {boolean}
 */
ToastUIEditor.prototype.isMarkdownMode = function() {
    return this.currentMode === 'markdown';
};

/**
 * Return true if current editor mode is WYSIWYG
 * @api
 * @memberOf ToastUIEditor
 * @returns {boolean}
 */
ToastUIEditor.prototype.isWysiwygMode = function() {
    return this.currentMode === 'wysiwyg';
};

/**
 * Return false
 * @api
 * @memberOf ToastUIEditor
 * @returns {boolean}
 */
ToastUIEditor.prototype.isViewOnly = function() {
    return false;
};

/**
 * Get current Markdown editor's preview style
 * @api
 * @memberOf ToastUIEditor
 * @returns {string}
 */
ToastUIEditor.prototype.getCurrentPreviewStyle = function() {
    return this.mdPreviewStyle;
};

/**
 * Change editor's mode to given mode string
 * @api
 * @memberOf ToastUIEditor
 * @param {string} mode Editor mode name of want to change
 */
ToastUIEditor.prototype.changeMode = function(mode) {
    if (this.currentMode === mode) {
        return;
    }

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

    this.focus();
};

/**
 * Remove TUIEditor from document
 * @api
 * @memberOf ToastUIEditor
 */
ToastUIEditor.prototype.remove = function() {
    var self = this;
    var i = __nedInstance.length - 1;
    this.wwEditor.remove();
    this.mdEditor.remove();
    this.layout.remove();

    if (this.getUI()) {
        this.getUI().remove();
    }

    this.eventManager.emit('removeEditor');
    this.eventManager.events.forEach(function(value, key) {
        self.off(key);
    });
    this.eventManager = null;

    for (; i >= 0; i -= 1) {
        if (__nedInstance[i] === this) {
            __nedInstance.splice(i, 1);
        }
    }
};

/**
 * Hide TUIEditor
 * @api
 * @memberOf ToastUIEditor
 */
ToastUIEditor.prototype.hide = function() {
    this.eventManager.emit('hide', this);
};

/**
 * Show TUIEditor
 * @api
 * @memberOf ToastUIEditor
 */
ToastUIEditor.prototype.show = function() {
    this.eventManager.emit('show', this);
    this.getCodeMirror().refresh();
};

/**
 * Scroll Editor content to Top
 * @api
 * @memberOf ToastUIEditor
 * @param {number} value Scroll amount
 * @returns {number}
 */
ToastUIEditor.prototype.scrollTop = function(value) {
    return this.getCurrentModeEditor().scrollTop(value);
};

/**
 * Set UI to private UI property
 * @api
 * @memberOf ToastUIEditor
 * @param {UI} UI UI instance
 */
ToastUIEditor.prototype.setUI = function(UI) {
    this._ui = UI;
};

/**
 * Get _ui property
 * @api
 * @memberOf ToastUIEditor
 * @returns {UI}
 */
ToastUIEditor.prototype.getUI = function() {
    return this._ui;
};

/**
 * Reset TUIEditor
 * @api
 * @memberOf ToastUIEditor
 */
ToastUIEditor.prototype.reset = function() {
    this.wwEditor.reset();
    this.mdEditor.reset();
};

/**
 * Get current range
 * @api
 * @memberOf ToastUIEditor
 * @returns {{start, end}|Range}
 */
ToastUIEditor.prototype.getRange = function() {
    return this.getCurrentModeEditor().getRange();
};

/**
 * Get text object of current range
 * @api
 * @memberOf ToastUIEditor
 * @param {{start, end}|Range} range Range object of each editor
 * @returns {object} TextObject class
 */
ToastUIEditor.prototype.getTextObject = function(range) {
    return this.getCurrentModeEditor().getTextObject(range);
};

/**
 * Get instance of TUIEditor
 * @api
 * @memberOf ToastUIEditor
 * @returns {Array}
 */
ToastUIEditor.getInstances = function() {
    return __nedInstance;
};

/**
 * Define extension
 * @api
 * @memberOf ToastUIEditor
 * @param {string} name Extension name
 * @param {ExtManager~extension} ext extension
 */
ToastUIEditor.defineExtension = function(name, ext) {
    extManager.defineExtension(name, ext);
};

/**
 * Factory method for Editor
 * @api
 * @memberOf ToastUIEditor
 * @param {object} options Option for initialize TUIEditor
 * @returns {ToastUIEditor}
 */
ToastUIEditor.factory = function(options) {
    var tuiEditor;

    if (options.viewOnly) {
        tuiEditor = new ViewOnly(options);
    } else {
        tuiEditor = new ToastUIEditor(options);

        tuiEditor.addCommand(mdBold);
        tuiEditor.addCommand(mdItalic);
        tuiEditor.addCommand(mdBlockquote);
        tuiEditor.addCommand(mdHeading);
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
};

/**
 * Marked renderer
 * @api
 * @memberOf ToastUIEditor
 * @type {marked.renderer}
 */
ToastUIEditor.markedRenderer = markedRenderer;

module.exports = ToastUIEditor;
