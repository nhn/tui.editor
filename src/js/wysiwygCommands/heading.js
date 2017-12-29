/**
 * @fileoverview Implements Heading wysiwyg command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import CommandManager from '../commandManager';

/**
 * Heading
 * Convert selected root level contents to heading with size wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/Heading
 * @ignore
 */
const Heading = CommandManager.command('wysiwyg', /** @lends Heading */{
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
        $(fragment).children(blockTagName).each((index, block) => {
          const headingHTML = `<H${size} />`;
          const $block = $(block);

          if ($block.is('DIV')) {
            $block.wrap(headingHTML);
          } else {
            const $wrapperHeading = $(headingHTML);

            $wrapperHeading.insertBefore(block);
            $wrapperHeading.html($block.html());
            $block.remove();
          }
        });

        return fragment;
      });
    }
  }
});

export default Heading;
