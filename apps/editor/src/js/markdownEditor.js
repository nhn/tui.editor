/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var Action = require('./action');

/**
 * MarkdownEditor
 * @exports MarkdownEditor
 * @extends {}
 * @constructor
 * @class
 */
function MarkdownEditor(base, options) {
    this.base = base;
    this.action = new Action(this.base);
}

MarkdownEditor.prototype.init = function() {};

module.exports = MarkdownEditor;