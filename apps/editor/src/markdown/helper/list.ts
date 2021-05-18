import { ProsemirrorNode, Schema } from 'prosemirror-model';
import { ListItemMdNode, MdNode, ToastMark } from '@toast-ui/toastmark';
import { findClosestNode, isListNode, isOrderedListNode } from '@/utils/markdown';
import { createTextNode } from '@/helper/manipulation';
import { getTextByMdLine } from './query';

export interface ToListContext<T = ListItemMdNode> {
  mdNode: T;
  line: number;
  toastMark: ToastMark;
  doc: ProsemirrorNode;
  startLine: number;
}

export type ExtendListContext = Omit<ToListContext, 'startLine'>;

export interface ChangedListInfo {
  line: number;
  text: string;
}

interface ToListResult {
  changedResults: ChangedListInfo[];
  firstIndex?: number;
  lastIndex?: number;
}

type ExtendedResult = {
  listSyntax: string;
  changedResults?: ChangedListInfo[];
  lastIndex?: number;
};

type ListType = 'bullet' | 'ordered';
type ListToListFn = (context: ToListContext) => ToListResult;
type NodeToListFn = (context: ToListContext<MdNode>) => ToListResult;
type ExtendListFn = (context: ExtendListContext) => ExtendedResult;

interface ItemInfo {
  line: number;
  depth: number;
  mdNode: ListItemMdNode;
}

interface ListToList {
  bullet: ListToListFn;
  ordered: ListToListFn;
  task: ListToListFn;
}

interface NodeToList {
  bullet: NodeToListFn;
  ordered: NodeToListFn;
  task: NodeToListFn;
}

interface ExtendList {
  bullet: ExtendListFn;
  ordered: ExtendListFn;
}

export const reList = /(^\s*)([-*+] |[\d]+\. )/;
export const reOrderedList = /(^\s*)([\d])+\.( \[[ xX]])? /;
export const reOrderedListGroup = /^(\s*)((\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(.*)/;
export const reCanBeTaskList = /(^\s*)([-*+]|[\d]+\.)( \[[ xX]])? /;
const reBulletListGroup = /^(\s*)([-*+]+(\s(?:\[(?:x|\s)\]\s)?))(.*)/;
const reTaskList = /(^\s*)([-*+] |[\d]+\. )(\[[ xX]] )/;
const reBulletTaskList = /(^\s*)([-*+])( \[[ xX]]) /;

export function getListType(text: string): ListType {
  return reOrderedList.test(text) ? 'ordered' : 'bullet';
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
    const mdNode = toastMark.findFirstNodeAtLine(line) as ListItemMdNode;
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

function textToBullet(text: string) {
  if (!reList.test(text)) {
    return `* ${text}`;
  }
  const type = getListType(text);

  if (type === 'bullet' && reCanBeTaskList.test(text)) {
    text = text.replace(reBulletTaskList, '$1$2 ');
  } else if (type === 'ordered') {
    text = text.replace(reOrderedList, '$1* ');
  }

  return text;
}

function textToOrdered(text: string, ordinalNum: number) {
  if (!reList.test(text)) {
    return `${ordinalNum}. ${text}`;
  }
  const type = getListType(text);

  if (type === 'bullet' || (type === 'ordered' && reCanBeTaskList.test(text))) {
    text = text.replace(reCanBeTaskList, `$1${ordinalNum}. `);
  } else if (type === 'ordered') {
    // eslint-disable-next-line prefer-destructuring
    const start = reOrderedListGroup.exec(text)![3];

    if (Number(start) !== ordinalNum) {
      text = text.replace(reOrderedList, `$1${ordinalNum}. `);
    }
  }

  return text;
}

function getChangedInfo(
  doc: ProsemirrorNode,
  sameDepthItems: ItemInfo[],
  type: ListType,
  start = 0
): ToListResult {
  let firstIndex = Number.MAX_VALUE;
  let lastIndex = 0;

  const changedResults = sameDepthItems.map(({ line }, index) => {
    firstIndex = Math.min(line - 1, firstIndex);
    lastIndex = Math.max(line - 1, lastIndex);

    let text = getTextByMdLine(doc, line);

    text = type === 'bullet' ? textToBullet(text) : textToOrdered(text, index + 1 + start);

    return { text, line };
  });

  return { changedResults, firstIndex, lastIndex };
}

function getBulletOrOrdered(type: ListType, context: ToListContext) {
  const sameDepthListInfo = getSameDepthItems(context);

  return getChangedInfo(context.doc, sameDepthListInfo, type);
}

export const otherListToList: ListToList = {
  bullet(context) {
    return getBulletOrOrdered('bullet', context);
  },
  ordered(context) {
    return getBulletOrOrdered('ordered', context);
  },
  task({ mdNode, doc, line }) {
    let text = getTextByMdLine(doc, line);

    if (mdNode.listData.task) {
      text = text.replace(reTaskList, '$1$2');
    } else if (isListNode(mdNode)) {
      text = text.replace(reList, '$1$2[ ] ');
    }

    return { changedResults: [{ text, line }] };
  },
};

export const otherNodeToList: NodeToList = {
  bullet({ doc, line }) {
    const lineText = getTextByMdLine(doc, line);
    const changedResults = [{ text: `* ${lineText}`, line }];

    return { changedResults };
  },
  ordered({ toastMark, doc, line, startLine }) {
    const lineText = getTextByMdLine(doc, line);
    let firstOrderedListNum = 1;
    let firstOrderedListLine = startLine;
    let skipped = 0;

    for (let i = startLine - 1; i > 0; i -= 1) {
      const mdNode = toastMark.findFirstNodeAtLine(i)!;
      const text = getTextByMdLine(doc, i);
      const canBeListNode =
        text && !!findClosestNode(mdNode, (targetNode) => isListNode(targetNode));
      const searchResult = reOrderedListGroup.exec(getTextByMdLine(doc, i));

      if (!searchResult && !canBeListNode) {
        break;
      }
      if (!searchResult && canBeListNode) {
        skipped += 1;
        continue;
      }
      const [, indent, , start] = searchResult!;

      // basis on one depth list
      if (!indent) {
        firstOrderedListNum = Number(start);
        firstOrderedListLine = i;
        break;
      }
    }
    const ordinalNum = firstOrderedListNum + line - firstOrderedListLine - skipped;
    const changedResults = [{ text: `${ordinalNum}. ${lineText}`, line }];

    return { changedResults };
  },
  task({ doc, line }) {
    const lineText = getTextByMdLine(doc, line);
    const changedResults = [{ text: `* [ ] ${lineText}`, line }];

    return { changedResults };
  },
};

export const extendList: ExtendList = {
  bullet({ line, doc }: ExtendListContext) {
    const lineText = getTextByMdLine(doc, line);
    const [, indent, delimiter] = reBulletListGroup.exec(lineText)!;

    return { listSyntax: `${indent}${delimiter}` };
  },
  ordered({ toastMark, line, mdNode, doc }: ExtendListContext) {
    const depth = getListDepth(mdNode);
    const lineText = getTextByMdLine(doc, line);

    const [, indent, , start, delimiter] = reOrderedListGroup.exec(lineText)!;
    const ordinalNum = Number(start) + 1;
    const listSyntax = `${indent}${ordinalNum}${delimiter}`;

    const backwardList = findSameDepthList(toastMark, line, depth, true);
    const filteredList = backwardList.filter((info) => {
      const searchResult = reOrderedListGroup.exec(getTextByMdLine(doc, info.line));

      return (
        searchResult &&
        searchResult[1].length === indent.length &&
        !!findClosestNode(info.mdNode, (targetNode) => isOrderedListNode(targetNode))
      );
    });

    return { listSyntax, ...getChangedInfo(doc, filteredList, 'ordered', ordinalNum) };
  },
};

export function getReorderedListInfo(
  doc: ProsemirrorNode,
  schema: Schema,
  line: number,
  ordinalNum: number,
  prevIndentLength: number
) {
  let nodes: ProsemirrorNode[] = [];
  let lineText = getTextByMdLine(doc, line);
  let searchResult = reOrderedListGroup.exec(lineText);

  while (searchResult) {
    const [, indent, , , delimiter, text] = searchResult;
    const indentLength = indent.length;

    if (indentLength === prevIndentLength) {
      nodes.push(createTextNode(schema, `${indent}${ordinalNum}${delimiter}${text}`));
      ordinalNum += 1;
      line += 1;
    } else if (indentLength > prevIndentLength) {
      const nestedListInfo = getReorderedListInfo(doc, schema, line, 1, indentLength);

      line = nestedListInfo.line;
      nodes = nodes.concat(nestedListInfo.nodes);
    }

    if (indentLength < prevIndentLength || line > doc.childCount) {
      break;
    }

    lineText = getTextByMdLine(doc, line);
    searchResult = reOrderedListGroup.exec(lineText);
  }

  return { nodes, line };
}
