/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

// default extensions
require('./extensions/taskCounter');
require('./extensions/colorSyntax');
require('./extensions/mark/mark');
require('./extensions/table/tableExtension');
require('./extensions/codeBlockPlantUML');
require('./extensions/codeBlockChart');

import ToastUIEditorViewOnly from './viewOnly';

window.tui = window.tui || {};
window.tui.EditorViewOnly = ToastUIEditorViewOnly;

// for jquery
$.fn.tuiEditorViewOnly = function(...args) {
    let options, instance;

    const el = this.get(0);

    if (el) {
        options = args[0] || {};

        instance = $.data(el, 'tuiEditorViewOnly');

        if (instance) {
            if (typeof options === 'string') {
                return instance[options](...args.slice(1));
            }
        } else {
            options.el = el;
            instance = new ToastUIEditorViewOnly(options);
            $.data(el, 'tuiEditorViewOnly', instance);
        }
    }

    return this;
};
