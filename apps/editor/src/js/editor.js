/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownEditor = require('./markdownEditor'),
    Preview = require('./preview'),
    WysiwygEditor = require('./wysiwygEditor'),
    Layout = require('./layout'),
    EventManager = require('./eventManager'),
    CommandManager = require('./commandManager'),
    extManager = require('./extManager'),
    ImportManager = require('./importManager'),
    Convertor = require('./convertor'),
    DefaultUI = require('./ui/defaultUI.js');

//markdown commands
var mdBold = require('./markdownCommands/bold'),
    mdItalic = require('./markdownCommands/italic'),
    mdBlockquote = require('./markdownCommands/blockquote'),
    mdHeading = require('./markdownCommands/heading'),
    mdHR = require('./markdownCommands/hr'),
    mdAddLink = require('./markdownCommands/addLink'),
    mdAddImage = require('./markdownCommands/addImage'),
    mdUL = require('./markdownCommands/ul'),
    mdOL = require('./markdownCommands/ol'),
    mdTable = require('./markdownCommands/table'),
    mdTask = require('./markdownCommands/task');

//wysiwyg Commands
var wwBold = require('./wysiwygCommands/bold'),
    wwItalic = require('./wysiwygCommands/italic'),
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
    wwIncreaseTask = require('./wysiwygCommands/increaseTask'),
    wwTask = require('./wysiwygCommands/task');

var util = tui.util;

var __nedInstance = [];

//default extensions
require('./extensions/taskCounter');
require('./extensions/textPalette');
require('./extensions/scrollFollow');
require('./extensions/colorSyntax');

/**
 * ToastUI Editor
 * @exports ToastUIEditor
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {number} options.height 에디터 height 픽셀
 * @param {string} options.initialValue 초기 입력 테스트
 * @param {string} options.previewStyle 프리뷰가 출력되는 방식을 정한다(tab, vertical)
 * @param {string} options.initialEditType 시작시 표시될 에디터 타입(markdown, wysiwyg)
 * @param {string} options.contentCSSStyles List of CSS style file path for HTML content.
 * @param {object} options.events eventlist
 * @param {function} options.events.load it would be emitted when editor fully load
 * @param {function} options.events.change it would be emitted when content changed
 * @param {function} options.events.stateChange it would be emitted when format change by cursor position
 * @param {function} options.events.focus it would be emitted when editor get focus
 * @param {function} options.events.blur it would be emitted when editor loose focus
 * @param {object} options.hooks 외부 연결 훅 목록
 * @param {function} options.hooks.previewBeforeHook 프리뷰 되기 직전 실행되는 훅, 프리뷰에 그려질 DOM객체들이 인자로 전달된다.
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

    this.layout = new Layout(options, this.eventManager);

    this.setUI(this.options.UI || new DefaultUI(this));

    this.mdEditor = new MarkdownEditor(this.layout.getMdEditorContainerEl(), this.eventManager);
    this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager, this.convertor);
    this.wwEditor = WysiwygEditor.factory(this.layout.getWwEditorContainerEl(), this.options.contentCSSStyles, this.eventManager);

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


    this.changePreviewStyle(this.options.previewStyle);

    this.mdEditor.init();

    this.wwEditor.init(function() {
        extManager.applyExtension(self, self.options.exts);

        self.changeMode(self.options.initialEditType);

        self.contentHeight(self.options.height);

        self.setValue(self.options.initialValue);

        self.eventManager.emit('load', self);
    });

    __nedInstance.push(this);
}

ToastUIEditor.prototype._initDefaultCommands = function() {
    };

/**
 * 프리뷰가 보여지는 방식을 변경한다
 * @param {string} style 스타일 이름 tab, vertical
 */
ToastUIEditor.prototype.changePreviewStyle = function(style) {
    this.layout.changePreviewStyle(style);
    this.mdPreviewStyle = style;
    this.eventManager.emit('changePreviewStyle', style);
};

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

ToastUIEditor.prototype.on = function(type, handler) {
    this.eventManager.listen(type, handler);
};

ToastUIEditor.prototype.off = function(type) {
    this.eventManager.removeEventHandler(type);
};

ToastUIEditor.prototype.addHook = function(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
};

ToastUIEditor.prototype.removeHook = function(type) {
    this.eventManager.removeEventHandler(type);
};

ToastUIEditor.prototype.getCodeMirror = function() {
    return this.mdEditor.getEditor();
};

ToastUIEditor.prototype.getSquire = function() {
    return this.wwEditor.getEditor();
};

ToastUIEditor.prototype.focus = function() {
   this.getCurrentModeEditor().focus();
};

ToastUIEditor.prototype.setValue = function(markdown) {
    markdown = markdown || '';

    if (this.isMarkdownMode()) {
        this.mdEditor.setValue(markdown);
    } else {
        this.wwEditor.setValue(this.convertor.toHTML(markdown));
    }
};

ToastUIEditor.prototype.getValue = function() {
    var markdown;

    if (this.isMarkdownMode()) {
        markdown = this.mdEditor.getValue();
    } else {
        markdown = this.convertor.toMarkdown(this.wwEditor.getValue());
    }

    return markdown;
};

ToastUIEditor.prototype.addWidget = function(selection, node, style, offset) {
    this.getCurrentModeEditor().addWidget(selection, node, style, offset);
};

ToastUIEditor.prototype.contentHeight  = function(height) {
    if (height) {
        this._contentHeight = height;
        this.mdEditor.setHeight(height);
        this.preview.setHeight(height);
        this.wwEditor.setHeight(height);
    }

    return this._contentHeight;
};

ToastUIEditor.prototype.getCurrentModeEditor = function() {
    var editor;

    if (this.isMarkdownMode()) {
        editor = this.mdEditor;
    } else {
        editor = this.wwEditor;
    }

    return editor;
};

ToastUIEditor.prototype.isMarkdownMode = function() {
    return this.currentMode === 'markdown';
};

ToastUIEditor.prototype.isWysiwygMode = function() {
    return this.currentMode === 'wysiwyg';
};

ToastUIEditor.prototype.getCurrentPreviewStyle = function() {
    return this.mdPreviewStyle;
};

ToastUIEditor.prototype.changeMode = function(mode) {
    if (this.currentMode === mode) {
        return;
    }

    this.currentMode = mode;

    if (this.isWysiwygMode()) {
        this.wwEditor.setValue(this.convertor.toHTML(this.mdEditor.getValue()));
        this.layout.switchToWYSIWYG();
        this.eventManager.emit('changeModeToWysiwyg');
    } else {
        this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue()));
        this.layout.switchToMarkdown();
        this.getCodeMirror().refresh();
        this.eventManager.emit('changeModeToMarkdown');
    }

    this.eventManager.emit('changeMode', mode);
};

ToastUIEditor.prototype.remove = function() {
    this.wwEditor.remove();
    this.mdEditor.remove();
    this.layout.remove();

    if (this.getUI()) {
        this.getUI().remove();
    }
};

ToastUIEditor.prototype.hide = function() {
    this.eventManager.emit('hide', this);
};

ToastUIEditor.prototype.show = function() {
    this.eventManager.emit('show', this);
    this.getCodeMirror().refresh();
};

ToastUIEditor.prototype.setUI = function(UI) {
    this._ui = UI;
};

ToastUIEditor.prototype.getUI = function() {
    return this._ui;
};

ToastUIEditor.prototype.reset = function() {
    this.wwEditor.reset();
    this.mdEditor.reset();
};

ToastUIEditor.getInstances = function() {
    return __nedInstance;
};

ToastUIEditor.defineExtension = function(name, ext) {
    extManager.defineExtension(name, ext);
};

ToastUIEditor.factory = function(options) {
    var tuiEditor = new ToastUIEditor(options);

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

    tuiEditor.addCommand(wwBold);
    tuiEditor.addCommand(wwItalic);
    tuiEditor.addCommand(wwBlockquote);
    tuiEditor.addCommand(wwUL);
    tuiEditor.addCommand(wwOL);
    tuiEditor.addCommand(wwAddImage);
    tuiEditor.addCommand(wwAddLink);
    tuiEditor.addCommand(wwHR);
    tuiEditor.addCommand(wwHeading);
    tuiEditor.addCommand(wwIncreaseTask);
    tuiEditor.addCommand(wwTask);
    tuiEditor.addCommand(wwTable);
    tuiEditor.addCommand(wwTableAddRow);
    tuiEditor.addCommand(wwTableAddCol);
    tuiEditor.addCommand(wwTableRemoveRow);
    tuiEditor.addCommand(wwTableRemoveCol);

    return tuiEditor;
};

module.exports = ToastUIEditor;
