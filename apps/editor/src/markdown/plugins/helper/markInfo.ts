import {
  MdNodeType,
  MdPos,
  HeadingMdNode,
  LinkMdNode,
  CodeMdNode,
  MdNode,
  CodeBlockMdNode,
  CustomBlockMdNode,
  ListItemMdNode,
} from '@toast-ui/toastmark';
import isFunction from 'tui-code-snippet/type/isFunction';
import {
  getMdStartLine,
  getMdStartCh,
  getMdEndLine,
  getMdEndCh,
  addOffsetPos,
  setOffsetPos,
} from '@/utils/markdown';

const HEADING = 'heading';
const BLOCK_QUOTE = 'blockQuote';
const LIST_ITEM = 'listItem';
const TABLE = 'table';
const TABLE_CELL = 'tableCell';
const CODE_BLOCK = 'codeBlock';
const THEMATIC_BREAK = 'thematicBreak';
const LINK = 'link';
const CODE = 'code';
const META = 'meta';
const DELIM = 'delimiter';
const TASK_DELIM = 'taskDelimiter';
const TEXT = 'markedText';
const HTML = 'html';
const CUSTOM_BLOCK = 'customBlock';

const delimSize = {
  strong: 2,
  emph: 1,
  strike: 2,
};

type MarkType =
  | MdNodeType
  | typeof LIST_ITEM
  | typeof DELIM
  | typeof TASK_DELIM
  | typeof TEXT
  | typeof HTML
  | typeof META;

export interface MarkInfo {
  start: MdPos;
  end: MdPos;
  spec?: { type?: MarkType; attrs?: Record<string, any> };
  lineBackground?: boolean;
}

function markInfo(start: MdPos, end: MdPos, type: MarkType, attrs?: Record<string, any>): MarkInfo {
  return { start, end, spec: { type, attrs } };
}

function heading({ level, headingType }: HeadingMdNode, start: MdPos, end: MdPos) {
  const marks = [markInfo(start, end, HEADING, { level })];

  if (headingType === 'atx') {
    marks.push(markInfo(start, addOffsetPos(start, level), DELIM));
  } else {
    marks.push(markInfo(setOffsetPos(end, 0), end, HEADING, { seText: true }));
  }

  return marks;
}

function emphasisAndStrikethrough(
  { type }: { type: keyof typeof delimSize },
  start: MdPos,
  end: MdPos
) {
  const startDelimPos = addOffsetPos(start, delimSize[type]);
  const endDelimPos = addOffsetPos(end, -delimSize[type]);

  return [
    markInfo(startDelimPos, endDelimPos, type),
    markInfo(start, startDelimPos, DELIM),
    markInfo(endDelimPos, end, DELIM),
  ];
}

function markLink(start: MdPos, end: MdPos, linkTextStart: MdPos, lastChildCh: number) {
  return [
    markInfo(start, end, LINK),
    markInfo(setOffsetPos(start, linkTextStart[1] + 1), setOffsetPos(end, lastChildCh), LINK, {
      desc: true,
    }),
    markInfo(setOffsetPos(end, lastChildCh + 2), addOffsetPos(end, -1), LINK, { url: true }),
  ];
}

function image({ lastChild }: LinkMdNode, start: MdPos, end: MdPos) {
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 3; // 3: length of '![]'
  const linkTextEnd = addOffsetPos(start, 1);

  return [markInfo(start, linkTextEnd, META), ...markLink(start, end, linkTextEnd, lastChildCh)];
}

function link({ lastChild, extendedAutolink }: LinkMdNode, start: MdPos, end: MdPos) {
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 2; // 2: length of '[]'

  return extendedAutolink
    ? [markInfo(start, end, LINK, { desc: true })]
    : markLink(start, end, start, lastChildCh);
}

function code({ tickCount }: CodeMdNode, start: MdPos, end: MdPos) {
  const openDelimEnd = addOffsetPos(start, tickCount);
  const closeDelimStart = addOffsetPos(end, -tickCount);

  return [
    markInfo(start, end, CODE),
    markInfo(start, openDelimEnd, CODE, { start: true }),
    markInfo(openDelimEnd, closeDelimStart, CODE, { marked: true }),
    markInfo(closeDelimStart, end, CODE, { end: true }),
  ];
}

function lineBackground(parent: MdNode, start: MdPos, end: MdPos, prefix: string) {
  const defaultBackground = {
    start,
    end,
    spec: {
      attrs: { className: `${prefix}-line-background`, codeStart: start[0], codeEnd: end[0] },
    },
    lineBackground: true,
  };

  return parent!.type !== 'item' && parent!.type !== 'blockQuote'
    ? [
        {
          ...defaultBackground,
          end: start,
          spec: { attrs: { className: `${prefix}-line-background start` } },
        },
        {
          ...defaultBackground,
          start: [Math.min(start[0] + 1, end[0]), start[1]] as MdPos,
        },
      ]
    : null;
}

function codeBlock(node: CodeBlockMdNode, start: MdPos, end: MdPos, endLine: string) {
  const { fenceOffset, fenceLength, fenceChar, info, infoPadding, parent } = node;
  const fenceEnd = fenceOffset + fenceLength;
  const marks = [markInfo(setOffsetPos(start, 1), end, CODE_BLOCK)];

  if (fenceChar) {
    marks.push(markInfo(start, addOffsetPos(start, fenceEnd), DELIM));
  }

  if (info) {
    marks.push(
      markInfo(
        addOffsetPos(start, fenceLength),
        addOffsetPos(start, fenceLength + infoPadding + info.length),
        META
      )
    );
  }

  const codeBlockEnd = `^(\\s{0,4})(${fenceChar}{${fenceLength},})`;
  const reCodeBlockEnd = new RegExp(codeBlockEnd);

  if (reCodeBlockEnd.test(endLine)) {
    marks.push(markInfo(setOffsetPos(end, 1), end, DELIM));
  }

  const lineBackgroundMarkInfo = lineBackground(parent!, start, end, 'code-block');

  return lineBackgroundMarkInfo ? marks.concat(lineBackgroundMarkInfo) : marks;
}

function customBlock(node: MdNode, start: MdPos, end: MdPos) {
  const { offset, syntaxLength, info, parent } = node as CustomBlockMdNode;
  const syntaxEnd = offset + syntaxLength;
  const marks = [markInfo(setOffsetPos(start, 1), end, CUSTOM_BLOCK)];

  marks.push(markInfo(start, addOffsetPos(start, syntaxEnd), DELIM));

  if (info) {
    marks.push(
      markInfo(
        addOffsetPos(start, syntaxEnd),
        addOffsetPos(start, syntaxLength + info.length),
        META
      )
    );
  }

  marks.push(markInfo(setOffsetPos(end, 1), end, DELIM));

  const lineBackgroundMarkInfo = lineBackground(parent!, start, end, 'custom-block');

  return lineBackgroundMarkInfo ? marks.concat(lineBackgroundMarkInfo) : marks;
}

function markListItemChildren(node: MdNode, markType: MarkType) {
  const marks: MarkInfo[] = [];

  while (node) {
    const { type } = node;

    if (type === 'paragraph' || type === 'codeBlock') {
      marks.push(
        markInfo(
          [getMdStartLine(node), getMdStartCh(node) - 1],
          [getMdEndLine(node), getMdEndCh(node) + 1],
          markType
        )
      );
    }
    node = node.next!;
  }

  return marks;
}

function markParagraphInBlockQuote(node: MdNode) {
  const marks = [];

  while (node) {
    marks.push(
      markInfo(
        [getMdStartLine(node), getMdStartCh(node)],
        [getMdEndLine(node), getMdEndCh(node) + 1],
        TEXT
      )
    );
    node = node.next!;
  }

  return marks;
}

function blockQuote(node: MdNode, start: MdPos, end: MdPos) {
  let marks =
    node.parent && node.parent.type !== 'blockQuote' ? [markInfo(start, end, BLOCK_QUOTE)] : [];

  if (node.firstChild) {
    let childMarks: MarkInfo[] = [];

    if (node.firstChild.type === 'paragraph') {
      childMarks = markParagraphInBlockQuote(node.firstChild.firstChild!);
    } else if (node.firstChild.type === 'list') {
      childMarks = markListItemChildren(node.firstChild, TEXT);
    }

    marks = [...marks, ...childMarks];
  }

  return marks;
}

function getSpecOfListItemStyle(node: MdNode): [MarkType, Record<string, any>] {
  let depth = 0;

  while (node.parent!.parent && node.parent!.parent.type === 'item') {
    node = node.parent!.parent;
    depth += 1;
  }

  const attrs = [{ odd: true }, { even: true }][depth % 2];

  return [LIST_ITEM, { ...attrs, listStyle: true }];
}

function item(node: ListItemMdNode, start: MdPos) {
  const { padding, task } = node.listData;
  const spec = getSpecOfListItemStyle(node);
  const marks = [markInfo(start, addOffsetPos(start, padding), ...spec)];

  if (task) {
    marks.push(
      markInfo(addOffsetPos(start, padding), addOffsetPos(start, padding + 3), TASK_DELIM)
    );
    marks.push(markInfo(addOffsetPos(start, padding + 1), addOffsetPos(start, padding + 2), META));
  }

  return marks.concat(markListItemChildren(node.firstChild!, TEXT));
}

const markNodeFuncMap = {
  heading,
  strong: emphasisAndStrikethrough,
  emph: emphasisAndStrikethrough,
  strike: emphasisAndStrikethrough,
  link,
  image,
  code,
  codeBlock,
  blockQuote,
  item,
  customBlock,
};

const simpleMarkClassNameMap = {
  thematicBreak: THEMATIC_BREAK,
  table: TABLE,
  tableCell: TABLE_CELL,
  htmlInline: HTML,
} as const;

type MarkNodeFuncMapKey = keyof typeof markNodeFuncMap;
type SimpleNodeFuncMapKey = keyof typeof simpleMarkClassNameMap;

export function getMarkInfo(node: MdNode, start: MdPos, end: MdPos, endLine: string) {
  const { type } = node;

  if (isFunction(markNodeFuncMap[type as MarkNodeFuncMapKey])) {
    // @ts-ignore
    return markNodeFuncMap[type as MarkNodeFuncMapKey](node, start, end, endLine);
  }

  if (simpleMarkClassNameMap[type as SimpleNodeFuncMapKey]) {
    return [markInfo(start, end, simpleMarkClassNameMap[type as SimpleNodeFuncMapKey])];
  }

  return null;
}
