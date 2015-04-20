'use strict';

var MarkdownEditor = require('./markdownEditor'),
    Preview = require('./preview'),
    Layout = require('./layout'),
    EventManager = require('./eventManager'),
    CommandMangager = require('./commandManager'),
    Layerpopup = require('./layerpopup'),
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
 * @param {object} options.hooks 외부 연결 훅 목록
 * @param {function} options.hooks.htmlRenderAfterHook DOM으로 그려질 HTML텍스트가 만들어진후 실행되는 훅, 만들어진 HTML텍스트가 인자로 전달되고 리턴값이 HTML텍스트로 대체된다.
 * @param {function} options.hooks.previewBeforeHook 프리뷰 되기 직전 실행되는 훅, 프리뷰에 그려질 DOM객체들이 인자로 전달된다.
 */
function NEditor(options) {
    var defaultOptions = {
        'previewStyle': 'tab',
        'height': 300
    };

    var hooks = options.hooks,
        self = this;

    this.options = $.extend({}, defaultOptions, options);

    this.eventManager = new EventManager();
    this.commandManager = new CommandMangager(this);
    this.converter = new Converter(this.eventManager);

    this.layout = new Layout(options, this.eventManager, this.commandManager);
    this.layout.init();

    this.mdEditor = new MarkdownEditor(this.layout.getEditorContainerEl(), this.eventManager, this.commandManager);
    this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager);


    //추후 옵션처리기에서 처리
    if (hooks) {
        util.forEach(hooks, function(fn, key) {
            self.eventManager.listen(key, fn);
        });
    }

    this.changePreviewStyle(this.options.previewStyle);
/*
    var lp = new Layerpopup({
        title: 'MYTITLE',
        textContent: 'waefwaef'
    });

    lp.show();
    */


    NEditor._extManager.applyExtension(this, this.options.exts);

    this.mdEditor.init(this.options.initialValue);
    this.getCodeMirror().__ned = this;

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

NEditor.prototype.getMarkdown = function() {
    console.log('getMarkdown');
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
