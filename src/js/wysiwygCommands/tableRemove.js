/**
 * @fileoverview Implements table remove WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import CommandManager from '../commandManager';

/**
 * RemoveTable
 * Remove selected table
 * @extends Command
 * @module wysiwygCommands/TableRemove
 * @ignore
 */
const TableRemove = CommandManager.command('wysiwyg', /** @lends RemoveTable */{
  name: 'RemoveTable',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();
    const range = sq.getSelection().cloneRange();

    if (sq.hasFormat('TABLE')) {
      sq.saveUndoState(range);
      const $table = $(range.startContainer).closest('table');

      $table.remove();
    }

    wwe.focus();
  }
});

export default TableRemove;
