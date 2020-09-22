/**
 * @fileoverview Implements basicRenderer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import Renderer from './renderer';

const FIND_LAST_RETURN_RX = /\n$/g;
const FIND_BR_AND_RETURN_RX = /[ \xA0]+\n\n/g;
const FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX = /([ \xA0]+\n){2,}/g;
const FIND_LINK_HREF = /href="(.*?)"/;
const START_OF_LINES_RX = /^/gm;

/**
 * Basic Markdown Renderer
 * @exports basicRenderer
 * @augments Renderer
 */
export default Renderer.factory({
  // inlines
  TEXT_NODE(node) {
    let managedText = this.trim(this.getSpaceCollapsedText(node.nodeValue));

    if (this._isNeedEscapeBackSlash(managedText)) {
      managedText = this.escapeTextBackSlash(managedText);
    }

    managedText = this.escapePairedCharacters(managedText);

    if (this._isNeedEscapeHtml(managedText)) {
      managedText = this.escapeTextHtml(managedText);
    }
    if (this._isNeedEscape(managedText)) {
      managedText = this.escapeText(managedText);
    }

    return this.getSpaceControlled(managedText, node);
  },
  'CODE TEXT_NODE': function(node) {
    return node.nodeValue;
  },
  'EM, I': function(node, subContent) {
    let res = '';

    if (!this.isEmptyText(subContent)) {
      res = `*${subContent}*`;
    }

    return res;
  },
  'STRONG, B': function(node, subContent) {
    let res = '';

    if (!this.isEmptyText(subContent)) {
      res = `**${subContent}**`;
    }

    return res;
  },
  A(node, subContent) {
    let res = subContent;
    let title = '';
    let url;

    // "href" attribute is difficult to predict depending on the situation
    // so use as it is applied to html
    const foundedHref = FIND_LINK_HREF.exec(node.outerHTML);

    if (foundedHref) {
      url = foundedHref[1].replace(/&amp;/g, '&');
    }

    if (node.title) {
      title = ` "${node.title}"`;
    }

    if (!this.isEmptyText(subContent) && url) {
      res = `[${this.escapeTextForLink(subContent)}](${url}${title})`;
    }

    return res;
  },
  IMG(node) {
    const src = node.getAttribute('src');
    const { alt } = node;

    if (src) {
      return `![${this.escapeTextForLink(alt)}](${src})`;
    }

    return '';
  },
  BR() {
    return '  \n';
  },
  CODE(node, subContent) {
    let backticks, numBackticks;
    let res = '';

    if (!this.isEmptyText(subContent)) {
      numBackticks = parseInt(node.getAttribute('data-backticks'), 10);
      backticks = isNaN(numBackticks) ? '`' : Array(numBackticks + 1).join('`');

      res = backticks + subContent + backticks;
    }

    return res;
  },

  // Paragraphs
  P(node, subContent) {
    let res = '';

    // convert multiple brs to one br
    subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

    if (!this.isEmptyText(subContent)) {
      res = `\n\n${subContent}\n\n`;
    }

    return res;
  },
  'BLOCKQUOTE P': function(node, subContent) {
    return subContent;
  },
  'LI P': function(node, subContent) {
    let res = '';

    if (!this.isEmptyText(subContent)) {
      res = subContent;
    }

    return res;
  },

  // Headings
  'H1, H2, H3, H4, H5, H6': function(node, subContent) {
    let res = '';
    let headingNumber = parseInt(node.tagName.charAt(1), 10);

    while (headingNumber) {
      res += '#';
      headingNumber -= 1;
    }

    res += ' ';
    res += subContent;

    return `\n\n${res}\n\n`;
  },
  'LI H1, LI H2, LI H3, LI H4, LI H5, LI H6': function(node, subContent) {
    const headingNumber = parseInt(node.tagName.charAt(1), 10);

    return `${Array(headingNumber + 1).join('#')} ${subContent}`;
  },

  // List
  'UL, OL': function(node, subContent) {
    return `\n\n${subContent}\n\n`;
  },
  'LI OL, LI UL': function(node, subContent) {
    let processedSubContent;

    // remove last br of li
    processedSubContent = subContent.replace(FIND_BR_AND_RETURN_RX, '\n');

    // parent LI converter add \n too, so we remove last return
    processedSubContent = processedSubContent.replace(FIND_LAST_RETURN_RX, '');

    const res = processedSubContent.replace(START_OF_LINES_RX, '    ');

    return `\n${res}`;
  },
  'UL LI': function(node, subContent) {
    let res = '';

    // convert multiple brs to one br
    subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

    if (node.firstChild && node.firstChild.tagName === 'P') {
      res += '\n';
    }

    res += `* ${subContent}\n`;

    return res;
  },
  // eslint-disable-next-line complexity
  'OL LI': function(node, subContent) {
    let res = '';
    let liCounter = parseInt(node.parentNode.getAttribute('start') || 1, 10);

    while (node.previousSibling) {
      node = node.previousSibling;

      if (node.nodeType === 1 && node.tagName === 'LI') {
        liCounter += 1;
      }
    }

    // convert multiple brs to one br
    subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

    if (node.firstChild && node.firstChild.tagName === 'P') {
      res += '\n';
    }

    res += `${liCounter}. ${subContent}\n`;

    return res;
  },

  // HR
  HR() {
    return '\n\n- - -\n\n';
  },

  // Blockquote
  BLOCKQUOTE(node, subContent) {
    // convert multiple brs to one emptyline
    subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '\n\n');

    const trimmedText = this.trim(subContent);
    const res = trimmedText.replace(START_OF_LINES_RX, '> ');

    return `\n\n${res}\n\n`;
  },

  // Code Block
  'PRE CODE': function(node, subContent) {
    const lastNremoved = subContent.replace(FIND_LAST_RETURN_RX, '');
    const res = lastNremoved.replace(START_OF_LINES_RX, '    ');

    return `\n\n${res}\n\n`;
  }
});
