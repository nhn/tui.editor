/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * Preview
 * @exports Preview
 * @extends {}
 * @constructor
 * @class
 */
function Preview(base) {
    this.base = base;
    this.el = this.base.layout.getPreviewEl();

    this.init();
}

Preview.prototype.init = function() {
    var self = this;

    this.base.eventManager.listen('previewUpdate', function(markdown) {
        self.el.html(marked(markdown, {
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        }));
    });
};

module.exports = Preview;