/**
 * @fileoverview Implements table remove WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * RemoveTable
 * Remove selected table
 * @extends Command
 * @module wysiwygCommands/TableRemove
 * @ignore
 */
const TableRemove = CommandManager.command(
  'wysiwyg',
  /** @lends RemoveTable */ {
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
        domUtils.remove(domUtils.closest(range.startContainer, 'table'));
      }

      wwe.focus();
    }
  }
);

export default TableRemove;
