/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

// codemirror modes&addons
require('./codemirror/fixOrderedListNumber');
require('./codemirror/overlay');
require('./codemirror/markdown');
require('./codemirror/gfm');
require('./codemirror/continuelist');
require('./codemirror/arrowKeyFunction');

// default extensions
require('./extensions/taskCounter');
require('./extensions/scrollFollow');
require('./extensions/colorSyntax');
require('./extensions/mark/mark');
require('./extensions/table/tableExtension');
require('./extensions/codeBlockPlantUML');

import ToastUIEditor from './editor';

window.tui = window.tui || {};
window.tui.Editor = ToastUIEditor;

// langs
require('./langs/en_US');
require('./langs/ko_KR');
require('./langs/zh_CN');
require('./langs/ja_JP');
require('./langs/nl_NL');

// for jquery
$.fn.tuiEditor = function(...args) {
    let options, instance;

    const el = this.get(0);

    if (el) {
        options = args[0] || {};

        instance = $.data(el, 'tuiEditor');

        if (instance) {
            if (typeof options === 'string') {
                return instance[options](...args.slice(1));
            }
        } else {
            options.el = el;
            instance = ToastUIEditor.factory(options);
            $.data(el, 'tuiEditor', instance);
        }
    }

    return this;
};
