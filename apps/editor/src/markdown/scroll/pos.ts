import { ProsemirrorNode } from 'prosemirror-model';
import { MdNode } from '@t/markdown';
import { getMdEndLine, getMdStartLine, isMultiLineNode } from '@/utils/markdown';

export function isBlankLine(doc: ProsemirrorNode, index: number) {
  const pmNode = doc.child(index);

  return !pmNode.childCount || (pmNode.childCount === 1 && !pmNode.firstChild!.text?.trim());
}

export function getMultiLineHeightInfo(mdNode: MdNode, index: number, children: HTMLCollection) {
  const node = children[index];
  let rect = node.getBoundingClientRect();
  let height = node.clientHeight;

  if (isMultiLineNode(mdNode)) {
    const start = getMdStartLine(mdNode) - 1;
    const end = getMdEndLine(mdNode);
    let totalHeight = 0;

    for (let i = start; i < end; i += 1) {
      totalHeight += children[i].clientHeight;
    }

    height = totalHeight;
    rect = children[start].getBoundingClientRect();
  }

  return { height, rect };
}

export function getNextNonBlankElement(mdNode: MdNode) {
  let { next, parent } = mdNode;

  while (!next && parent) {
    next = parent.next;
    parent = parent.parent;
  }
  return next ? document.querySelector<HTMLElement>(`[data-nodeid="${next.id}"]`) : null;
}

export function getEditorRangeHeightInfo(
  doc: ProsemirrorNode,
  mdNode: MdNode,
  children: HTMLCollection
) {
  const start = getMdStartLine(mdNode) - 1;
  const end = getMdEndLine(mdNode) - 1;
  const rect = (children[start] as HTMLElement).getBoundingClientRect();

  const height =
    (children[end] as HTMLElement).offsetTop -
    (children[start] as HTMLElement).offsetTop +
    children[end].clientHeight;

  return {
    height:
      height <= 0
        ? children[start].clientHeight
        : height + getBlankLinesHeight(doc, children, Math.min(end + 1, doc.childCount - 1)),
    rect
  };
}

function getBlankLinesHeight(
  doc: ProsemirrorNode,
  children: HTMLCollection,
  start: number,
  end = doc.childCount - 1
) {
  let height = 0;

  while (start <= end && isBlankLine(doc, start)) {
    height += children[start].clientHeight;
    start += 1;
  }
  return height;
}
