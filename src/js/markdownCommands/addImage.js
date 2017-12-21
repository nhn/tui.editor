/**
* @fileoverview Implments AddImage markdown command
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import CommandManager from '../commandManager';

/**
 * AddImage
 * Add Image markdown syntax to markdown Editor
 * @extends Command
 * @module markdownCommands/AddImage
 * @ignore
 */
const AddImage = CommandManager.command('markdown', /** @lends AddImage */ {
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

    const replaceText = `![${data.altText}](${data.imageUrl})`;

    doc.replaceRange(replaceText, from, to, '+addImage');

    cm.focus();
  }
});

export default AddImage;
