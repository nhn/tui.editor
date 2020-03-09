/**
 * @fileoverview Implements Heading wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * Heading
 * Convert selected root level contents to heading with size wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/Heading
 * @ignore
 */
const Heading = CommandManager.command(
  'wysiwyg',
  /** @lends Heading */ {
    name: 'Heading',
    /**
     * Command handler
     * @param {WysiwygEditor} wwe WYSIWYGEditor instance
     * @param {Number} size size
     */
    exec(wwe, size) {
      const sq = wwe.getEditor();
      const blockTagName = 'h1, h2, h3, h4, h5, h6, div';

      wwe.focus();

      if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
        sq.modifyBlocks(fragment => {
          const blocks = domUtils.children(fragment, blockTagName);

          toArray(blocks).forEach(block => {
            const headingHTML = `h${size}`;

            if (domUtils.getNodeName(block) === 'DIV') {
              domUtils.wrap(block, headingHTML);
            } else {
              const wrapperHeading = document.createElement(headingHTML);

              domUtils.insertBefore(wrapperHeading, block);
              wrapperHeading.innerHTML = block.innerHTML;
              domUtils.remove(block);
            }
          });

          return fragment;
        });
      }
    }
  }
);

export default Heading;
