/**
 * @fileoverview Implements MoveNextCursorOrIndent markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import { findClosestNode, getMdStartLine, getMdEndCh, isTableCellNode } from '../utils/markdown';

/**
 * Add MoveNextCursorOrIndent command
 * @extends Command
 * @module markdownCommands/MoveNextCursorOrIndent
 * @ignore
 */
const MoveNextCursorOrIndent = CommandManager.command(
  'markdown',
  /** @lends MoveNextCursorOrIndent */ {
    name: 'MoveNextCursorOrIndent',
    exec(mde) {
      const cm = mde.getEditor();
      const { line, ch } = cm.getCursor();
      const mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
      const mdNode = mde.getToastMark().findNodeAtPosition([line + 1, mdCh]);
      const cellNode = findClosestNode(mdNode, node => isTableCellNode(node));

      if (cellNode) {
        this._moveCursorNextCell(cellNode, cm);
      } else {
        cm.execCommand('indentOrderedList');
      }
    },
    _moveCursorNextCell(cell, cm) {
      const { next, parent } = cell;
      let line = getMdStartLine(cell);
      let ch = getMdEndCh(cell) + 2;

      if (next) {
        ch = getMdEndCh(next);
      } else {
        const nextRow =
          !parent.next && parent.parent.type === 'tableHead'
            ? parent.parent.next.firstChild
            : parent.next;

        if (nextRow) {
          line = line + 1;
          ch = getMdEndCh(nextRow.firstChild);
        }
      }

      cm.setCursor({ line: line - 1, ch: ch - 1 });
    }
  }
);

export default MoveNextCursorOrIndent;
