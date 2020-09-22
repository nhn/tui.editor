/**
 * @fileoverview Entry point for viewer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';

$.fn.toastuiEditor = function(...args) {
  let options, instance;

  const el = this.get(0);

  if (el) {
    options = args[0] || {};

    instance = $.data(el, 'toastuiEditor');

    if (instance) {
      if (typeof options === 'string') {
        return instance[options](...args.slice(1));
      }
    } else {
      options.el = el;
      instance = new Viewer(options);
      $.data(el, 'toastuiEditor', instance);
    }
  }

  return this;
};

export default Viewer;
