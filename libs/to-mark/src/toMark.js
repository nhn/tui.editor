/**
 * @fileoverview Implements toMark
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import DomRunner from './domRunner';
import toDom from './toDom';
import basicRenderer from './renderer.basic';
import gfmRenderer from './renderer.gfm';

const FIND_UNUSED_BRS_RX = /[ \xA0]+(\n\n)/g;
const FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX = /^[\n]+|[\s\n]+$/g;
const FIND_MULTIPLE_BRS_RX = /([ \xA0]+\n){2,}/g;
const FIND_RETURNS_RX = /([ \xA0]){2,}\n/g;
const FIND_RETURNS_AND_SPACE_RX = /[ \xA0\n]+/g;

/**
 * @exports toMark
 * @param {string} htmlStr html string to convert
 * @param {object} options option
 * @param {boolean} options.gfm if this property is false turn off it cant parse gfm
 * @param {Renderer} options.renderer pass renderer to use
 * @returns {string} converted markdown text
 * @example
 * toMark('<h1>hello world</h1>'); // "# hello world"
 * toMark('<del>strike</del>'); // "~~strike~~"
 * toMark('<del>strike</del>', {gfm: false}); // "strike"
 */
export default function toMark(htmlStr, options) {
  let isGfm = true;
  let renderer;

  if (!htmlStr) {
    return '';
  }

  renderer = gfmRenderer;

  if (options) {
    isGfm = options.gfm;

    if (isGfm === false) {
      renderer = basicRenderer;
    }

    renderer = options.renderer || renderer;
  }

  const runner = new DomRunner(toDom(htmlStr));

  return finalize(parse(runner, renderer), isGfm, renderer.lineFeedReplacement);
}

/**
 * Parse dom to markdown
 * @param {DomRunner} runner runner
 * @param {Renderer} renderer renderer
 * @returns {string} markdown text
 */
function parse(runner, renderer) {
  let markdownContent = '';

  while (runner.next()) {
    markdownContent += tracker(runner, renderer);
  }

  return markdownContent;
}

/**
 * Remove first and last return character
 * @param {string} text text to finalize
 * @param {boolean} isGfm isGfm flag
 * @param {string} lineFeedReplacement Line feed replacement text
 * @returns {string} result
 */
function finalize(text, isGfm, lineFeedReplacement) {
  // collapse return and <br>
  text = text.replace(FIND_UNUSED_BRS_RX, '\n');

  // collapse multiple br
  text = text.replace(FIND_MULTIPLE_BRS_RX, '\n\n');

  text = text.replace(FIND_RETURNS_AND_SPACE_RX, matched => {
    const returnCount = (matched.match(/\n/g) || []).length;

    if (returnCount >= 3) {
      return '\n\n';
    }
    if (matched >= 1) {
      return '\n';
    }

    return matched;
  });

  // remove first and last \n
  text = text.replace(FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX, '');

  text = text.replace(new RegExp(lineFeedReplacement, 'g'), '\n');
  // in gfm replace '  \n' make by <br> to '\n'
  if (isGfm) {
    text = text.replace(FIND_RETURNS_RX, '\n');
  }

  return text;
}

/**
 * Iterate childNodes and process conversion using recursive call
 * @param {DomRunner} runner dom runner
 * @param {Renderer} renderer renderer to use
 * @returns {string} processed text
 */
function tracker(runner, renderer) {
  let subContent = '';

  const node = runner.getNode();

  for (let i = 0, t = node.childNodes.length; i < t; i += 1) {
    runner.next();
    subContent += tracker(runner, renderer);
  }

  return renderer.convert(node, subContent);
}
