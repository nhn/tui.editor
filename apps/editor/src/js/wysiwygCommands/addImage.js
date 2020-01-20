/**
 * @fileoverview Implements AddImage wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import ImportManager from '../importManager';

const { decodeURIGraceful, encodeMarkdownCharacters } = ImportManager;

/**
 * AddImage
 * Add Image markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddImage
 * @ignore
 */
const AddImage = CommandManager.command(
  'wysiwyg',
  /** @lends AddImage */ {
    name: 'AddImage',
    /**
     * command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     * @param {object} data data for image
     */
    exec(wwe, data) {
      const sq = wwe.getEditor();
      let { altText, imageUrl } = data;

      altText = decodeURIGraceful(altText);
      imageUrl = encodeMarkdownCharacters(imageUrl);

      wwe.focus();

      if (!sq.hasFormat('PRE')) {
        sq.insertImage(imageUrl, { alt: altText });
      }
    }
  }
);

export default AddImage;
