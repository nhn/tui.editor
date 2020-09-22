import { Plugin, Transaction } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { Context } from '@t/spec';
import { EditResult, MdNode, MdPos } from '@t/markdown';
import { getMdStartLine, getMdEndLine, getMdStartCh, getMdEndCh } from '@/utils/markdown';
import { getMarkInfo } from './helper/markInfo';

export function syntaxHighlight({ toastMark, schema }: Context) {
  return new Plugin({
    appendTransaction(transations, oldState, newState) {
      const lineTexts = toastMark.getLineTexts();
      const [tr] = transations;

      let newTr = newState.tr;

      if (tr.docChanged) {
        const editResult: EditResult[] = tr.getMeta('editResult');

        editResult.forEach(result => {
          const { nodes } = result;

          if (nodes.length) {
            newTr = removeMark(nodes, lineTexts, newTr);

            for (const parent of nodes) {
              const walker = parent.walker();
              let event = walker.next();

              while (event) {
                const { node, entering } = event;

                // eslint-disable-next-line max-depth
                if (entering) {
                  newTr = addMark(node, lineTexts, newTr, schema);
                }
                event = walker.next();
              }
            }
          }
        });
      }

      return newTr;
    }
  });
}

function removeMark(nodes: MdNode[], lineTexts: string[], newTr: Transaction) {
  const [start] = nodes[0].sourcepos!;
  const [, end] = nodes[nodes.length - 1].sourcepos!;
  const startPos: MdPos = [start[0] - 1, start[1] - 1];
  const endPos: MdPos = [end[0] - 1, end[1]];
  const pos = getMarkTargetPos(startPos, endPos, lineTexts);

  return newTr.removeMark(pos[0], pos[1]);
}

function addMark(node: MdNode, lineTexts: string[], newTr: Transaction, schema: Schema) {
  const startPos: MdPos = [getMdStartLine(node) - 1, getMdStartCh(node) - 1];
  const endPos: MdPos = [getMdEndLine(node) - 1, getMdEndCh(node)];
  const markInfo = getMarkInfo(node, startPos, endPos, lineTexts[endPos[0]]);

  if (markInfo) {
    const { marks = [], lineBackground } = markInfo;

    if (lineBackground) {
      const { start, end, spec } = lineBackground;
      const pos = getMarkTargetPos(start, end, lineTexts);

      newTr = newTr.setBlockType(pos[0], pos[1], schema.nodes.paragraph, spec.attrs);
    }

    marks.forEach(({ start, end, spec }) => {
      const pos = getMarkTargetPos(start, end, lineTexts);
      const { type, attrs } = spec;

      newTr = newTr.addMark(pos[0], pos[1], schema.mark(type!, attrs));
    });
  }
  return newTr;
}

function getMarkTargetPos(startPos: MdPos, endPos: MdPos, lineTexts: string[]) {
  let from = 0;
  let to = 0;

  for (let i = 0; i < endPos[0]; i += 1) {
    const len = lineTexts[i].length;

    // should plus 2(end tag, start tag) to consider line breaking
    if (i < startPos[0]) {
      from += len + 2;
    }
    to += len + 2;
  }
  // should plus 1 to position to consider the start tag position
  from += startPos[1] + 1;
  to += endPos[1] + 1;

  return [from, to];
}
