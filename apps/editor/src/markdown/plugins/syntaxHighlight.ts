import { Plugin, Transaction } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { Context } from '@t/spec';
import { EditResult, MdNode, MdPos } from '@t/markdown';
import { getMdStartLine, getMdEndLine, getMdStartCh, getMdEndCh } from '@/utils/markdown';
import { includes } from '@/utils/common';
import { getMarkInfo } from './helper/markInfo';
import { getMdToEditorPos } from '../helper/pos';

export function syntaxHighlight({ schema, toastMark }: Context) {
  return new Plugin({
    appendTransaction(transactions, _, newState) {
      const [tr] = transactions;

      let newTr = newState.tr;

      if (tr.docChanged) {
        const editResult: EditResult[] = tr.getMeta('editResult');

        editResult.forEach((result) => {
          const { nodes } = result;

          if (nodes.length) {
            newTr = removeMark(nodes, toastMark, newTr, schema);

            for (const parent of nodes) {
              const walker = parent.walker();
              let event = walker.next();

              while (event) {
                const { node, entering } = event;

                // eslint-disable-next-line max-depth
                if (entering) {
                  newTr = addMark(node, toastMark, newTr, schema);
                }
                event = walker.next();
              }
            }
          }
        });
      }

      return newTr;
    },
  });
}

function removeCodeBlockBackground(
  newTr: Transaction,
  toastMark: any,
  start: MdPos,
  end: MdPos,
  schema: Schema
) {
  const skipLines: number[] = [];

  for (let i = start[0] - 1; i < end[0]; i += 1) {
    const node = newTr.doc.content.child(i);
    const { codeStart, codeEnd } = node.attrs;

    if (codeStart && codeEnd && !includes(skipLines, codeStart[0])) {
      skipLines.push(codeStart[0]);
      codeEnd[0] = Math.min(codeEnd[0], newTr.doc.content.childCount);
      const pos = getMdToEditorPos(newTr.doc, toastMark, codeStart, codeEnd);

      newTr = newTr.setBlockType(pos[0], pos[1], schema.nodes.paragraph);
    }
  }

  return newTr;
}

function removeMark(nodes: MdNode[], toastMark: any, newTr: Transaction, schema: Schema) {
  const [start] = nodes[0].sourcepos!;
  const [, end] = nodes[nodes.length - 1].sourcepos!;
  const startPos: MdPos = [start[0], start[1]];
  const endPos: MdPos = [end[0], end[1] + 1];
  const pos = getMdToEditorPos(newTr.doc, toastMark, startPos, endPos);

  newTr = removeCodeBlockBackground(newTr, toastMark, start, end, schema);

  return newTr.removeMark(pos[0], pos[1]);
}

function addMark(node: MdNode, toastMark: any, newTr: Transaction, schema: Schema) {
  const lineTexts = toastMark.getLineTexts();
  const startPos: MdPos = [getMdStartLine(node), getMdStartCh(node)];
  const endPos: MdPos = [getMdEndLine(node), getMdEndCh(node) + 1];
  const markInfo = getMarkInfo(node, startPos, endPos, lineTexts[endPos[0] - 1]);

  if (markInfo) {
    const { marks = [], lineBackground } = markInfo;

    if (lineBackground) {
      const { start, end, spec } = lineBackground;
      const pos = getMdToEditorPos(newTr.doc, toastMark, start, end);

      newTr = newTr.setBlockType(pos[0], pos[1], schema.nodes.paragraph, {
        codeStart: start,
        codeEnd: end,
        ...spec.attrs,
      });
    }

    marks.forEach(({ start, end, spec }) => {
      const pos = getMdToEditorPos(newTr.doc, toastMark, start, end);
      const { type, attrs } = spec;

      newTr = newTr.addMark(pos[0], pos[1], schema.mark(type!, attrs));
    });
  }
  return newTr;
}
