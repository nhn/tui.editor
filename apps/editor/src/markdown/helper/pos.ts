import { AllSelection, Selection, Transaction } from 'prosemirror-state';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { MdPos, MdSourcepos } from '@t/markdown';

export function resolveSelectionPos(selection: Selection) {
  const { from, to } = selection;

  if (selection instanceof AllSelection) {
    return resolvePos(from, to);
  }
  return [from, to];
}

export function resolvePos(from: number, to: number) {
  return [from + 1, to - 1];
}

export function getEditorToMdPos(
  from: number,
  to: number,
  doc: ProsemirrorNode,
  collapsed: boolean
): MdSourcepos {
  const fragment = doc.content;
  const startResolvedPos = doc.resolve(from);
  // @ts-ignore
  const startLine = fragment.findIndex(from).index + 1;
  // @ts-ignore
  const endLine = from === to ? startLine : fragment.findIndex(to).index + 1;
  const startOffset = startResolvedPos.start();
  const endOffset = collapsed ? startResolvedPos.end() : doc.resolve(to).end();

  return [
    [startLine, startOffset],
    [endLine, endOffset]
  ];
}

export function getMdToEditorPos(
  startPos: MdPos,
  endPos: MdPos,
  lineTexts: string[],
  docSize: number
) {
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

  return [from, Math.min(to, docSize)];
}

export function getExtendedRangeOffset(from: number, to: number, doc: ProsemirrorNode) {
  const startResolvedPos = doc.resolve(from);
  const startOffset = startResolvedPos.start();
  const endOffset = from === to ? startResolvedPos.end() : doc.resolve(to).end();

  return [startOffset, endOffset];
}

export function replaceBlockNodes(
  tr: Transaction,
  from: number,
  to: number,
  nodes: ProsemirrorNode[]
) {
  return (
    tr
      .replaceWith(from - 1, to + 1, nodes)
      // To prevent incorrect calculation of the position for markdown parser
      .setMeta('resolvedPos', [from, to])
  );
}

export function nbspToSpace(text: string) {
  return text.replace(/\u00a0/g, ' ');
}

export function spaceToNbsp(text: string) {
  return text.replace(/ /g, '\u00a0');
}
