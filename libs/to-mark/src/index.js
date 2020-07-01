/**
 * @fileoverview Implements entry point
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import toMark from './toMark';
import Renderer from './renderer';
import basicRenderer from './renderer.basic';
import gfmRenderer from './renderer.gfm';

toMark.Renderer = Renderer;
toMark.basicRenderer = basicRenderer;
toMark.gfmRenderer = gfmRenderer;

export default toMark;
