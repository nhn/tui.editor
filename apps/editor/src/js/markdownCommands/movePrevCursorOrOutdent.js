/**
 * @fileoverview Implements MoveCursorOrOutdent markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import { findClosestNode, getMdStartLine, getMdEndCh, isTableCellNode } from '../utils/markdown';

/**
 * Add MovePrevCursorOrOutdent command
 * @extends Command
 * @module markdownCommands/MovePrevCursorOrOutdent
 * @ignore
 */
const MovePrevCursorOrOutdent = CommandManager.command(
  'markdown',
  /** @lends MovePrevCursorOrOutdent */ {
    name: 'MovePrevCursorOrOutdent',
    exec(mde) {
      const cm = mde.getEditor();
      const { line, ch } = cm.getCursor();
      const mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
      const mdNode = mde.getToastMark().findNodeAtPosition([line + 1, mdCh]);
      const cellNode = findClosestNode(mdNode, node => isTableCellNode(node));

      if (cellNode) {
        this._moveCursorPrevCell(cellNode, cm);
      } else {
        cm.execCommand('indentLessOrderedList');
      }
    },
    _moveCursorPrevCell(cell, cm) {
      const { prev, parent } = cell;
      let line = getMdStartLine(cell);
      let ch = 1;

      if (prev) {
        ch = getMdEndCh(prev);
      } else {
        const prevRow =
          !parent.prev && parent.parent.type === 'tableBody'
            ? parent.parent.prev.lastChild
            : parent.prev;

        if (prevRow) {
          line = line - 1;
          ch = getMdEndCh(prevRow.lastChild);
        }
      }

      cm.setCursor({ line: line - 1, ch: ch - 1 });
    }
  }
);

export default MovePrevCursorOrOutdent;
