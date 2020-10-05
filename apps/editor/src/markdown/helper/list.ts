import { ProsemirrorNode } from 'prosemirror-model';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { isListNode } from '@/utils/markdown';
import { ListItemMdNode, MdNode } from '@t/markdown';
import { nbspToSpace } from './manipulation';

export interface CurNodeInfo {
  toastMark: ToastMark;
  mdNode: MdNode;
  line: number;
  doc: ProsemirrorNode;
  range: [number, number];
}

export interface ChangedInfo {
  line: number;
  text: string;
}

type ListType = 'bullet' | 'ordered';
type ToListFn = (
  curNodeInfo: CurNodeInfo
) => {
  changedInfo: ChangedInfo[];
  firstListOffset?: number;
  lastListOffset?: number;
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
  const lineTexts = toastMark.getLineTexts();
  const lineLen = lineTexts.length;
  const result = [];
  let line = currentLine;

  while (backward ? line < lineLen : line > 1) {
    line = backward ? line + 1 : line - 1;
    const mdNode = toastMark.findFirstNodeAtLine(line);
    const currentListDepth = getListDepth(mdNode);

    if (currentListDepth === depth) {
      result.push({ line, depth, mdNode });
    } else if (currentListDepth < depth) {
      break;
    }
  }

  return result;
}

function getSameDepthListInfo({ toastMark, mdNode, line }: CurNodeInfo) {
  const depth = getListDepth(mdNode);
  const forwardList = findSameDepthList(toastMark, line, depth, false).reverse();
  const backwardList = findSameDepthList(toastMark, line, depth, true);

  return forwardList.concat([{ line, depth, mdNode }]).concat(backwardList);
}

function textToBullet(text: string, mdNode: ListItemMdNode) {
  if (!reList.test(text)) {
    return `* ${text.trim()}`;
  }

  const { type, task } = mdNode.listData;

  if (type === 'bullet' && task) {
    text = text.replace(reBulletTaskList, '$1 ');
  } else if (type === 'ordered') {
    text = text.replace(reOrderedList, '* ');
  }

  return text;
}

function textToOrdered(text: string, mdNode: ListItemMdNode, ordinalNum: number) {
  if (!reList.test(text)) {
    return `${ordinalNum}. ${text.trim()}`;
  }

  const { type, task } = mdNode.listData;

  if (type === 'bullet' || (type === 'ordered' && task)) {
    text = text.replace(reCanBeTaskList, `${ordinalNum}. `);
  } else if (type === 'ordered' && parseInt(RegExp.$1, 10) !== ordinalNum) {
    text = text.replace(reOrderedList, `${ordinalNum}. `);
  }

  return text;
}

function getTextByMdLine(doc: ProsemirrorNode, mdLine: number) {
  return nbspToSpace(doc.content.child(mdLine - 1).textContent);
}

function toBulletOrOrdered(type: ListType, curNodeInfo: CurNodeInfo) {
  const { doc } = curNodeInfo;
  const changedInfo: ChangedInfo[] = [];
  let firstListOffset = Number.MAX_VALUE;
  let lastListOffset = 0;

  const sameDepthListInfo = getSameDepthListInfo(curNodeInfo);

  sameDepthListInfo.forEach(({ line: targetLine, mdNode: targetNode }, index) => {
    doc.descendants((node, pos, _, lineOffset) => {
      if (node.isBlock && targetLine === lineOffset! + 1) {
        firstListOffset = Math.min(pos + 1, firstListOffset);
        lastListOffset = Math.max(pos + 1, lastListOffset);
      }
      return lineOffset! + 1 <= targetLine;
    });
    let text = getTextByMdLine(doc, targetLine);

    text =
      type === 'bullet'
        ? textToBullet(text, targetNode)
        : textToOrdered(text, targetNode, index + 1);
    changedInfo.push({ text, line: targetLine });
  });

  return { changedInfo, firstListOffset, lastListOffset };
}

export const otherListToList: ToList = {
  bullet(currentLineInfo) {
    return toBulletOrOrdered('bullet', currentLineInfo);
  },
  ordered(currentLineInfo) {
    return toBulletOrOrdered('ordered', currentLineInfo);
  },
  task({ mdNode, doc, line }) {
    const changedInfo = [];
    let text = getTextByMdLine(doc, line);

    if ((mdNode as ListItemMdNode).listData.task) {
      text = text.replace(reTaskList, '$1');
    } else if (isListNode(mdNode)) {
      text = text.replace(reList, '$1[ ] ');
    }
    changedInfo.push({ text, line });

    return { changedInfo };
  }
};

export const otherNodeToList: ToList = {
  bullet({ doc, line }) {
    const text = getTextByMdLine(doc, line);
    const changedInfo = [{ text: `* ${text}`, line }];

    return { changedInfo };
  },
  ordered({ toastMark, doc, line, range }) {
    let ordinalNum = 1;
    const [startLine] = range;
    const text = getTextByMdLine(doc, line);
    let ordinalStartNum = 1;
    let ordinalStartLine = startLine;

    for (let i = startLine - 1; i > 0; i -= 1) {
      const mdNode: ListItemMdNode = toastMark.findFirstNodeAtLine(i);

      if (mdNode) {
        const { listData } = mdNode;
        const depth = getListDepth(mdNode);

        if (depth === 0) {
          break;
        }
        if (depth === 1 && listData && listData.type === 'ordered') {
          ordinalStartNum = listData.start;
          ordinalStartLine = i;
          break;
        }
      }
    }
    ordinalNum = ordinalStartNum + line - ordinalStartLine;

    const changedInfo = [{ text: `${ordinalNum}. ${text}`, line }];

    return { changedInfo };
  },
  task({ doc, line }) {
    const text = getTextByMdLine(doc, line);
    const changedInfo = [{ text: `* [ ] ${text}`, line }];

    return { changedInfo };
  }
};
