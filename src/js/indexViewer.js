/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */
import $ from 'jquery';

import ToastUIEditorViewer from './viewer';

// for jquery
$.fn.tuiEditorViewer = function(...args) {
    let options, instance;

    const el = this.get(0);

    if (el) {
        options = args[0] || {};

        instance = $.data(el, 'tuiEditorViewer');

        if (instance) {
            if (typeof options === 'string') {
                return instance[options](...args.slice(1));
            }
        } else {
            options.el = el;
            instance = new ToastUIEditorViewer(options);
            $.data(el, 'tuiEditorViewer', instance);
        }
    }

    return this;
};

module.exports = ToastUIEditorViewer;
