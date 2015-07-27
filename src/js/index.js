/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var NeonEditor;

//codemirror modes&addons
require('./codemirror/overlay');
require('./codemirror/markdown');
require('./codemirror/gfm');
require('./codemirror/continuelist');

NeonEditor = require('./editor');

//for jquery
$.fn.neonEditor = function() {
    var args = $.makeArray(arguments),
        options,
        instance,
        el;

    el = this[0];

    if (el) {
        options = args[0] || {};

        instance = $.data(el, 'neonEditor');

        if (instance) {
            if (typeof options === 'string') {
                return instance[options].apply(instance, args.slice(1));
            }
        } else {
            options.el = el;
            instance = new NeonEditor(options);
            $.data(el, 'neonEditor', instance);
        }
    }

    return this;
};

window.ne = window.ne || {};
window.ne.NeonEditor = NeonEditor;
