/**
* @fileoverview Implements Addlink markdown command
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import CommandManager from '../commandManager';
import ImportManager from '../importManager';
const {decodeURIGraceful, encodeMarkdownCharacters, escapeMarkdownCharacters} = ImportManager;

/**
 * AddLink
 * Add link markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/AddLink
 * @ignore
 */
const AddLink = CommandManager.command('markdown', /** @lends AddLink */{
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

    let {linkText, url} = data;
    linkText = decodeURIGraceful(linkText);
    linkText = escapeMarkdownCharacters(linkText);
    url = encodeMarkdownCharacters(url);

    const replaceText = `[${linkText}](${url})`;

    doc.replaceRange(replaceText, from, to);

    cm.focus();
  }
});

export default AddLink;
