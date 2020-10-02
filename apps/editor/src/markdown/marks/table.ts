import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';
import { Context, EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { resolveSelectionPos } from '../helper/pos';
import { createParagraph } from '../helper/manipulation';

interface Payload {
  colLen: number;
  rowLen: number;
}

function createTableHeader(colLen: number) {
  let headerRow = '|';
  let delimRow = '|';

  while (colLen) {
    headerRow += '  |';
    delimRow += ' --- |';
    colLen -= 1;
  }

  return [headerRow, delimRow];
}

function createTableBody(colLen: number, rowLen: number) {
  const bodyRows = [];

  for (let irow = 0; irow < rowLen; irow += 1) {
    let row = '|';

    for (let icol = 0; icol < colLen; icol += 1) {
      row += '  |';
    }

    bodyRows.push(row);
  }

  return bodyRows;
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

  commands({ schema }: Context): EditorCommand {
    return payload => (state, dispatch) => {
      const { colLen, rowLen } = payload as Payload;
      const [, to] = resolveSelectionPos(state.selection);
      const endOffset = state.doc.resolve(to).end();

      const headerRows = createTableHeader(colLen);
      const bodyRows = createTableBody(colLen, rowLen - 1);

      const nodes: ProsemirrorNode[] = [];

      headerRows.forEach(row => {
        nodes.push(createParagraph(schema, row));
      });
      bodyRows.forEach(row => {
        nodes.push(createParagraph(schema, row));
      });

      dispatch!(state.tr.insert(endOffset, nodes));
      return true;
    };
  }
}
