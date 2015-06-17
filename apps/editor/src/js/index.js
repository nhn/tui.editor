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
    CommandMangager = require('./commandManager'),
    ExtManager = require('./extManager'),
    Converter = require('./converter');

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
    var self = this,
        hooks;

    this.options = $.extend({
        'previewStyle': 'tab',
        'initialEditType': 'wysiwyg',
        'height': 300
    }, options);

    hooks = options.hooks;

    this.eventManager = new EventManager();
    this.commandManager = new CommandMangager(this);
    this.converter = new Converter(this.eventManager);

    this.layout = new Layout(options, this.eventManager, this.commandManager);
    this.layout.init();

    this.mdEditor = new MarkdownEditor(this.layout.getMdEditorContainerEl(), this.eventManager, this.commandManager);
    this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager);
    this.wwEditor = new WysiwygEditor(this.layout.getWwEditorContainerEl(), this.options.contentCSSStyles, this.eventManager, this.commandManager);

    //todo 옵션에따라 초기 에디터 활성화부분필요
    //ff에서 display none인 엘리먼트에 iframe이 붙으면 iframe안의 getSelection이 정상적으로 동작하지 않아 Squire에서 오류가 발생한다..
    //css로 float으로 레이아웃잡고 visibility로 온오프 처리해야하듯
    //Squire 이니셜라이즈가 모두끝난후 에디터 셀렉션이 들어가야할듯
    //this.layout._switchToMarkdown();

    //todo 추후 옵션처리기에서 처리
    if (hooks) {
        util.forEach(hooks, function(fn, key) {
            self.eventManager.listen(key, fn);
        });
    }

    this.changePreviewStyle(this.options.previewStyle);

    NEditor._extManager.applyExtension(this, this.options.exts);

    this.mdEditor.init(this.options.initialValue);

    this.wwEditor.init(this.options.height);

    this.eventManager.emit('editorTypeSwitched', this.options.initialEditType === 'markdown' ? 0 : 1);

    __nedInstance.push(this);
}


/**
 * 프리뷰가 보여지는 방식을 변경한다
 * @param {string} style 스타일 이름 tab, vertical
 */
NEditor.prototype.changePreviewStyle = function(style) {
    this.layout.changePreviewStyle(style);
};

NEditor.prototype.getCursorOffset = function() {
};

NEditor.prototype.execCommand = function(command) {
    //현재 에디터 상태를 토대로 codeMirror혹은 Wysiwyg커맨드를 실행해주는 루틴
    this.getCodeMirror().execCommand(command);
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


//for jquery
$.fn.ned = function() {
    var args = $.makeArray(arguments),
        options,
        instance,
        el;

    el = this[0];

    if (el) {
        options = args[0] || {};

        instance = $.data(el, 'ned');

        if (instance) {
            if (typeof options === 'string') {
                return instance[options].apply(instance, args.slice(1));
            }
        } else {
            options.el = el;
            instance = new NEditor(options);
            $.data(el, 'ned', instance);
        }
    }

    return this;
};

window.ne = window.ne || {};
window.ne.NEditor = NEditor;
