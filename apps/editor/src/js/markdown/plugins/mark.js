import { Plugin } from 'prosemirror-state';
import { schema } from '../schema';
import { getMarkInfo } from './helper/markHelper';
import { getMdStartLine, getMdEndLine, getMdStartCh, getMdEndCh } from '../../utils/markdown';

export function markNode(toastMark) {
  return new Plugin({
    appendTransaction(transations, oldState, newState) {
      const lineTexts = toastMark.getLineTexts();
      let newTr = newState.tr;

      transations.forEach(tr => {
        if (tr.docChanged) {
          const editResult = tr.getMeta('editResult');

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
                    newTr = addMark(node, lineTexts, newTr);
                  }
                  event = walker.next();
                }
              }
            }
          });
        }
      });

      return newTr;
    }
  });
}

function removeMark(nodes, lineTexts, newTr) {
  const [start] = nodes[0].sourcepos;
  const [, end] = nodes[nodes.length - 1].sourcepos;
  const from = { line: start[0] - 1, ch: start[1] - 1 };
  const to = { line: end[0] - 1, ch: end[1] };
  const pos = getMarkTargetPos(from, to, lineTexts);

  return newTr.removeMark(pos[0], pos[1]);
}

function addMark(node, lineTexts, newTr) {
  const from = { line: getMdStartLine(node) - 1, ch: getMdStartCh(node) - 1 };
  const to = { line: getMdEndLine(node) - 1, ch: getMdEndCh(node) };
  const markInfo = getMarkInfo(node, from, to, lineTexts[to.line]);

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

      newTr = newTr.addMark(pos[0], pos[1], schema.mark(type, attrs));
    });
  }
  return newTr;
}

function getMarkTargetPos(start, end, lineTexts) {
  const startPos = [start.line, start.ch];
  const endPos = [end.line, end.ch];
  let from = 0;
  let to = 0;

  for (let i = 0; i < endPos[0]; i += 1) {
    const len = lineTexts[i].length;

    if (i < startPos[0]) {
      from += len + 2;
    }
    to += len + 2;
  }
  from += startPos[1] + 1;
  to += endPos[1] + 1;

  return [from, to];
}
