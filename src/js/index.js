/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

// codemirror modes&addons
import './codemirror/fixOrderedListNumber';
import './codemirror/overlay';
import './codemirror/markdown';
import './codemirror/gfm';
import './codemirror/continuelist';
import './codemirror/arrowKeyFunction';

import ToastUIEditor from './editor';

// langs
import './langs/en_US';
import './langs/ko_KR';
import './langs/zh_CN';
import './langs/ja_JP';
import './langs/nl_NL';

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

module.exports = ToastUIEditor;
