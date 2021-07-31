import { AllSelection, Selection } from 'prosemirror-state';
import { ProsemirrorNode, ResolvedPos } from 'prosemirror-model';
import { Sourcepos, MdPos } from '@toast-ui/toastmark';
import { isWidgetNode } from '@/widget/widgetNode';

export function resolveSelectionPos(selection: Selection) {
  const { from, to } = selection;

  if (selection instanceof AllSelection) {
    return [from + 1, to - 1];
  }
  return [from, to];
}

function getMdLine(resolvedPos: ResolvedPos) {
  return resolvedPos.index(0) + 1;
}

export function getWidgetNodePos(node: ProsemirrorNode, chPos: number, direction: 1 | -1 = 1) {
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
  const startLine = getMdLine(startResolvedPos);
  let endLine = startLine;

  const startOffset = startResolvedPos.start(1);
  let endOffset = startOffset;

  if (!collapsed) {
    // prevent the end offset from pointing to the root document position
    const endResolvedPos = doc.resolve(to === doc.content.size ? to - 1 : to);

    endOffset = endResolvedPos.start(1);
    endLine = getMdLine(endResolvedPos);

    // To resolve the end offset excluding document tag size
    if (endResolvedPos.pos === doc.content.size) {
      to = doc.content.size - 2;
    }
  }

  const startCh = Math.max(from - startOffset + 1, 1);
  const endCh = Math.max(to - endOffset + 1, 1);

  return [
    [startLine, startCh + getWidgetNodePos(doc.child(startLine - 1), startCh, -1)],
    [endLine, endCh + getWidgetNodePos(doc.child(endLine - 1), endCh, -1)],
  ];
}

export function getStartPosListPerLine(doc: ProsemirrorNode, endIndex: number) {
  const startPosListPerLine: number[] = [];

  for (let i = 0, pos = 0; i < endIndex; i += 1) {
    const child = doc.child(i);

    startPosListPerLine[i] = pos;
    pos += child.nodeSize;
  }

  return startPosListPerLine;
}

export function getMdToEditorPos(doc: ProsemirrorNode, startPos: MdPos, endPos: MdPos) {
  const startPosListPerLine = getStartPosListPerLine(doc, endPos[0]);
  const startIndex = startPos[0] - 1;
  const endIndex = endPos[0] - 1;
  const startNode = doc.child(startIndex);
  const endNode = doc.child(endIndex);

  // calculate the position corresponding to the line
  let from = startPosListPerLine[startIndex];
  let to = startPosListPerLine[endIndex];

  // calculate the position corresponding to the character offset of the line
  from += startPos[1] + getWidgetNodePos(startNode, startPos[1] - 1);
  to += endPos[1] + getWidgetNodePos(endNode, endPos[1] - 1);

  return [from, Math.min(to, doc.content.size)];
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

export function getNodeContentOffsetRange(doc: ProsemirrorNode, targetIndex: number) {
  let startOffset = 1;
  let endOffset = 1;

  for (let i = 0, offset = 0; i < doc.childCount; i += 1) {
    const { nodeSize } = doc.child(i);

    // calculate content start, end offset(not node offset)
    startOffset = offset + 1;
    endOffset = offset + nodeSize - 1;

    if (i === targetIndex) {
      break;
    }

    offset += nodeSize;
  }
  return { startOffset, endOffset };
}
