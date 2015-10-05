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
    Convertor = require('./convertor');

//markdown commands
var mdcBold = require('./markdownCommands/bold'),
    mdcItalic = require('./markdownCommands/italic'),
    mdcBlockquote = require('./markdownCommands/blockquote'),
    mdcHeading = require('./markdownCommands/heading'),
    mdcHR = require('./markdownCommands/hr'),
    mdcAddLink = require('./markdownCommands/addLink'),
    mdcAddImage = require('./markdownCommands/addImage'),
    mdcUL = require('./markdownCommands/ul'),
    mdcOL = require('./markdownCommands/ol'),
    mdcTask = require('./markdownCommands/task');

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
    wwIncreaseTask = require('./wysiwygCommands/increaseTask'),
    wwTask = require('./wysiwygCommands/task');

var util = ne.util;

var __nedInstance = [];

//default extensions
require('./extensions/querySplitter');
require('./extensions/taskCounter');
require('./extensions/textPalette');
require('./extensions/scrollFollow');

/**
 * NeonEditor
 * @exports NeonEditor
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {number} options.height 에디터 height 픽셀
 * @param {string} options.initialValue 초기 입력 테스트
 * @param {string} options.previewStyle 프리뷰가 출력되는 방식을 정한다(tab, vertical)
 * @param {string} options.initialEditType 시작시 표시될 에디터 타입(markdown, wysiwyg)
 * @param {string} options.contentCSSStyles List of CSS style file path for HTML content.
 * @param {function} options.onload invoke function when editor loaded complete
 * @param {object} options.hooks 외부 연결 훅 목록
 * @param {function} options.hooks.previewBeforeHook 프리뷰 되기 직전 실행되는 훅, 프리뷰에 그려질 DOM객체들이 인자로 전달된다.
 * @param {function} options.hooks.addImageFileHook 이미지 추가 팝업에서 이미지가 선택되면 hook에 이미지정보가 전달되고 hook에서 이미지를 붙인다.
 */
function NeonEditor(options) {
    var self = this;

    this.options = $.extend({
        'previewStyle': 'tab',
        'initialEditType': 'markdown',
        'height': 300
    }, options);

    this.eventManager = new EventManager();

    this.commandManager = new CommandManager(this);
    this.convertor = new Convertor();

    this.layout = new Layout(options, this.eventManager);
    this.layout.modeSwitch.on('modeSwitched', function(ev, info) {
        self.changeMode(info.text);
    });

    this.mdEditor = new MarkdownEditor(this.layout.getMdEditorContainerEl(), this.eventManager);
    this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager, this.convertor);
    this.wwEditor = new WysiwygEditor(this.layout.getWwEditorContainerEl(), this.options.contentCSSStyles, this.eventManager);

    if (this.options.hooks) {
        util.forEach(this.options.hooks, function(fn, key) {
            self.on(key, fn);
        });
    }

    if (this.options.events) {
        util.forEach(this.options.events, function(fn, key) {
            self.on(key, fn);
        });
    }

    this.contentHeight(this.options.height);

    this.changePreviewStyle(this.options.previewStyle);

    this.mdEditor.init();

    this.wwEditor.init(function() {
        extManager.applyExtension(self, self.options.exts);

        self._initDefaultCommands();

        self.changeMode(self.options.initialEditType);

        self.setValue(self.options.initialValue);

        self.eventManager.emit('load', self);
    });

    __nedInstance.push(this);
}

NeonEditor.prototype._initDefaultCommands = function() {
    this.commandManager.addCommand(mdcBold);
    this.commandManager.addCommand(mdcItalic);
    this.commandManager.addCommand(mdcBlockquote);
    this.commandManager.addCommand(mdcHeading);
    this.commandManager.addCommand(mdcHR);
    this.commandManager.addCommand(mdcAddLink);
    this.commandManager.addCommand(mdcAddImage);
    this.commandManager.addCommand(mdcUL);
    this.commandManager.addCommand(mdcOL);
    this.commandManager.addCommand(mdcTask);

    this.commandManager.addCommand(wwBold);
    this.commandManager.addCommand(wwItalic);
    this.commandManager.addCommand(wwBlockquote);
    this.commandManager.addCommand(wwUL);
    this.commandManager.addCommand(wwOL);
    this.commandManager.addCommand(wwAddImage);
    this.commandManager.addCommand(wwAddLink);
    this.commandManager.addCommand(wwHR);
    this.commandManager.addCommand(wwHeading);
    this.commandManager.addCommand(wwIncreaseTask);
    this.commandManager.addCommand(wwTask);
};

/**
 * 프리뷰가 보여지는 방식을 변경한다
 * @param {string} style 스타일 이름 tab, vertical
 */
NeonEditor.prototype.changePreviewStyle = function(style) {
    this.layout.changePreviewStyle(style);
    this.mdPreviewStyle = style;
};

NeonEditor.prototype.exec = function() {
    this.commandManager.exec.apply(this.commandManager, arguments);
};

NeonEditor.prototype.addCommand = function(type, props) {
    if (!props) {
        this.commandManager.addCommand(type);
    } else {
        this.commandManager.addCommand(CommandManager.command(type, props));
    }
};

NeonEditor.prototype.on = function(type, handler) {
    this.eventManager.listen(type, handler);
};

NeonEditor.prototype.getCodeMirror = function() {
    return this.mdEditor.getEditor();
};

NeonEditor.prototype.getSquire = function() {
    return this.wwEditor.getEditor();
};

NeonEditor.prototype.focus = function() {
   this.getCurrentModeEditor().focus();
};

NeonEditor.prototype.setValue = function(markdown) {
    markdown = markdown || '';

    if (this.isMarkdownMode()) {
        this.mdEditor.setValue(markdown);
    } else {
        this.wwEditor.setValue(this.convertor.toHTML(markdown));
    }
};

NeonEditor.prototype.getValue = function() {
    var markdown;

    if (this.isMarkdownMode()) {
        markdown = this.mdEditor.getValue();
    } else {
        markdown = this.convertor.toMarkdown(this.wwEditor.getValue());
    }

    return markdown;
};

NeonEditor.prototype.addWidget = function(selection, node, style, offset) {
    this.getCurrentModeEditor().addWidget(selection, node, style, offset);
};

NeonEditor.prototype.contentHeight  = function(height) {
    if (height) {
        this._contentHeight = height;
        this.mdEditor.setHeight(height);
        this.preview.setHeight(height);
        this.wwEditor.setHeight(height);
    }

    return this._contentHeight;
};

NeonEditor.prototype.getCurrentModeEditor = function() {
    var editor;

    if (this.isMarkdownMode()) {
        editor = this.mdEditor;
    } else {
        editor = this.wwEditor;
    }

    return editor;
};

NeonEditor.prototype.isMarkdownMode = function() {
    return this.currentMode === 'markdown';
};

NeonEditor.prototype.isWysiwygMode = function() {
    return this.currentMode === 'wysiwyg';
};

NeonEditor.prototype.changeMode = function(mode) {
    if (this.currentMode === mode) {
        return;
    }

    this.currentMode = mode;

    if (this.isWysiwygMode()) {
        this.wwEditor.setValue(this.convertor.toHTML(this.mdEditor.getValue()));
        this.layout.switchToWYSIWYG();
        this.eventManager.emit('changeMode.wysiwyg');
    } else {
        this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue()));
        this.layout.switchToMarkdown();
        this.eventManager.emit('changeMode.markdown');
    }

    this.eventManager.emit('changeMode', mode);
};

NeonEditor.prototype.remove = function() {
    this.wwEditor.remove();
    this.mdEditor.remove();
    this.layout.remove();
};

NeonEditor.prototype.hide = function() {
    this.eventManager.emit('hide', this);
};

NeonEditor.prototype.show = function() {
    this.eventManager.emit('show', this);
};

NeonEditor.prototype.reset = function() {
    this.wwEditor.reset();
    this.mdEditor.reset();
};

NeonEditor.getInstances = function() {
    return __nedInstance;
};

NeonEditor.defineExtension = function(name, ext) {
    extManager.defineExtension(name, ext);
};

module.exports = NeonEditor;
