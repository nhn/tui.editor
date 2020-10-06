import { DOMOutputSpecArray } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';
import { Context, EditorCommand } from '@t/spec';
import { MdNode, TableMdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import { findClosestNode, isTableCellNode } from '@/utils/markdown';
import Mark from '@/spec/mark';
import { getEditorToMdPos, getExtendedRangeOffset, resolveSelectionPos } from '../helper/pos';
import { createParagraph, insertBlockNodes, replaceBlockNodes } from '../helper/manipulation';

interface Payload {
  colLen: number;
  rowLen: number;
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

export class Table extends Mark {
  get name() {
    return 'table';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('table') }, 0];
      }
    };
  }

  private extendTable(context: Context): Command {
    return (state, dispatch) => {
      const { schema, toastMark } = context;
      const { selection, doc, tr } = state;
      const [, to] = resolveSelectionPos(selection);
      const [startOffset, endOffset] = getExtendedRangeOffset(to, to, doc);
      const [startPos] = getEditorToMdPos(to, to, doc);
      const lineText = toastMark.getLineTexts()[startPos[0] - 1];
      const isEmpty = !lineText.replace(reEmptyTable, '').trim();

      const mdNode: MdNode = toastMark.findNodeAtPosition(startPos);
      const cellNode = findClosestNode(
        mdNode,
        node =>
          isTableCellNode(node) &&
          (node.parent!.type === 'tableDelimRow' || node.parent!.parent!.type === 'tableBody')
      );

      if (cellNode) {
        const { parent } = cellNode;
        const colLen = (parent!.parent!.parent as TableMdNode).columns.length;
        const row = createTableRow(colLen);

        if (isEmpty) {
          const emptyNode = createParagraph(schema);

          dispatch!(replaceBlockNodes(tr, startOffset, endOffset, [emptyNode, emptyNode]));
        } else {
          const newTr = insertBlockNodes(tr, endOffset, createParagraph(schema, row));
          const caretSelection = TextSelection.create(newTr.doc, endOffset + 4);

          dispatch!(newTr.setSelection(caretSelection));
        }

        return true;
      }

      return false;
    };
  }

  commands({ schema }: Context): EditorCommand<Payload> {
    return payload => ({ selection, doc, tr }, dispatch) => {
      const { colLen, rowLen } = payload!;
      const [, to] = resolveSelectionPos(selection);
      const endOffset = doc.resolve(to).end();

      const headerRows = createTableHeader(colLen);
      const bodyRows = createTableBody(colLen, rowLen - 1);

      const nodes = [...headerRows, ...bodyRows].map(row => createParagraph(schema, row));

      const newTr = insertBlockNodes(tr, endOffset, nodes);
      const newSelection = TextSelection.create(newTr.doc, endOffset + 4);

      dispatch!(tr.setSelection(newSelection));

      return true;
    };
  }

  keymaps(context: Context) {
    return {
      Enter: this.extendTable(context)
    };
  }
}
