import { DOMOutputSpecArray } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { EditorCommand } from '@t/spec';
import { MdNode, MdPos, TableCellMdNode } from '@t/markdown';
import { cls } from '@/utils/dom-legacy';
import { findClosestNode, getMdEndCh, getMdEndLine, isTableCellNode } from '@/utils/markdown';
import Mark from '@/spec/mark';
import { getEditorToMdPos, getMdToEditorPos, getPosInfo, resolveSelectionPos } from '../helper/pos';
import {
  createParagraph,
  createTextSelection,
  insertNodes,
  replaceNodes
} from '@/helper/manipulation';
import { getTextByMdLine } from '../helper/query';

interface Payload {
  colLen: number;
  rowLen: number;
}

interface MovingTypeInfo {
  type: 'next' | 'prev';
  parentType: 'tableHead' | 'tableBody';
  childType: 'firstChild' | 'lastChild';
  diff: 1 | -1;
}

const reEmptyTable = /\||\s/g;

function createTableHeader(colLen: number) {
  return [createTableRow(colLen), createTableRow(colLen, true)];
}

function createTableBody(colLen: number, rowLen: number) {
  const bodyRows = [];

  for (let i = 0; i < rowLen; i += 1) {
    bodyRows.push(createTableRow(colLen));
  }

  return bodyRows;
}

function createTableRow(colLen: number, delim?: boolean) {
  let row = '|';

  for (let i = 0; i < colLen; i += 1) {
    row += delim ? ' --- |' : '  |';
  }
  return row;
}

function createTargetTypes(moveNext: boolean): MovingTypeInfo {
  return moveNext
    ? { type: 'next', parentType: 'tableHead', childType: 'firstChild', diff: 1 }
    : { type: 'prev', parentType: 'tableBody', childType: 'lastChild', diff: -1 };
}

export class Table extends Mark {
  get name() {
    return 'table';
  }

  get defaultSchema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('table') }, 0];
      }
    };
  }

  private extendTable(): Command {
    return ({ selection, doc, tr, schema }, dispatch) => {
      const { to, startOffset, endOffset } = getPosInfo(doc, selection, true);

      const [startPos] = getEditorToMdPos(doc, to);
      const lineText = getTextByMdLine(doc, startPos[0]);
      const isEmpty = !lineText.replace(reEmptyTable, '').trim();

      const mdNode: MdNode = this.context.toastMark.findNodeAtPosition(startPos);
      const cellNode = findClosestNode(
        mdNode,
        node =>
          isTableCellNode(node) &&
          (node.parent.type === 'tableDelimRow' || node.parent.parent.type === 'tableBody')
      ) as TableCellMdNode;

      if (cellNode) {
        const { parent } = cellNode;
        const colLen = parent.parent.parent.columns.length;
        const row = createTableRow(colLen);

        if (isEmpty) {
          const emptyNode = createParagraph(schema);

          dispatch!(replaceNodes(tr, startOffset, endOffset, [emptyNode, emptyNode]));
        } else {
          const newTr = insertNodes(tr, endOffset, createParagraph(schema, row));

          dispatch!(newTr.setSelection(createTextSelection(newTr, endOffset + 4)));
        }

        return true;
      }

      return false;
    };
  }

  private moveTableCell(moveNext: boolean): Command {
    return ({ selection, doc, tr }, dispatch) => {
      const [, to] = resolveSelectionPos(selection);
      const [, endPos] = getEditorToMdPos(doc, to);
      const { toastMark } = this.context;

      const mdNode: MdNode = toastMark.findNodeAtPosition(endPos);
      const cellNode = findClosestNode(mdNode, node => isTableCellNode(node)) as TableCellMdNode;

      if (cellNode) {
        const { parent } = cellNode;
        const { type, parentType, childType, diff } = createTargetTypes(moveNext);

        let line = getMdEndLine(cellNode);
        let ch = moveNext ? getMdEndCh(cellNode) + 2 : 1;

        if (cellNode[type]) {
          ch = getMdEndCh(cellNode[type]!);
        } else {
          const row =
            !parent[type] && parent.parent.type === parentType
              ? parent.parent[type]![childType]
              : parent[type];

          if (row) {
            line = line + diff;
            ch = getMdEndCh(row[childType]!);
          }
        }

        const mdPos: MdPos = [line, ch];
        const [pos] = getMdToEditorPos(doc, toastMark, mdPos, mdPos);

        dispatch!(tr.setSelection(createTextSelection(tr, pos)));

        return true;
      }

      return false;
    };
  }

  commands(): EditorCommand<Payload> {
    return payload => ({ selection, doc, tr, schema }, dispatch) => {
      const { colLen, rowLen } = payload!;
      const [, to] = resolveSelectionPos(selection);
      const endOffset = doc.resolve(to).end();

      const headerRows = createTableHeader(colLen);
      const bodyRows = createTableBody(colLen, rowLen - 1);

      const nodes = [...headerRows, ...bodyRows].map(row => createParagraph(schema, row));
      const newTr = insertNodes(tr, endOffset, nodes);

      dispatch!(tr.setSelection(createTextSelection(newTr, endOffset + 4)));

      return true;
    };
  }

  keymaps() {
    return {
      Enter: this.extendTable(),
      Tab: this.moveTableCell(true),
      'Shift-Tab': this.moveTableCell(false)
    };
  }
}
