/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


//codemirror modes&addons
require('./codemirror/overlay');
require('./codemirror/markdown');
require('./codemirror/gfm');
require('./codemirror/continuelist');

//default extensions
require('./extensions/taskCounter');
require('./extensions/scrollFollow');
require('./extensions/colorSyntax');
require('./extensions/mark/mark');

import ToastUIEditor from './editor';

//for jquery
$.fn.tuiEditor = function(...args) {
    const argumentArray = $.makeArray(...args);
    let options, instance;

    const el = this[0];

    if (el) {
        options = argumentArray[0] || {};

        instance = $.data(el, 'tuiEditor');

        if (instance) {
            if (typeof options === 'string') {
                return instance[options](...argumentArray.slice(1));
            }
        } else {
            options.el = el;
            instance = ToastUIEditor.factory(options);
            $.data(el, 'tuiEditor', instance);
        }
    }

    return this;
};

window.tui = window.tui || {};
window.tui.Editor = ToastUIEditor;
