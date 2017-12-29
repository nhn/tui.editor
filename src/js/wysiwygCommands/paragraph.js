/**
 * @fileoverview Implements Paragraph wysiwyg command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import CommandManager from '../commandManager';
/**
 * Paragraph
 * Convert selected contents to paragraph only heading and list
 * @extends Command
 * @module wysiwygCommands/Paragraph
 * @ignore
 */
const Paragraph = CommandManager.command('wysiwyg', /** @lends Paragraph */{
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
        const $newFragment = $(document.createDocumentFragment());

        $(fragment).children().each((index, block) => {
          if (block.nodeName.match(/h\d/i)) {
            $newFragment.append($(block).children());
          } else if (block.nodeName.match(/ul|ol/i)) {
            $(block).find('li').each((i, listItem) => {
              $newFragment.append($(listItem).children());
            });
          } else {
            $newFragment.append(block);
          }
        });

        return $newFragment[0];
      });
    }
  }
});

export default Paragraph;
