/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';

import CommandManager from '../commandManager';
import ImportManager from '../importManager';

import domUtils from '../utils/dom';

const { decodeURIGraceful, encodeMarkdownCharacters } = ImportManager;

/**
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
     * @param {object} data - data for link
     */
    exec(wwe, data) {
      const sq = wwe.getEditor();
      const linkAttribute = wwe.getLinkAttribute();
      let { url, linkText } = data;

      const linkManager = wwe.componentManager.getManager('link');

      linkText = decodeURIGraceful(linkText);
      url = encodeMarkdownCharacters(url);

      wwe.focus();

      if (!sq.hasFormat('PRE')) {
        sq.removeAllFormatting();

        const selectedText = sq.getSelectedText();
        const selectedImageOnly = this._isSelectedImageOnly(sq.getSelection());

        if (selectedText || selectedImageOnly) {
          sq.makeLink(url, linkAttribute);
        } else {
          const link = sq.createElement(
            'A',
            extend(
              {
                href: url
              },
              linkAttribute
            )
          );

          link.textContent = linkText;
          sq.insertElement(link);
        }

        linkManager.addClassNameToImageLinksInSelection();
      }
    },

    _isSelectedImageOnly(range) {
      if (!range.collapsed) {
        const { startContainer, endContainer } = range;

        if (startContainer && startContainer === endContainer) {
          return (
            domUtils.isElemNode(startContainer) && startContainer.firstChild.nodeName === 'IMG'
          );
        }
      }

      return false;
    }
  }
);

export default AddLink;
