/**
 * @fileoverview Implements entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var toMark = require('./toMark');

if (typeof define === 'function' && define.amd) {
    define(function() {
        return toMark;
    });
} else if (typeof exports !== 'undefined') {
    module.exports = toMark;
}

if (typeof window !== 'undefined') {
    window.toMark = toMark;
}
