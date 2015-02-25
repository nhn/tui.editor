/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * Session
 * @exports Session
 * @extends {}
 * @constructor
 * @class
 */
function Session(base) {
    this.base = base;
}

Session.prototype.newLine = function(range) {
    console.log("Session:NewLine", range);
};

module.exports = Session;