/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var Extension = require('../extension');

var util = ne.util;

/**
 * Bold
 * @exports Bold
 * @extends {}
 * @constructor
 * @class
 */
function Bold(neditor) {
    Extension.call(this, 'Bold', neditor);
    this.init();
}

util.inherit(Bold, Extension);

Bold.prototype.init = function() {
    this.listen('markdownUpdated', function() {
        console.log('boldEvent');
    });

    this.addCommand({
        name: 'test',
        method: function(){
            console.log('command!!', arguments);
        }
    });
};

module.exports = Bold;