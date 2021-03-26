import { MdNode, MdPos, EditResult, ToastMark } from '@toast-ui/toastmark';
import { Plugin, Transaction } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { MdContext } from '@t/spec';
import { getMdStartLine, getMdEndLine, getMdStartCh, getMdEndCh } from '@/utils/markdown';
import { includes, last } from '@/utils/common';
import { getStartPosListPerLine, getWidgetNodePos } from '@/markdown/helper/pos';
import { getMarkInfo, MarkInfo } from './helper/markInfo';

interface CodeBlockPos {
  codeStart: MdPos;
  codeEnd: MdPos;
}

export function syntaxHighlight({ schema, toastMark }: MdContext) {
  return new Plugin({
    appendTransaction(transactions, _, newState) {
      const [tr] = transactions;
      const newTr = newState.tr;

      if (tr.docChanged) {
        let markInfo: MarkInfo[] = [];
        const editResult: EditResult[] = tr.getMeta('editResult');

        editResult.forEach((result) => {
          const { nodes, removedNodeRange } = result;

          if (nodes.length) {
            markInfo = markInfo.concat(getMarkForRemoving(newTr, nodes));

            for (const parent of nodes) {
              const walker = parent.walker();
              let event = walker.next();

              while (event) {
                const { node, entering } = event;

                if (entering) {
                  markInfo = markInfo.concat(getMarkForAdding(node, toastMark));
                }
                event = walker.next();
              }
            }
          } else if (removedNodeRange) {
            const startLine = Math.max(removedNodeRange.line[0], 1);

            // remove code block, custom block background when there are no adding nodes
            markInfo = markInfo.concat(
              createBlockForRemovingBackground([startLine, 1], [startLine + 1, 1])
            );
          }
        });
        appendMarkTr(newTr, schema, markInfo);
      }
      return newTr.setMeta('widget', tr.getMeta('widget'));
    },
  });
}

function createBlockForRemovingBackground(start: MdPos, end: MdPos) {
  return {
    start,
    end,
    lineBackground: true,
    spec: {
      attrs: {
        codeStart: null,
        codeEnd: null,
        className: null,
      },
    },
  };
}

function appendMarkTr(tr: Transaction, schema: Schema, marks: MarkInfo[]) {
  const { doc } = tr;
  const { paragraph } = schema.nodes;

  // get start position per line for lazy calculation
  const startPosListPerLine = getStartPosListPerLine(doc, doc.childCount);

  marks.forEach(({ start, end, spec, lineBackground }) => {
    const startIndex = Math.min(start[0], doc.childCount) - 1;
    const endIndex = Math.min(end[0], doc.childCount) - 1;
    const startNode = doc.child(startIndex);
    const endNode = doc.child(endIndex);

    // calculate the position corresponding to the line
    let from = startPosListPerLine[startIndex];
    let to = startPosListPerLine[endIndex];

    // calculate the position corresponding to the character offset of the line
    from += start[1] + getWidgetNodePos(startNode, start[1] - 1);
    to += end[1] + getWidgetNodePos(endNode, end[1] - 1);

    if (spec) {
      if (lineBackground) {
        tr.setBlockType(from, to, paragraph, { codeStart: start, codeEnd: end, ...spec.attrs });
      } else {
        tr.addMark(from, to, schema.mark(spec.type!, spec.attrs));
      }
    } else {
      tr.removeMark(from, to);
    }
  });
}

function getMarkForRemoving({ doc }: Transaction, nodes: MdNode[]) {
  const [start] = nodes[0].sourcepos!;
  const [, end] = last(nodes).sourcepos!;
  const startPos: MdPos = [start[0], start[1]];
  const endPos: MdPos = [end[0], end[1] + 1];
  const marks: MarkInfo[] = [];

  const skipLines: number[] = [];

  // remove code block, custom block background
  for (let i = start[0] - 1; i < end[0]; i += 1) {
    const node = doc.child(i);
    const { codeStart, codeEnd } = node.attrs as CodeBlockPos;

    if (codeStart && codeEnd && !includes(skipLines, codeStart[0])) {
      skipLines.push(codeStart[0]);
      codeEnd[0] = Math.min(codeEnd[0], doc.childCount);

      marks.push(createBlockForRemovingBackground(codeStart, codeEnd));
    }
  }
  marks.push({ start: startPos, end: endPos });

  return marks;
}

function getMarkForAdding(node: MdNode, toastMark: ToastMark) {
  const lineTexts = toastMark.getLineTexts();
  const startPos: MdPos = [getMdStartLine(node), getMdStartCh(node)];
  const endPos: MdPos = [getMdEndLine(node), getMdEndCh(node) + 1];
  const markInfo = getMarkInfo(node, startPos, endPos, lineTexts[endPos[0] - 1]);

  return markInfo ?? [];
}
