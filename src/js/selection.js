/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * Selection
 * @exports Selection
 * @extends {}
 * @constructor
 * @class
 */
function Selection(options) {
    this.$editorEl = options.$editorEl;
}

Selection.prototype.update = function() {
    console.log($('pre')[0].innerText);
    var range = rangy.createRange();
    console.log(this.$editorEl);
    range.setStart(this.$editorEl[0]);

};

Selection.prototype.save = function() {
};
Selection.prototype.adjustCursor = function() {
};
Selection.prototype.createSelection = function() {
};

module.exports = Selection;
