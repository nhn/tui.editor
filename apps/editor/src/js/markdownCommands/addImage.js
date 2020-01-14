/**
 * @fileoverview Implments AddImage markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import ImportManager from '../importManager';

const { decodeURIGraceful, encodeMarkdownCharacters, escapeMarkdownCharacters } = ImportManager;

/**
 * AddImage
 * Add Image markdown syntax to markdown Editor
 * @extends Command
 * @module markdownCommands/AddImage
 * @ignore
 */
const AddImage = CommandManager.command(
  'markdown',
  /** @lends AddImage */ {
    name: 'AddImage',
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     * @param {object} data data for image
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

      let { altText, imageUrl } = data;

      altText = decodeURIGraceful(altText);
      altText = escapeMarkdownCharacters(altText);
      imageUrl = encodeMarkdownCharacters(imageUrl);
      const replaceText = `![${altText}](${imageUrl})`;

      doc.replaceRange(replaceText, from, to, '+addImage');

      cm.focus();
    }
  }
);

export default AddImage;
