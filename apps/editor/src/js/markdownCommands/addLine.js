/**
 * @fileoverview Implements AddLine markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import { findClosestNode, getMdStartLine, getMdEndCh, isTableCellNode } from '../utils/markdown';

function createTableRow(row) {
  const columnLen = row.parent.parent.columns.length;
  let result = '|';

  for (let i = 0; i < columnLen; i += 1) {
    result += '  |';
  }

  return result;
}

/**
 * Add AddLine command
 * @extends Command
 * @module markdownCommands/AddLine
 * @ignore
 */
const AddLine = CommandManager.command(
  'markdown',
  /** @lends AddLine */ {
    name: 'AddLine',
    exec(mde) {
      const cm = mde.getEditor();
      const { line, ch } = cm.getCursor();
      const mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
      const mdNode = mde.getToastMark().findNodeAtPosition([line + 1, mdCh]);
      const cellNode = findClosestNode(
        mdNode,
        node =>
          isTableCellNode(node) &&
          (node.parent.type === 'tableDelimRow' || node.parent.parent.type === 'tableBody')
      );

      if (cellNode) {
        this._addTableRowByCell(cellNode, cm);
      } else {
        cm.execCommand('newlineAndIndentContinueMarkdownList');
      }
    },
    _addTableRowByCell(cell, cm) {
      const line = getMdStartLine(cell);
      const { parent } = cell;
      const nextRow = parent.next;

      const currentLineText = cm.getLine(line - 1);
      const rowStr = createTableRow(parent);

      if ((nextRow && nextRow.type === 'tableRow') || currentLineText !== rowStr) {
        cm.setCursor(line - 1, getMdEndCh(parent));
        cm.replaceSelection(`\n${rowStr}`);
        cm.setCursor(line, 2);
      } else {
        cm.execCommand('deleteLine');
      }
    }
  }
);

export default AddLine;
