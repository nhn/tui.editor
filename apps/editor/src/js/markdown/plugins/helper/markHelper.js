import isFunction from 'tui-code-snippet/type/isFunction';
import {
  getMdStartLine,
  getMdStartCh,
  getMdEndLine,
  getMdEndCh,
  addChPos,
  setChPos
} from '../../../utils/markdown';

const HEADING = 'heading';
const SE_TEXT = 'seText';
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

function markInfo(start, end, type, attrs) {
  return { start, end, spec: { type, attrs } };
}

function heading({ level, headingType }, start, end) {
  const marks = [markInfo(start, end, HEADING, { level })];

  if (headingType === 'atx') {
    marks.push(markInfo(start, addChPos(start, level), DELIM));
  } else {
    marks.push(markInfo(setChPos(end, 0), end, SE_TEXT));
  }

  return { marks };
}

function emphasisAndStrikethrough({ type }, start, end) {
  return {
    marks: [
      markInfo(start, end, type),
      markInfo(start, addChPos(start, delimSize[type]), DELIM),
      markInfo(addChPos(end, -delimSize[type]), end, DELIM)
    ]
  };
}

function markLink(start, end, linkTextStart, lastChildCh) {
  return [
    markInfo(start, end, LINK),
    markInfo(setChPos(start, linkTextStart.ch + 1), setChPos(end, lastChildCh - 1), LINK, {
      desc: true
    }),
    markInfo(setChPos(end, lastChildCh + 1), addChPos(end, -1), LINK, { url: true })
  ];
}

function image({ lastChild }, start, end) {
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 3; // 3: length of '![]'
  const linkTextEnd = addChPos(start, 1);

  return {
    marks: [markInfo(start, linkTextEnd, META), ...markLink(start, end, linkTextEnd, lastChildCh)]
  };
}

function link({ lastChild, extendedAutolink }, start, end) {
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 2; // 2: length of '[]'
  const marks = extendedAutolink
    ? [markInfo(start, end, LINK, { desc: true })]
    : markLink(start, end, start, lastChildCh);

  return { marks };
}

function code({ tickCount }, start, end) {
  const openDelimEnd = addChPos(start, tickCount);
  const closeDelimStart = addChPos(end, -tickCount);

  return {
    marks: [
      markInfo(start, end, CODE),
      markInfo(start, openDelimEnd, CODE, { start: true }),
      markInfo(openDelimEnd, closeDelimStart, CODE, { marked: true }),
      markInfo(closeDelimStart, end, CODE, { end: true })
    ]
  };
}

function codeBlock(node, start, end, endLine) {
  const { fenceOffset, fenceLength, fenceChar, info, infoPadding, parent } = node;
  const fenceEnd = fenceOffset + fenceLength;
  const marks = [markInfo(setChPos(start, 0), end, CODE_BLOCK)];

  if (fenceChar) {
    marks.push(markInfo(start, addChPos(start, fenceEnd), DELIM));
  }

  if (info) {
    marks.push(
      markInfo(
        setChPos(start, fenceEnd),
        setChPos(start, fenceEnd + infoPadding + info.length),
        META
      )
    );
  }

  const codeBlockEnd = `^(\\s{0,3})(${fenceChar}{${fenceLength},})`;
  const CLOSED_RX = new RegExp(codeBlockEnd);

  if (CLOSED_RX.test(endLine)) {
    marks.push(markInfo(setChPos(end, 0), end, DELIM));
  }

  const lineBackground =
    parent.type !== 'item' && parent.type !== 'blockQuote'
      ? {
          start,
          end,
          spec: { attrs: { className: 'code-block-line-background' } }
        }
      : null;

  return {
    marks,
    lineBackground: { ...lineBackground }
  };
}

function markListItemChildren(node, specs) {
  const marks = [];

  while (node) {
    const { type } = node;

    if (type === 'paragraph' || type === 'codeBlock') {
      // eslint-disable-next-line no-loop-func
      specs.forEach(spec => {
        marks.push(
          markInfo(
            { line: getMdStartLine(node) - 1, ch: getMdStartCh(node) - 1 },
            { line: getMdEndLine(node) - 1, ch: getMdEndCh(node) },
            ...spec
          )
        );
      });
    }
    node = node.next;
  }

  return marks;
}

function markParagraphInBlockQuote(node) {
  const marks = [];

  while (node) {
    marks.push(
      markInfo(
        { line: getMdStartLine(node) - 1, ch: getMdStartCh(node) - 1 },
        { line: getMdEndLine(node) - 1, ch: getMdEndCh(node) },
        TEXT
      )
    );
    node = node.next;
  }

  return marks;
}

function blockQuote(node, start, end) {
  let marks =
    node.parent && node.parent.type !== 'blockQuote' ? [markInfo(start, end, BLOCK_QUOTE)] : [];

  if (node.firstChild) {
    let childMarks = [];

    if (node.firstChild.type === 'paragraph') {
      childMarks = markParagraphInBlockQuote(node.firstChild.firstChild);
    } else if (node.firstChild.type === 'list') {
      childMarks = markListItemChildren(node.firstChild, [TEXT]);
    }

    marks = [...marks, ...childMarks];
  }

  return { marks };
}

function getSpecOfListItemStyle(node) {
  let depth = 0;

  while (node.parent.parent && node.parent.parent.type === 'item') {
    node = node.parent.parent;
    depth += 1;
  }

  const attrs = [{ odd: true }, { even: true }][depth % 2];

  return [LIST_ITEM, { ...attrs, listStyle: true }];
}

function item(node, start) {
  const { padding, task } = node.listData;
  const spec = getSpecOfListItemStyle(node);
  const marks = [markInfo(start, addChPos(start, padding), ...spec)];

  if (task) {
    marks.push(markInfo(addChPos(start, padding), addChPos(start, padding + 3), TASK_DELIM));
    marks.push(markInfo(addChPos(start, padding + 1), addChPos(start, padding + 2), META));
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
};

/**
 * Gets mark information to the markdown node.
 * @param {Object} node - node returned from ToastMark
 * @param {Object} start - start node's data
 * @param {Object} end - end node's data
 * @param {Object} endLine - end line's data
 * @returns {?Object} mark information
 * @ignore
 */
export function getMarkInfo(node, start, end, endLine) {
  const { type } = node;

  if (isFunction(markNodeFuncMap[type])) {
    return markNodeFuncMap[type](node, start, end, endLine);
  }

  if (simpleMarkClassNameMap[type]) {
    return { marks: [markInfo(start, end, simpleMarkClassNameMap[type])] };
  }

  return null;
}
