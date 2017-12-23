/**
 * @fileoverview entry point for editor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

const Editor = require('./editor');

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
      instance = Editor.factory(options);
      $.data(el, 'tuiEditor', instance);
    }
  }

  return this;
};

module.exports = Editor;
