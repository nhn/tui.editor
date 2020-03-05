/**
 * @fileoverview Implements Paragraph wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';

import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * Paragraph
 * Convert selected contents to paragraph only heading and list
 * @extends Command
 * @module wysiwygCommands/Paragraph
 * @ignore
 */
const Paragraph = CommandManager.command(
  'wysiwyg',
  /** @lends Paragraph */ {
    name: 'Paragraph',
    /**
     * Command handler
     * @param {WysiwygEditor} wwe WYSIWYGEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();

      wwe.focus();

      if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
        sq.modifyBlocks(fragment => {
          const newFragment = document.createDocumentFragment();

          toArray(fragment.childNodes).forEach(block => {
            if (block.nodeName.match(/h\d/i)) {
              appendChildrenTo(newFragment, block.children);
            } else if (block.nodeName.match(/ul|ol/i)) {
              domUtils.findAll(block, 'li').forEach(listItem => {
                appendChildrenTo(newFragment, listItem.children);
              });
            } else {
              newFragment.appendChild(block);
            }
          });

          return newFragment;
        });
      }
    }
  }
);

/**
 * Append children
 * @param {HTMLElement} parent - target to append
 * @param {Array.<HTMLElement>} children - appending children
 */
function appendChildrenTo(parent, children) {
  toArray(children).forEach(child => {
    parent.appendChild(child.cloneNode(true));
  });
}

export default Paragraph;
