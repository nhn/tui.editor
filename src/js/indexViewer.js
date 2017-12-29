/**
 * @fileoverview entry point for viewer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

const Viewer = require('./viewer');

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
      instance = new Viewer(options);
      $.data(el, 'tuiEditor', instance);
    }
  }

  return this;
};

module.exports = Viewer;
