import { AllSelection, Selection } from 'prosemirror-state';
import { ProsemirrorNode } from 'prosemirror-model';
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

export function getEditorToMdLine(
  from: number,
  to: number,
  doc: ProsemirrorNode
): [number, number] {
  const fragment = doc.content;
  const startLine = fragment.findIndex(from).index + 1;
  const endLine =
    from === to ? startLine : Math.min(fragment.findIndex(to).index + 1, fragment.childCount);

  return [startLine, endLine];
}

export function getEditorToMdPos(from: number, to: number, doc: ProsemirrorNode): MdSourcepos {
  const collapsed = from === to;
  const startResolvedPos = doc.resolve(from);

  const [startLine, endLine] = getEditorToMdLine(from, to, doc);
  const startOffset = startResolvedPos.start();
  const endOffset = collapsed ? startOffset : doc.resolve(to).start();

  return [
    [startLine, from - startOffset + 1],
    [endLine, to - endOffset + 1]
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

  for (let i = 0; i < endPos[0] - 1; i += 1) {
    const len = lineTexts[i].length;

    // should plus 2(end tag, start tag) to consider line breaking
    if (i < startPos[0] - 1) {
      from += len + 2;
    }
    to += len + 2;
  }
  from += startPos[1];
  to += endPos[1];

  return [from, Math.min(to, docSize)];
}

export function getExtendedRangeOffset(from: number, to: number, doc: ProsemirrorNode) {
  const startResolvedPos = doc.resolve(from);
  const startOffset = startResolvedPos.start();
  const endOffset = from === to ? startResolvedPos.end() : doc.resolve(to).end();

  return [startOffset, endOffset];
}
