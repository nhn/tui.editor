/**
 * @fileoverview Implements Renderer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

const FIND_LEAD_SPACE_RX = /^\u0020/;
const FIND_TRAIL_SPACE_RX = /.+\u0020$/;
const FIND_SPACE_RETURN_TAB_RX = /[\n\s\t]+/g;
const FIND_CHAR_TO_TRIM_RX = /^[\u0020\r\n\t]+|[\u0020\r\n\t]+$/g; // find first and last characters for trim
const FIND_SPACE_MORE_THAN_ONE_RX = /[\u0020]+/g; // find space more than one
const FIND_CHAR_TO_ESCAPE_RX = /[>(){}[\]+-.!#|]/g; // find characters that need escape
const FIND_CHAR_TO_ESCAPE_IN_LINK_RX = /[[\]]/g; // find characters to be escaped in links or images
const FIND_MARKDOWN_IMAGE_SYNTAX_RX = /!\[.*\]\(.*\)/g; // find markdown image syntax

const TEXT_NODE = 3;

/**
 * Iterate properties of object
 * from https://github.com/nhnent/fe.code-snippet/blob/master/src/collection.js
 * @param {object} obj object to iterate
 * @param {function} iteratee callback function
 * @param {*} [context] context of callback
 */
function forEachOwnProperties(obj, iteratee, context) {
  let key;

  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}

/**
 * Whether if inline node or not
 * @param {Node} node Element
 * @returns {boolean}
 */
// eslint-disable-next-line complexity
function isInlineNode(node) {
  const tag = node.tagName;

  return (
    tag === 'S' ||
    tag === 'B' ||
    tag === 'I' ||
    tag === 'EM' ||
    tag === 'STRONG' ||
    tag === 'A' ||
    tag === 'IMG' ||
    tag === 'CODE'
  );
}

/**
 * Returns HTML string of an element using given subContent
 * @param {Node} node Element
 * @param {string} subContent string content of node
 * @returns {string}
 */
function getRawHtmlString(node, subContent) {
  const tempNode = node.cloneNode(false);

  tempNode.innerHTML = subContent;

  return tempNode.outerHTML;
}

/**
 * Clone rules
 * @param {object} destination object for apply rules
 * @param {object} source source object for clone rules
 */
function cloneRules(destination, source) {
  forEachOwnProperties(source, function(value, key) {
    if (key !== 'converter') {
      if (!destination[key]) {
        destination[key] = {};
      }
      cloneRules(destination[key], value);
    } else {
      destination[key] = value;
    }
  });
}

/**
 * Renderer
 * @param {object} [rules] rules to add
 * @class
 */
export default class Renderer {
  static markdownTextToEscapeRx = {
    codeblock: /(^ {4}[^\n]+\n*)+/,
    hr: /^ *((\* *){3,}|(- *){3,} *|(_ *){3,}) */,
    heading: /^(#{1,6}) +[\s\S]+/,
    lheading: /^([^\n]+)\n *(=|-){2,} */,
    blockquote: /^( *>[^\n]+.*)+/,
    list: /^ *(\*+|-+|\d+\.) [\s\S]+/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? */,

    link: /!?\[.*\]\(.*\)/,
    reflink: /!?\[.*\]\s*\[([^\]]*)\]/,

    verticalBar: /\u007C/,

    codeblockGfm: /^(`{3,})/,
    codeblockTildes: /^(~{3,})/
  };

  static markdownTextToEscapeHtmlRx = /<([a-zA-Z_][a-zA-Z0-9\-._]*)(\s|[^\\/>])*\/?>|<(\/)([a-zA-Z_][a-zA-Z0-9\-._]*)\s*\/?>|<!--[^-]+-->|<([a-zA-Z_][a-zA-Z0-9\-.:/]*)>/;

  static markdownTextToEscapeBackSlashRx = /\\[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]/;

  static markdownTextToEscapePairedCharsRx = /[*_~`]/;

  constructor(rules) {
    this.rules = {};

    /**
     * Line feed replacement text
     * @type string
     */
    this.lineFeedReplacement = '\u200B\u200B';

    if (rules) {
      this.addRules(rules);
    }
  }

  /**
   * Add rule
   * @param {string} selectorString rule selector
   * @param {function} converter converter function
   */
  addRule(selectorString, converter) {
    const selectors = selectorString.split(', ');
    let selector = selectors.pop();

    converter.fname = selectorString;

    while (selector) {
      this._setConverterWithSelector(selector, converter);
      selector = selectors.pop();
    }
  }

  /**
   * Add rules using object
   * @param {object} rules key(rule selector), value(converter function)
   */
  addRules(rules) {
    forEachOwnProperties(
      rules,
      function(converter, selectorString) {
        this.addRule(selectorString, converter);
      },
      this
    );
  }

  /**
   * Remove flanked space of dom node
   * @param {string} content text content
   * @param {HTMLElement} node current node
   * @returns {string} result
   */
  // eslint-disable-next-line complexity
  getSpaceControlled(content, node) {
    let lead = '';
    let trail = '';
    let text;

    if (
      node.previousSibling &&
      (node.previousSibling.nodeType === TEXT_NODE || isInlineNode(node.previousSibling))
    ) {
      text = node.previousSibling.innerHTML || node.previousSibling.nodeValue;

      if (
        FIND_TRAIL_SPACE_RX.test(text) ||
        FIND_LEAD_SPACE_RX.test(node.innerHTML || node.nodeValue)
      ) {
        lead = ' ';
      }
    }

    if (
      node.nextSibling &&
      (node.nextSibling.nodeType === TEXT_NODE || isInlineNode(node.nextSibling))
    ) {
      text = node.nextSibling.innerHTML || node.nextSibling.nodeValue;
      if (
        FIND_LEAD_SPACE_RX.test(text) ||
        FIND_TRAIL_SPACE_RX.test(node.innerHTML || node.nodeValue)
      ) {
        trail = ' ';
      }
    }

    return lead + content + trail;
  }

  /**
   * Convert dom node to markdown using dom node and subContent
   * @param {HTMLElement} node node to convert
   * @param {string} subContent child nodes converted text
   * @returns {string} converted text
   */
  // eslint-disable-next-line complexity
  convert(node, subContent) {
    let result;
    const converter = this._getConverter(node);

    if (node && node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-tomark-pass')) {
      node.removeAttribute('data-tomark-pass');
      result = getRawHtmlString(node, subContent);
    } else if (converter) {
      result = converter.call(this, node, subContent);
    } else if (node) {
      result = this.getSpaceControlled(this._getInlineHtml(node, subContent), node);
    }

    return result || '';
  }

  _getInlineHtml(node, subContent) {
    const html = node.outerHTML;
    const { tagName } = node;
    const escapedSubContent = subContent.replace(/\$/g, '$$$$');
    // escape $: replace all $ char to $$ before we throw this string to replace

    return html.replace(
      new RegExp(`(<${tagName} ?.*?>).*(</${tagName}>)`, 'i'),
      `$1${escapedSubContent}$2`
    );
  }

  /**
   * Get converter function for node
   * @private
   * @param {HTMLElement} node node
   * @returns {function} converter function
   */
  _getConverter(node) {
    let rulePointer = this.rules;
    let converter;

    while (node && rulePointer) {
      rulePointer = this._getNextRule(rulePointer, this._getRuleNameFromNode(node));
      node = this._getPrevNode(node);

      if (rulePointer && rulePointer.converter) {
        converter = rulePointer.converter;
      }
    }

    return converter;
  }

  /**
   * Get next rule object
   * @private
   * @param {object} ruleObj rule object
   * @param {string} ruleName rule tag name to find
   * @returns {object} rule Object
   */
  _getNextRule(ruleObj, ruleName) {
    return ruleObj[ruleName];
  }

  /**
   * Get proper rule tag name from node
   * @private
   * @param {HTMLElement} node node
   * @returns {string} rule tag name
   */
  _getRuleNameFromNode(node) {
    return node.tagName || 'TEXT_NODE';
  }

  /**
   * Get node's available parent node
   * @private
   * @param {HTMLElement} node node
   * @returns {HTMLElement | undefined} result
   */
  _getPrevNode(node) {
    const { parentNode } = node;
    let previousNode;

    if (parentNode && !parentNode.__htmlRootByToMark) {
      previousNode = parentNode;
    }

    return previousNode;
  }

  /**
   * Set converter for selector
   * @private
   * @param {string} selectors rule selector
   * @param {function} converter converter function
   */
  _setConverterWithSelector(selectors, converter) {
    let rulePointer = this.rules;

    this._eachSelector(selectors, function(ruleElem) {
      if (!rulePointer[ruleElem]) {
        rulePointer[ruleElem] = {};
      }

      rulePointer = rulePointer[ruleElem];
    });

    rulePointer.converter = converter;
  }

  /**
   * Iterate each selectors
   * @private
   * @param {string} selectors rule selectors
   * @param {function} iteratee callback
   */
  _eachSelector(selectors, iteratee) {
    const selectorArray = selectors.split(' ');
    let selectorIndex = selectorArray.length - 1;

    while (selectorIndex >= 0) {
      iteratee(selectorArray[selectorIndex]);
      selectorIndex -= 1;
    }
  }

  /**
   * Trim text
   * @param {string} text text be trimed
   * @returns {string} trimed text
   */
  trim(text) {
    return text.replace(FIND_CHAR_TO_TRIM_RX, '');
  }

  /**
   * Returns whether text empty or not
   * @param {string} text text be checked
   * @returns {boolean} result
   */
  isEmptyText(text) {
    return text.replace(FIND_SPACE_RETURN_TAB_RX, '') === '';
  }

  /**
   * Collape space more than 2
   * @param {string} text text be collapsed
   * @returns {string} result
   */
  getSpaceCollapsedText(text) {
    return text.replace(FIND_SPACE_MORE_THAN_ONE_RX, ' ');
  }

  /**
   * Apply backslash escape to text
   * @param {string} text text be processed
   * @returns {string} processed text
   */
  escapeText(text) {
    return text.replace(FIND_CHAR_TO_ESCAPE_RX, function(matched) {
      return `\\${matched}`;
    });
  }

  /**
   * Escape given text for link
   * @param {string} text - text be processed
   * @returns {string} - processed text
   */
  escapeTextForLink(text) {
    const imageSyntaxRanges = [];
    let result = FIND_MARKDOWN_IMAGE_SYNTAX_RX.exec(text);

    while (result) {
      imageSyntaxRanges.push([result.index, result.index + result[0].length]);
      result = FIND_MARKDOWN_IMAGE_SYNTAX_RX.exec(text);
    }

    return text.replace(FIND_CHAR_TO_ESCAPE_IN_LINK_RX, function(matched, offset) {
      const isDelimiter = imageSyntaxRanges.some(function(range) {
        return offset > range[0] && offset < range[1];
      });

      return isDelimiter ? matched : `\\${matched}`;
    });
  }

  /**
   * Backslash escape to text for html
   * Apply backslash escape to text
   * @param {string} text text be processed
   * @returns {string} processed text
   */
  escapeTextHtml(text) {
    return text.replace(new RegExp(Renderer.markdownTextToEscapeHtmlRx.source, 'g'), function(
      matched
    ) {
      return `\\${matched}`;
    });
  }

  /**
   * Backslash is using for escape ASCII punctuation character.
   * https://spec.commonmark.org/0.29/#backslash-escapes
   * If user input backslash as text, backslash is kept by inserting backslash.
   * For example, if input text is "\$", this text is changed "\\$"
   * @param {string} text text be processed
   * @returns {string} processed text
   */
  escapeTextBackSlash(text) {
    return text.replace(new RegExp(Renderer.markdownTextToEscapeBackSlashRx.source, 'g'), function(
      matched
    ) {
      return `\\${matched}`;
    });
  }

  /**
   * Escapes in markdown paired characters
   * @param {string} text Text to escape
   * @returns {string} escaped text
   */
  escapePairedCharacters(text) {
    return text.replace(
      new RegExp(Renderer.markdownTextToEscapePairedCharsRx.source, 'g'),
      function(matched) {
        return `\\${matched}`;
      }
    );
  }

  _isNeedEscape(text) {
    let res = false;
    const { markdownTextToEscapeRx } = Renderer;
    let type;

    for (type in markdownTextToEscapeRx) {
      if (markdownTextToEscapeRx.hasOwnProperty(type) && markdownTextToEscapeRx[type].test(text)) {
        res = true;
        break;
      }
    }

    return res;
  }

  _isNeedEscapeHtml(text) {
    return Renderer.markdownTextToEscapeHtmlRx.test(text);
  }

  _isNeedEscapeBackSlash(text) {
    return Renderer.markdownTextToEscapeBackSlashRx.test(text);
  }

  mix(renderer) {
    cloneRules(this.rules, renderer.rules);
  }

  /**
   * Renderer factory
   * Return new renderer
   * @param {Renderer} srcRenderer renderer to extend
   * @param {object} rules rule object, key(rule selector), value(converter function)
   * @returns {Renderer} renderer
   */
  static factory(srcRenderer, rules) {
    const renderer = new Renderer();

    if (!rules) {
      rules = srcRenderer;
    } else {
      renderer.mix(srcRenderer);
    }

    renderer.addRules(rules);

    return renderer;
  }
}
