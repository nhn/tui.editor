/**
 * @fileoverview Implements entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var toMark = require('./toMark');
var Renderer = require('./renderer');
var basicRenderer = require('./renderer.basic');
var gfmRenderer = require('./renderer.gfm');

toMark.Renderer = Renderer;
toMark.basicRenderer = basicRenderer;
toMark.gfmRenderer = gfmRenderer;

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
