import { AllSelection, Selection } from 'prosemirror-state';
import { ProsemirrorNode } from 'prosemirror-model';
import { MdPos, MdSourcepos } from '@t/markdown';
import { getTextByMdLine } from './query';

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
  const { childCount } = fragment;

  const startLine = Math.min(fragment.findIndex(from).index + 1, childCount);
  const endLine = from === to ? startLine : Math.min(fragment.findIndex(to).index + 1, childCount);

  return [startLine, endLine];
}

function getEndOffsetWithBlankLine(doc: ProsemirrorNode, to: number, lineRange: [number, number]) {
  let blankLineTagOffset = 0;
  const [start, end] = lineRange;

  for (let line = start; line < end; line += 1) {
    if (!getTextByMdLine(doc, line)) {
      blankLineTagOffset += 1;
    }
  }

  return Math.min(doc.content.size, to + blankLineTagOffset);
}

export function getEditorToMdPos(doc: ProsemirrorNode, from: number, to = from): MdSourcepos {
  const collapsed = from === to;
  const startResolvedPos = doc.resolve(from);
  const lineRange = getEditorToMdLine(from, to, doc);

  const startOffset = startResolvedPos.start(1);
  let endOffset = startOffset;

  if (!collapsed) {
    // resolve the end offset for blank line
    if (lineRange[1] - lineRange[0] === 1) {
      to = getEndOffsetWithBlankLine(doc, to, lineRange);
    }

    let endResolvedPos = doc.resolve(to);

    // resolve the end start pos
    if (to === doc.content.size) {
      endResolvedPos = doc.resolve(to - 1);
    }

    endOffset = endResolvedPos.start();

    // To resolve the end offset excluding document tag size
    if (endResolvedPos.pos === doc.content.size) {
      to = doc.content.size - 2;
    }
  }

  return [
    [lineRange[0], Math.max(from - startOffset + 1, 1)],
    [lineRange[1], Math.max(to - endOffset + 1, 1)],
  ];
}

export function getMdToEditorPos(
  doc: ProsemirrorNode,
  toastMark: any,
  startPos: MdPos,
  endPos: MdPos
) {
  const lineTexts = toastMark.getLineTexts();
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

  return [from, Math.min(to, doc.content.size)];
}

export function getExtendedRangeOffset(from: number, to: number, doc: ProsemirrorNode) {
  const startResolvedPos = doc.resolve(from);
  const startOffset = startResolvedPos.start();
  const endOffset = from === to ? startResolvedPos.end() : doc.resolve(to).end();

  return [startOffset, endOffset];
}

export function getPosInfo(doc: ProsemirrorNode, selection: Selection, endCursor = false) {
  const [from, to] = resolveSelectionPos(selection);
  const resolvedFrom = endCursor ? to : from;
  const [startOffset, endOffset] = getExtendedRangeOffset(resolvedFrom, to, doc);
  const [startLine, endLine] = getEditorToMdLine(resolvedFrom, to, doc);

  return { from: resolvedFrom, to, startOffset, endOffset, startLine, endLine };
}
