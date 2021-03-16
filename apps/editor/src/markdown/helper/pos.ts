import { AllSelection, Selection } from 'prosemirror-state';
import { ProsemirrorNode } from 'prosemirror-model';
import { Sourcepos, MdPos, ToastMark } from '@toast-ui/toastmark';
import { isWidgetNode } from '@/widget/widgetNode';
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

function getWidgetNodePos(node: ProsemirrorNode, chPos: number, direction: 1 | -1 = 1) {
  let additionalPos = 0;

  node.forEach((child, pos) => {
    // add or subtract widget node tag
    if (isWidgetNode(child) && pos + 2 < chPos) {
      additionalPos += 2 * direction;
    }
  });

  return additionalPos;
}

export function getEditorToMdPos(doc: ProsemirrorNode, from: number, to = from): Sourcepos {
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

    // prevent the end offset from pointing to the root document position
    if (to === doc.content.size) {
      endResolvedPos = doc.resolve(to - 1);
    }

    endOffset = endResolvedPos.start();

    // To resolve the end offset excluding document tag size
    if (endResolvedPos.pos === doc.content.size) {
      to = doc.content.size - 2;
    }
  }

  const startCh = Math.max(from - startOffset + 1, 1);
  const endCh = Math.max(to - endOffset + 1, 1);

  return [
    [lineRange[0], startCh + getWidgetNodePos(doc.child(lineRange[0] - 1), startCh, -1)],
    [lineRange[1], endCh + getWidgetNodePos(doc.child(lineRange[1] - 1), endCh, -1)],
  ];
}

export function getMdToEditorPos(
  doc: ProsemirrorNode,
  toastMark: ToastMark,
  startPos: MdPos,
  endPos: MdPos
) {
  const lineTexts = toastMark.getLineTexts();
  let from = 0;
  let to = 0;

  for (let i = 0; i < endPos[0] - 1; i += 1) {
    const len = lineTexts[i].length;
    const child = doc.child(i);
    const additionalPos = getWidgetNodePos(child, child.content.size);

    // should plus 2(end tag, start tag) to consider line breaking
    if (i < startPos[0] - 1) {
      from += len + 2 + additionalPos;
    }

    to += len + 2 + additionalPos;
  }

  const startNode = doc.child(startPos[0] - 1);
  const endNode = doc.child(endPos[0] - 1);

  from += startPos[1] + getWidgetNodePos(startNode, startPos[1] - 1);
  to += endPos[1] + getWidgetNodePos(endNode, endPos[1] - 1);

  return [from, Math.min(to, doc.content.size)];
}

export function getExtendedRangeOffset(from: number, to: number, doc: ProsemirrorNode) {
  const startResolvedPos = doc.resolve(from);
  const startOffset = startResolvedPos.start();
  const endOffset = from === to ? startResolvedPos.end() : doc.resolve(to).end();

  return [startOffset, endOffset];
}

export function getRangeInfo(selection: Selection) {
  let { $from, $to } = selection;
  const { from, to } = selection;
  const { doc } = $from;

  if (selection instanceof AllSelection) {
    $from = doc.resolve(from + 1);
    $to = doc.resolve(to - 1);
  }
  if ($from.depth === 0) {
    $from = doc.resolve(from - 1);
    $to = $from;
  }

  return {
    startFromOffset: $from.start(1),
    endFromOffset: $to.start(1),
    startToOffset: $from.end(1),
    endToOffset: $to.end(1),
    startIndex: $from.index(0),
    endIndex: $to.index(0),
    from: $from.pos,
    to: $to.pos,
  };
}

export function getNodeOffsetRange(doc: ProsemirrorNode, targetIndex: number) {
  let startOffset = 1;
  let endOffset = 1;

  for (let i = 0, offset = 0; i < doc.childCount; i += 1) {
    const { nodeSize } = doc.child(i);

    startOffset = offset + 1;
    endOffset = offset + nodeSize;

    if (i === targetIndex) {
      break;
    }

    offset += nodeSize;
  }
  return { startOffset, endOffset };
}
