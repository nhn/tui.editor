import isFunction from 'tui-code-snippet/type/isFunction';
import {
  MdPos,
  MdNode,
  MdNodeType,
  CodeBlockMdNode,
  ListItemMdNode,
  HeadingMdNode,
  LinkMdNode,
  ImageMdNode,
  CodeMdNode
} from '@t/markdown';
import {
  getMdStartLine,
  getMdStartCh,
  getMdEndLine,
  getMdEndCh,
  addOffsetPos,
  setOffsetPos
} from '@/utils/markdown';

const HEADING = 'heading';
const BLOCK_QUOTE = 'blockQuote';
const LIST_ITEM = 'listItem';
const TABLE = 'table';
const CODE_BLOCK = 'codeBlock';
const THEMATIC_BREAK = 'thematicBreak';
const LINK = 'link';
const CODE = 'code';
const META = 'meta';
const DELIM = 'delimiter';
const TASK_DELIM = 'taskDelimiter';
const TEXT = 'markedText';
const HTML = 'html';

const delimSize = {
  strong: 2,
  emph: 1,
  strike: 2
};

type MarkType =
  | MdNodeType
  | typeof LIST_ITEM
  | typeof DELIM
  | typeof TASK_DELIM
  | typeof TEXT
  | typeof HTML
  | typeof META;

interface MarkInfo {
  start: MdPos;
  end: MdPos;
  spec: { type?: MarkType; attrs?: Record<string, any> };
}

function markInfo(
  start: MdPos,
  end: MdPos,
  type?: MarkType,
  attrs?: Record<string, any>
): MarkInfo {
  return { start, end, spec: { type, attrs } };
}

function heading({ level, headingType }: HeadingMdNode, start: MdPos, end: MdPos) {
  const marks = [markInfo(start, end, HEADING, { level })];

  if (headingType === 'atx') {
    marks.push(markInfo(start, addOffsetPos(start, level), DELIM));
  } else {
    marks.push(markInfo(setOffsetPos(end, 0), end, HEADING, { seText: true }));
  }

  return { marks };
}

function emphasisAndStrikethrough(
  { type }: { type: keyof typeof delimSize },
  start: MdPos,
  end: MdPos
) {
  const startDelimPos = addOffsetPos(start, delimSize[type]);
  const endDelimPos = addOffsetPos(end, -delimSize[type]);

  return {
    marks: [
      markInfo(startDelimPos, endDelimPos, type),
      markInfo(start, startDelimPos, DELIM),
      markInfo(endDelimPos, end, DELIM)
    ]
  };
}

function markLink(start: MdPos, end: MdPos, linkTextStart: MdPos, lastChildCh: number) {
  return [
    markInfo(start, end, LINK),
    markInfo(setOffsetPos(start, linkTextStart[1] + 1), setOffsetPos(end, lastChildCh), LINK, {
      desc: true
    }),
    markInfo(setOffsetPos(end, lastChildCh + 2), addOffsetPos(end, -1), LINK, { url: true })
  ];
}

function image({ lastChild }: ImageMdNode, start: MdPos, end: MdPos) {
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 3; // 3: length of '![]'
  const linkTextEnd = addOffsetPos(start, 1);

  return {
    marks: [markInfo(start, linkTextEnd, META), ...markLink(start, end, linkTextEnd, lastChildCh)]
  };
}

function link({ lastChild, extendedAutolink }: LinkMdNode, start: MdPos, end: MdPos) {
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 2; // 2: length of '[]'
  const marks = extendedAutolink
    ? [markInfo(start, end, LINK, { desc: true })]
    : markLink(start, end, start, lastChildCh);

  return { marks };
}

function code({ tickCount }: CodeMdNode, start: MdPos, end: MdPos) {
  const openDelimEnd = addOffsetPos(start, tickCount);
  const closeDelimStart = addOffsetPos(end, -tickCount);

  return {
    marks: [
      markInfo(start, end, CODE),
      markInfo(start, openDelimEnd, CODE, { start: true }),
      markInfo(openDelimEnd, closeDelimStart, CODE, { marked: true }),
      markInfo(closeDelimStart, end, CODE, { end: true })
    ]
  };
}

function codeBlock(node: MdNode, start: MdPos, end: MdPos, endLine: string) {
  const {
    fenceOffset,
    fenceLength,
    fenceChar,
    info,
    infoPadding,
    parent
  } = node as CodeBlockMdNode;
  const fenceEnd = fenceOffset + fenceLength;
  const marks = [markInfo(setOffsetPos(start, 0), end, CODE_BLOCK)];

  if (fenceChar) {
    marks.push(markInfo(start, addOffsetPos(start, fenceEnd), DELIM));
  }

  if (info) {
    marks.push(
      markInfo(
        setOffsetPos(start, fenceEnd + 1),
        setOffsetPos(start, fenceEnd + infoPadding + info.length + 1),
        META
      )
    );
  }

  const codeBlockEnd = `^(\\s{0,3})(${fenceChar}{${fenceLength},})`;
  const reCodeBlockEnd = new RegExp(codeBlockEnd);

  if (reCodeBlockEnd.test(endLine)) {
    marks.push(markInfo(setOffsetPos(end, 0), end, DELIM));
  }

  const lineBackground =
    parent!.type !== 'item' && parent!.type !== 'blockQuote'
      ? {
          start,
          end,
          spec: { attrs: { className: 'code-block-line-background' } }
        }
      : null;

  return {
    marks,
    lineBackground
  };
}

function markListItemChildren(node: MdNode, markType: MarkType) {
  const marks: MarkInfo[] = [];

  while (node) {
    const { type } = node;

    if (type === 'paragraph' || type === 'codeBlock') {
      marks.push(
        markInfo(
          [getMdStartLine(node), getMdStartCh(node) - 1],
          [getMdEndLine(node), getMdEndCh(node)],
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
      let childNode = node.firstChild;

      while (childNode) {
        childMarks = childMarks.concat(markParagraphInBlockQuote(childNode.firstChild!));
        childNode = childNode.next!;
      }
    } else if (node.firstChild.type === 'list') {
      childMarks = markListItemChildren(node.firstChild, TEXT);
    }

    marks = [...marks, ...childMarks];
  }

  return { marks };
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

  return { marks };
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
  item
};

const simpleMarkClassNameMap = {
  thematicBreak: THEMATIC_BREAK,
  table: TABLE,
  tableCell: TEXT,
  htmlInline: HTML
} as const;

type MarkNodeFuncMapKey = keyof typeof markNodeFuncMap;
type SimpleNodeFuncMapKey = keyof typeof simpleMarkClassNameMap;
interface MarkNodeFuncMapResult {
  marks: MarkInfo[];
  lineBackground?: MarkInfo | null;
}

/**
 * Gets mark information to the markdown node.
 * @param {Object} node - node returned from ToastMark
 * @param {Array} start - start position
 * @param {Array} end - end position
 * @param {string} endLine - end line's data
 * @returns {?Object} mark information
 * @ignore
 */
export function getMarkInfo(node: MdNode, start: MdPos, end: MdPos, endLine: string) {
  const { type } = node;

  if (isFunction(markNodeFuncMap[type as MarkNodeFuncMapKey])) {
    return markNodeFuncMap[type as MarkNodeFuncMapKey](
      // @TODO: create node type to cover all markdown node type
      // @ts-ignore
      node,
      start,
      end,
      endLine
    ) as MarkNodeFuncMapResult;
  }

  if (simpleMarkClassNameMap[type as SimpleNodeFuncMapKey]) {
    return {
      marks: [markInfo(start, end, simpleMarkClassNameMap[type as SimpleNodeFuncMapKey])]
    };
  }

  return null;
}
