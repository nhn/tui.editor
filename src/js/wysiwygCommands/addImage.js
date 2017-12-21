/**
 * @fileoverview Implements AddImage wysiwyg command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';

/**
 * AddImage
 * Add Image markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddImage
 * @ignore
 */
const AddImage = CommandManager.command('wysiwyg', /** @lends AddImage */{
  name: 'AddImage',
  /**
   *  커맨드 핸들러
   *  @param {WysiwygEditor} wwe WYsiwygEditor instance
   *  @param {object} data data for image
   */
  exec(wwe, data) {
    const sq = wwe.getEditor();

    wwe.focus();

    if (!sq.hasFormat('PRE')) {
      sq.insertImage(data.imageUrl, {'alt': data.altText});
    }
  }
});

export default AddImage;
