/**
 * @fileoverview Implements Github flavored markdown renderer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import Renderer from './renderer';
import basicRenderer from './renderer.basic';

/**
 * gfmRenderer
 * github flavored Markdown Renderer
 *
 * we didnt render gfm br here because we need distingush returns that made by block with br
 * so we render gfm br later in toMark.js finalize function
 * @exports gfmRenderer
 * @augments Renderer
 */
export default Renderer.factory(basicRenderer, {
  'DEL, S': function(node, subContent) {
    return `~~${subContent}~~`;
  },
  'PRE CODE': function(node, subContent) {
    let language = '';
    let numberOfBackticks = node.getAttribute('data-backticks');

    if (node.getAttribute('data-language')) {
      language = ` ${node.getAttribute('data-language')}`;
    }
    numberOfBackticks = parseInt(numberOfBackticks, 10);

    const backticks = isNaN(numberOfBackticks) ? '```' : Array(numberOfBackticks + 1).join('`');

    subContent = subContent.replace(/(\r\n)|(\r)|(\n)/g, this.lineFeedReplacement);

    return `\n\n${backticks}${language}\n${subContent}\n${backticks}\n\n`;
  },
  PRE(node, subContent) {
    return subContent;
  },
  'UL LI': function(node, subContent) {
    return basicRenderer.convert(node, makeTaskIfNeed(node, subContent));
  },
  'OL LI': function(node, subContent) {
    return basicRenderer.convert(node, makeTaskIfNeed(node, subContent));
  },

  // Table
  TABLE(node, subContent) {
    return `\n\n${subContent}\n\n`;
  },
  'TBODY, TFOOT': function(node, subContent) {
    return subContent;
  },
  'TR TD, TR TH': function(node, subContent) {
    subContent = subContent.replace(/(\r\n)|(\r)|(\n)/g, '');

    return ` ${subContent} |`;
  },
  'TD BR, TH BR': function() {
    return '<br>';
  },
  TR(node, subContent) {
    return `|${subContent}\n`;
  },
  THEAD(node, subContent) {
    let result = '';

    const ths = findChildTag(findChildTag(node, 'TR')[0], 'TH');

    for (let i = 0, thsLength = ths.length; i < thsLength; i += 1) {
      result += ` ${makeTableHeadAlignText(ths[i])} |`;
    }

    return subContent ? `${subContent}|${result}\n` : '';
  }
});

/**
 * Make task Markdown string if need
 * @param {HTMLElement} node Passed HTML Element
 * @param {string} subContent node's content
 * @returns {string}
 */
function makeTaskIfNeed(node, subContent) {
  let condition;

  if (node.className.indexOf('task-list-item') !== -1) {
    condition = node.className.indexOf('checked') !== -1 ? 'x' : ' ';
    subContent = `[${condition}] ${subContent}`;
  }

  return subContent;
}
/**
 * Make table head align text
 * @param {HTMLElement} th Table head cell element
 * @returns {string}
 */
function makeTableHeadAlignText(th) {
  let leftAlignValue, rightAlignValue, textLength;
  const { align } = th;

  textLength = th.textContent ? th.textContent.length : th.innerText.length;
  leftAlignValue = '';
  rightAlignValue = '';

  if (align) {
    if (align === 'left') {
      leftAlignValue = ':';
      textLength -= 1;
    } else if (align === 'right') {
      rightAlignValue = ':';
      textLength -= 1;
    } else if (align === 'center') {
      rightAlignValue = ':';
      leftAlignValue = ':';
      textLength -= 2;
    }
  }

  return leftAlignValue + repeatString('-', textLength) + rightAlignValue;
}
/**
 * Find child element of given tag name
 * @param {HTMLElement} node starting element
 * @param {string} tagName Tag name for search
 * @returns {Array.<HTMLElement>}
 */
function findChildTag(node, tagName) {
  const { childNodes } = node;
  const result = [];

  for (let i = 0, childLength = childNodes.length; i < childLength; i += 1) {
    if (childNodes[i].tagName && childNodes[i].tagName === tagName) {
      result.push(childNodes[i]);
    }
  }

  return result;
}

/**
 * Repeat given string
 * @param {string} pattern String for repeat
 * @param {number} count Amount of repeat
 * @returns {string}
 */
function repeatString(pattern, count) {
  let result = pattern;

  count = Math.max(count, 3);

  while (count > 1) {
    result += pattern;
    count -= 1;
  }

  return result;
}
