import { Node as ProsemirrorNode } from 'prosemirror-model';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { isListNode } from '@/utils/markdown';
import { ListItemMdNode, MdNode } from '@t/markdown';
import { nbspToSpace } from './pos';

interface CurNodeInfo {
  toastMark: ToastMark;
  mdNode: MdNode;
  line: number;
  doc: ProsemirrorNode;
  range: [number, number];
}

type ListType = 'bullet' | 'ordered';
type ToListFn = (
  curNodeInfo: CurNodeInfo
) => {
  changedTexts: string[];
  firstListOffset?: number;
  lastListOffset?: number;
  lastListLine?: number;
};
interface ToList {
  bullet: ToListFn;
  ordered: ToListFn;
  task: ToListFn;
}

const reList = /([*-] |[\d]+\. )/;
const reBulletTaskList = /([-*])( \[[ xX]]) /;
const reOrderedList = /([\d])+\.( \[[ xX]])? /;
const reTaskList = /([-*] |[\d]+\. )(\[[ xX]] )/;
const reCanBeTaskList = /([-*]|[\d]+\.)( \[[ xX]])? /;

function getListDepth(mdNode: MdNode) {
  let depth = 0;

  while (mdNode && mdNode.type !== 'document') {
    if (mdNode.type === 'list') {
      depth += 1;
    }
    mdNode = mdNode.parent!;
  }
  return depth;
}

function findSameDepthList(
  toastMark: ToastMark,
  currentLine: number,
  depth: number,
  backward: boolean
) {
  const lineLen = toastMark.getLineTexts().length;
  const result = [];
  let line = currentLine;

  while (backward ? line < lineLen : line > 1) {
    line = backward ? line + 1 : line - 1;
    const mdNode = toastMark.findFirstNodeAtLine(line);
    const currentListDepth = getListDepth(mdNode);

    if (currentListDepth !== depth) {
      break;
    }

    result.push({ line, depth, mdNode });
  }

  return result;
}

function getSameDepthListInfo(toastMark: ToastMark, mdNode: MdNode, line: number) {
  const depth = getListDepth(mdNode);

  const backwardList = findSameDepthList(toastMark, line, depth, false).reverse();
  const forwardList = findSameDepthList(toastMark, line, depth, true);
  const sameDepthListInfo = backwardList.concat([{ line, depth, mdNode }]).concat(forwardList);

  return sameDepthListInfo;
}

function textToBullet(text: string, mdNode: ListItemMdNode) {
  if (!isListNode(mdNode)) {
    return `* ${text.trim()}`;
  }

  const { type, task } = mdNode.listData;

  if (type === 'bullet' && task) {
    text = nbspToSpace(text).replace(reBulletTaskList, '$1 ');
  } else if (type === 'ordered') {
    text = nbspToSpace(text).replace(reOrderedList, '* ');
  }

  return text;
}

function textToOrdered(text: string, mdNode: ListItemMdNode, ordinalNum: number) {
  if (!isListNode(mdNode)) {
    return `${ordinalNum}. ${text.trim()}`;
  }

  const { type, task } = mdNode.listData;

  if (type === 'bullet' || (type === 'ordered' && task)) {
    text = nbspToSpace(text).replace(reCanBeTaskList, `${ordinalNum}. `);
  } else if (type === 'ordered' && parseInt(RegExp.$1, 10) !== ordinalNum) {
    text = nbspToSpace(text).replace(reOrderedList, `${ordinalNum}. `);
  }

  return text;
}

function getTextByMdLine(doc: ProsemirrorNode, mdLine: number) {
  return doc.content.child(mdLine - 1).textContent;
}

function toBulletOrOrdered(type: ListType, { toastMark, mdNode, doc, line }: CurNodeInfo) {
  const changedTexts: string[] = [];
  let firstListOffset = Number.MAX_VALUE;
  let lastListOffset = 0;
  let lastListLine = line;

  const sameDepthListInfo = getSameDepthListInfo(toastMark, mdNode, line);

  sameDepthListInfo.forEach(({ line: targetLine, mdNode: targetNode }, index) => {
    let text = getTextByMdLine(doc, targetLine);

    // @ts-ignore
    doc.descendants((node, pos, _, lineOffset) => {
      if (node.isBlock && targetLine === lineOffset + 1) {
        firstListOffset = Math.min(pos + 1, firstListOffset);
        lastListOffset = Math.max(pos + 1, lastListOffset);
      }
      return lineOffset + 1 <= targetLine;
    });

    text =
      type === 'bullet'
        ? textToBullet(text, targetNode)
        : textToOrdered(text, targetNode, index + 1);
    changedTexts.push(text);
    lastListLine = Math.max(targetLine, lastListLine);
  });

  return { changedTexts, firstListOffset, lastListOffset, lastListLine };
}

export const otherListToList: ToList = {
  bullet(currentLineInfo) {
    return toBulletOrOrdered('bullet', currentLineInfo);
  },
  ordered(currentLineInfo) {
    return toBulletOrOrdered('ordered', currentLineInfo);
  },
  task({ mdNode, doc, line }) {
    const changedTexts: string[] = [];
    let text = getTextByMdLine(doc, line);

    if ((mdNode as ListItemMdNode).listData.task) {
      text = nbspToSpace(text).replace(reTaskList, '$1');
    } else if (isListNode(mdNode)) {
      text = nbspToSpace(text).replace(reList, '$1[ ] ');
    }
    changedTexts.push(text);

    return { changedTexts };
  }
};

export const otherToList: ToList = {
  bullet({ doc, line }) {
    const text = getTextByMdLine(doc, line);
    const changedTexts = [`* ${text}`];

    return { changedTexts };
  },
  ordered({ toastMark, doc, line, range }) {
    let ordinalNum = 1;
    const [startLine] = range;
    const text = getTextByMdLine(doc, line);
    let ordinalStartNum = 1;
    let ordinalStartLine = startLine;

    for (let i = startLine - 1; i > 0; i -= 1) {
      const mdNode: ListItemMdNode = toastMark.findFirstNodeAtLine(i);
      const { listData } = mdNode;
      const depth = getListDepth(mdNode);

      if (depth === 0) {
        ordinalStartLine = i;
        break;
      }
      if (depth === 1 && listData && listData.type === 'ordered') {
        ordinalStartNum = listData.start;
        ordinalStartLine = i;
        break;
      }
    }
    ordinalNum = ordinalStartNum + line - ordinalStartLine;

    const changedTexts = [`${ordinalNum}. ${text}`];

    return { changedTexts };
  },
  task({ doc, line }) {
    const text = getTextByMdLine(doc, line);
    const changedTexts = [`* [ ] ${text}`];

    return { changedTexts };
  }
};
