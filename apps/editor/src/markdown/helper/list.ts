import { ProsemirrorNode } from 'prosemirror-model';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { isListNode } from '@/utils/markdown';
import { ListItemMdNode, MdNode } from '@t/markdown';
import { nbspToSpace } from './manipulation';

export type ToListContext = {
  mdNode: ListItemMdNode;
  line: number;
  toastMark: ToastMark;
  doc: ProsemirrorNode;
  range: [number, number];
};

export type ExtendListContext = Omit<ToListContext, 'range'>;

export interface ChangedListInfo {
  line: number;
  text: string;
}

interface ToListResult {
  changedResults: ChangedListInfo[];
  firstListOffset?: number;
  lastListOffset?: number;
}

type ExtendedResult = {
  listSyntax: string;
  orderedList?: ChangedListInfo[];
  lastListOffset?: number;
};

type ListType = 'bullet' | 'ordered';

type ToListFn = (context: ToListContext) => ToListResult;
type ExtendListFn = (context: ExtendListContext) => ExtendedResult;

interface ItemInfo {
  line: number;
  depth: number;
  mdNode: ListItemMdNode;
}

interface ToList {
  bullet: ToListFn;
  ordered: ToListFn;
  task: ToListFn;
}

interface ExtendList {
  bullet: ExtendListFn;
  ordered: ExtendListFn;
}

export const reList = /([*-] |[\d]+\. )/;
const reTaskList = /([-*] |[\d]+\. )(\[[ xX]] )/;
const reBulletTaskList = /([-*])( \[[ xX]]) /;
const reOrderedList = /([\d])+\.( \[[ xX]])? /;
const reCanBeTaskList = /([-*]|[\d]+\.)( \[[ xX]])? /;

export function getListType(text: string): ListType {
  return reOrderedList.test(text) ? 'ordered' : 'bullet';
}

export function getTextByMdLine(doc: ProsemirrorNode, mdLine: number) {
  return nbspToSpace(doc.content.child(mdLine - 1).textContent);
}

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
): ItemInfo[] {
  const lineTexts = toastMark.getLineTexts();
  const lineLen = lineTexts.length;
  const result = [];
  let line = currentLine;

  while (backward ? line < lineLen : line > 1) {
    line = backward ? line + 1 : line - 1;
    const mdNode: ListItemMdNode = toastMark.findFirstNodeAtLine(line);
    const currentListDepth = getListDepth(mdNode);

    if (currentListDepth === depth) {
      result.push({ line, depth, mdNode });
    } else if (currentListDepth < depth) {
      break;
    }
  }

  return result;
}

function getSameDepthItems({ toastMark, mdNode, line }: ToListContext) {
  const depth = getListDepth(mdNode);
  const forwardList = findSameDepthList(toastMark, line, depth, false).reverse();
  const backwardList = findSameDepthList(toastMark, line, depth, true);

  return forwardList.concat([{ line, depth, mdNode }]).concat(backwardList);
}

function textToBullet(text: string, mdNode: ListItemMdNode) {
  if (!reList.test(text)) {
    return `* ${text}`;
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
    return `${ordinalNum}. ${text}`;
  }

  const { type, task } = mdNode.listData;

  if (type === 'bullet' || (type === 'ordered' && task)) {
    text = text.replace(reCanBeTaskList, `${ordinalNum}. `);
  } else if (type === 'ordered' && parseInt(RegExp.$1, 10) !== ordinalNum) {
    text = text.replace(reOrderedList, `${ordinalNum}. `);
  }

  return text;
}

function getChangedInfo(
  doc: ProsemirrorNode,
  sameDepthItems: ItemInfo[],
  type: ListType,
  start = 0
): ToListResult {
  let firstListOffset = Number.MAX_VALUE;
  let lastListOffset = 0;

  const changedResults = sameDepthItems.map(({ line, mdNode }, index) => {
    doc.descendants((node, pos, _, nodeIndex) => {
      if (node.isBlock && line === nodeIndex! + 1) {
        firstListOffset = Math.min(pos + 1, firstListOffset);
        lastListOffset = Math.max(pos + 1, lastListOffset);
      }
      return nodeIndex! + 1 <= line;
    });

    let text = getTextByMdLine(doc, line);

    text =
      type === 'bullet'
        ? textToBullet(text, mdNode)
        : textToOrdered(text, mdNode, index + 1 + start);

    return { text, line };
  });

  return { changedResults, firstListOffset, lastListOffset };
}

function toBulletOrOrdered(type: ListType, context: ToListContext) {
  const sameDepthListInfo = getSameDepthItems(context);

  return getChangedInfo(context.doc, sameDepthListInfo, type);
}

export const otherListToList: ToList = {
  bullet(context) {
    return toBulletOrOrdered('bullet', context);
  },
  ordered(context) {
    return toBulletOrOrdered('ordered', context);
  },
  task({ mdNode, doc, line }) {
    const changedResults = [];
    let text = getTextByMdLine(doc, line);

    if (mdNode.listData.task) {
      text = text.replace(reTaskList, '$1');
    } else if (isListNode(mdNode)) {
      text = text.replace(reList, '$1[ ] ');
    }
    changedResults.push({ text, line });

    return { changedResults };
  }
};

export const otherNodeToList: ToList = {
  bullet({ doc, line }) {
    const text = getTextByMdLine(doc, line);
    const changedResults = [{ text: `* ${text}`, line }];

    return { changedResults };
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

    const changedResults = [{ text: `${ordinalNum}. ${text}`, line }];

    return { changedResults };
  },
  task({ doc, line }) {
    const text = getTextByMdLine(doc, line);
    const changedResults = [{ text: `* [ ] ${text}`, line }];

    return { changedResults };
  }
};

export const extendList: ExtendList = {
  bullet({ line, doc, mdNode }: ExtendListContext) {
    const text = getTextByMdLine(doc, line);
    const indent = text.substring(0, text.indexOf('*'));
    const bullet = textToBullet(mdNode.listData.task ? '[ ] ' : '', mdNode);
    const listSyntax = indent + bullet;

    return { listSyntax };
  },
  ordered({ toastMark, line, mdNode, doc }: ExtendListContext) {
    const depth = getListDepth(mdNode);
    const ordinalNum = mdNode.listData.start + 1;

    const text = getTextByMdLine(doc, line);
    const indent = text.substring(0, text.search(/[\d]+\./));
    const ordered = textToOrdered(mdNode.listData.task ? '[ ] ' : '', mdNode, ordinalNum);
    const listSyntax = indent + ordered;

    const backward = findSameDepthList(toastMark, line, depth, true).filter(
      info => info.mdNode.listData.type === 'ordered' && getTextByMdLine(doc, info.line).trim()
    );

    const { changedResults, lastListOffset } = getChangedInfo(doc, backward, 'ordered', ordinalNum);

    return { listSyntax, lastListOffset, orderedList: changedResults };
  }
};
