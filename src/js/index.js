/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var ToastUIEditor;

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

ToastUIEditor = require('./editor');

//for jquery
$.fn.tuiEditor = function() {
    var args = $.makeArray(arguments),
        options,
        instance,
        el;

    el = this[0];

    if (el) {
        options = args[0] || {};

        instance = $.data(el, 'tuiEditor');

        if (instance) {
            if (typeof options === 'string') {
                return instance[options].apply(instance, args.slice(1));
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
