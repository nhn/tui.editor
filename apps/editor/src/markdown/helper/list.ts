import { Fragment } from 'prosemirror-model';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { isListNode } from '@/utils/markdown';
import { ListItemMdNode, MdNode } from '@t/markdown';
import { nbspToSpace } from './pos';

interface CurNodeInfo {
  toastMark: ToastMark;
  mdNode: MdNode;
  line: number;
  fragment: Fragment;
}

type ListType = 'bullet' | 'ordered';
type ToListFn = (
  curNodeInfo: CurNodeInfo
) => { changedTexts: string[]; firstSameLine?: number; lastSameLine?: number };

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
  } else if (type === 'ordered') {
    if (parseInt(RegExp.$1, 10) !== ordinalNum) {
      text = nbspToSpace(text).replace(reOrderedList, `${ordinalNum}. `);
    }
  }

  return text;
}

function getTextByMdLine(fragment: Fragment, mdLine: number) {
  return fragment.child(mdLine - 1).textContent;
}

function toBulletOrOrdered(type: ListType, { toastMark, mdNode, fragment, line }: CurNodeInfo) {
  const changedTexts: string[] = [];
  let firstSameLine = line;
  let lastSameLine = line;

  const sameDepthListInfo = getSameDepthListInfo(toastMark, mdNode, line);

  sameDepthListInfo.forEach(({ line: targetLine, mdNode: targetNode }, index) => {
    let text = getTextByMdLine(fragment, targetLine);

    text =
      type === 'bullet'
        ? textToBullet(text, targetNode)
        : textToOrdered(text, targetNode, index + 1);
    changedTexts.push(text);
    firstSameLine = Math.min(targetLine, firstSameLine);
    lastSameLine = Math.max(targetLine, lastSameLine);
  });

  return { changedTexts, firstSameLine, lastSameLine };
}

export const otherListToList: ToList = {
  bullet({ toastMark, mdNode, fragment, line }) {
    return toBulletOrOrdered('bullet', { toastMark, mdNode, fragment, line });
  },
  ordered({ toastMark, mdNode, fragment, line }) {
    return toBulletOrOrdered('ordered', { toastMark, mdNode, fragment, line });
  },
  task({ mdNode, fragment, line }) {
    const changedTexts: string[] = [];
    let text = fragment.child(line - 1).textContent;

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
  bullet({ fragment, line }) {
    const text = getTextByMdLine(fragment, line);
    const changedTexts: string[] = [`* ${text}`];

    return { changedTexts };
  },
  ordered({ toastMark, fragment, line }) {
    let ordinalNum = 1;
    const text = getTextByMdLine(fragment, line);

    for (let i = line - 1; i >= 0; i -= 1) {
      const mdNode: ListItemMdNode = toastMark.findFirstNodeAtLine(i);
      const depth = getListDepth(mdNode);

      if (depth === 0) {
        break;
      }
      if (depth === 1 && mdNode.listData.type === 'ordered') {
        ordinalNum = mdNode.listData.start + 1;
        break;
      }
    }
    const changedTexts = [`${ordinalNum}. ${text}`];

    return { changedTexts };
  },
  task({ fragment, line }) {
    const text = getTextByMdLine(fragment, line);
    const changedTexts = [`* [ ] ${text}`];

    return { changedTexts };
  }
};
