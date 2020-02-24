/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';

import CommandManager from '../commandManager';
import ImportManager from '../importManager';
const { decodeURIGraceful, encodeMarkdownCharacters } = ImportManager;

/**
 * AddLink
 * Add link markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddLink
 * @ignore
 */
const AddLink = CommandManager.command(
  'wysiwyg',
  /** @lends AddLink */ {
    name: 'AddLink',
    /**
     * command handler
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     * @param {object} data - data for image
     */
    exec(wwe, data) {
      const sq = wwe.getEditor();
      const linkAttibute = wwe.getLinkAttribute();
      let { url, linkText } = data;

      linkText = decodeURIGraceful(linkText);
      url = encodeMarkdownCharacters(url);

      wwe.focus();

      if (!sq.hasFormat('PRE')) {
        sq.removeAllFormatting();

        if (sq.getSelectedText()) {
          sq.makeLink(url, linkAttibute);
        } else {
          const link = sq.createElement(
            'A',
            extend(
              {
                href: url
              },
              linkAttibute
            )
          );

          link.textContent = linkText;
          sq.insertElement(link);
        }
      }
    }
  }
);

export default AddLink;
