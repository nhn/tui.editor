/**
 * @fileoverview Implements Addlink markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import ImportManager from '../importManager';
const { decodeURIGraceful, encodeMarkdownCharacters } = ImportManager;

const FIND_MARKDOWN_IMAGE_SYNTAX_RX = /!\[.*\]\(.*\)/g;
const FIND_ESCAPED_CHARS_RX = /\(|\)|\[|\]|<|>/g;

function escapeLinkTextExceptImageSyntax(linkText) {
  const imageSyntaxRanges = [];

  let result = FIND_MARKDOWN_IMAGE_SYNTAX_RX.exec(linkText);

  while (result) {
    const { index } = result;

    imageSyntaxRanges.push([index, index + result[0].length]);
    result = FIND_MARKDOWN_IMAGE_SYNTAX_RX.exec(linkText);
  }

  return linkText.replace(FIND_ESCAPED_CHARS_RX, (matched, offset) => {
    const isDelimiter = imageSyntaxRanges.some(range => offset > range[0] && offset < range[1]);

    return isDelimiter ? matched : `\\${matched}`;
  });
}

/**
 * AddLink
 * Add link markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/AddLink
 * @ignore
 */
const AddLink = CommandManager.command(
  'markdown',
  /** @lends AddLink */ {
    name: 'AddLink',
    /**
     * command handler for AddLink
     * @param {MarkdownEditor} mde - MarkdownEditor instance
     * @param {object} data - data for image
     */
    exec(mde, data) {
      const cm = mde.getEditor();
      const doc = cm.getDoc();

      const range = mde.getCurrentRange();

      const from = {
        line: range.from.line,
        ch: range.from.ch
      };

      const to = {
        line: range.to.line,
        ch: range.to.ch
      };

      let { linkText, url } = data;

      linkText = decodeURIGraceful(linkText);
      linkText = escapeLinkTextExceptImageSyntax(linkText);

      url = encodeMarkdownCharacters(url);

      const replaceText = `[${linkText}](${url})`;

      doc.replaceRange(replaceText, from, to);

      cm.focus();
    }
  }
);

export default AddLink;
