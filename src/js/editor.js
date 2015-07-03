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
    ExtManager = require('./extManager'),
    Converter = require('./converter');

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
    wwTask = require('./wysiwygCommands/task');

var util = ne.util;

var __nedInstance = [];

/**
 * NEditor
 * @exports NEditor
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {number} options.height 에디터 height 픽셀
 * @param {string} options.initialValue 초기 입력 테스트
 * @param {string} options.previewStyle 프리뷰가 출력되는 방식을 정한다(tab, vertical)
 * @param {string} options.initialEditType 시작시 표시될 에디터 타입(markdown, wysiwyg)
 * @param {string} options.contentCSSStyles List of CSS style file path for HTML content.
 * @param {object} options.hooks 외부 연결 훅 목록
 * @param {function} options.hooks.htmlRenderAfterHook DOM으로 그려질 HTML텍스트가 만들어진후 실행되는 훅, 만들어진 HTML텍스트가 인자로 전달되고 리턴값이 HTML텍스트로 대체된다.
 * @param {function} options.hooks.previewBeforeHook 프리뷰 되기 직전 실행되는 훅, 프리뷰에 그려질 DOM객체들이 인자로 전달된다.
 * @param {function} options.hooks.addImageFileHook 이미지 추가 팝업에서 이미지가 선택되면 hook에 이미지정보가 전달되고 hook에서 이미지를 붙인다.
 */
function NEditor(options) {
    var self = this;

    this.options = $.extend({
        'previewStyle': 'tab',
        'initialEditType': 'markdown',
        'height': 300
    }, options);

    this.eventManager = new EventManager();
    this.commandManager = new CommandManager(this);
    this.converter = new Converter(this.eventManager);

    this.layout = new Layout(options, this.eventManager);
    this.layout.init();

    this.mdEditor = new MarkdownEditor(this.layout.getMdEditorContainerEl(), this.eventManager);
    this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager);
    this.wwEditor = new WysiwygEditor(this.layout.getWwEditorContainerEl(), this.options.contentCSSStyles, this.eventManager);

    //todo 옵션에따라 초기 에디터 활성화부분필요
    //ff에서 display none인 엘리먼트에 iframe이 붙으면 iframe안의 getSelection이 정상적으로 동작하지 않아 Squire에서 오류가 발생한다..
    //css로 float으로 레이아웃잡고 visibility로 온오프 처리해야하듯
    //Squire 이니셜라이즈가 모두끝난후 에디터 셀렉션이 들어가야할듯
    //this.layout._switchToMarkdown();

    //todo 추후 옵션처리기에서 처리
    if (this.options.hooks) {
        util.forEach(this.options.hooks, function(fn, key) {
            self.eventManager.listen(key, fn);
        });
    }

    this.wwEditor.init(this.options.height, function() {
        self.changePreviewStyle(self.options.previewStyle);

        self.mdEditor.init(self.options.initialValue);

        NEditor._extManager.applyExtension(self, self.options.exts);

        self._initDefaultCommands();

        if (self.options.initialEditType === 'markdown') {
            self.eventManager.emit('changeEditorTypeToMarkdown');
        } else {
            self.eventManager.emit('changeEditorTypeToWysiwyg');
        }
    });

    __nedInstance.push(this);
}

NEditor.prototype._initDefaultCommands = function() {
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
    this.commandManager.addCommand(wwTask);
};

/**
 * 프리뷰가 보여지는 방식을 변경한다
 * @param {string} style 스타일 이름 tab, vertical
 */
NEditor.prototype.changePreviewStyle = function(style) {
    this.layout.changePreviewStyle(style);
};

NEditor.prototype.exec = function(command) {
};

NEditor.prototype.getCodeMirror = function() {
   return this.mdEditor.cm;
};

NEditor.prototype.getSquire = function() {
    return this.wwEditor.editor;
};

NEditor.prototype.focus = function() {
   this.mdEditor.focus();
};

NEditor.prototype.setValue = function(markdown) {
    this.mdEditor.setValue(markdown);
};

NEditor.prototype.getValue = function() {
    return this.mdEditor.getValue();
};

NEditor.prototype.remove = function() {
    console.log('remove');
};

NEditor.prototype.hide = function() {
    console.log('hide');
};

NEditor.getInstances = function() {
    return __nedInstance;
};

NEditor.definedExtention = function(name, ext) {
    NEditor._extManager.defineExtension(name, ext);
};

NEditor._extManager = new ExtManager();

module.exports = NEditor;
