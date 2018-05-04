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

module.exports = toMark;
