import isArray from 'tui-code-snippet/type/isArray';
import isFunction from 'tui-code-snippet/type/isFunction';
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import { getMdStartLine, getMdStartCh, getMdEndLine, getMdEndCh } from './utils/markdown';

const CLS_PREFIX = 'tui-md-';

const classNameMap = applyClsToValue({
  DELIM: 'delimiter',
  META: 'meta',
  TEXT: 'marked-text',
  THEMATIC_BREAK: 'thematic-break',
  CODE_BLOCK: 'code-block',
  TABLE: 'table'
});

const delimSize = {
  strong: 2,
  emph: 1,
  strike: 2
};

function cls(names) {
  const classNames = isArray(names) ? names : [names];

  return classNames.map(className => `${CLS_PREFIX}${className}`).join(' ');
}

function applyClsToValue(obj) {
  forEachOwnProperties(obj, (value, key) => {
    obj[key] = cls(value);
  });

  return obj;
}

function markInfo(start, end, className) {
  return { start, end, className };
}

function heading(node, start, end) {
  const { level } = node;

  return {
    marks: [
      markInfo(start, end, cls(['heading', `heading${level}`])),
      markInfo(start, { line: start.line, ch: start.ch + level }, classNameMap.DELIM)
    ]
  };
}

function emphasisAndStrikethrough(node, start, end) {
  const { type } = node;
  const openDelimEnd = { line: start.line, ch: start.ch + delimSize[type] };
  const closeDelimStart = { line: end.line, ch: end.ch - delimSize[type] };

  return {
    marks: [
      markInfo(start, end, cls(`${type}`)),
      markInfo(start, openDelimEnd, classNameMap.DELIM),
      markInfo(closeDelimStart, end, classNameMap.DELIM)
    ]
  };
}

function markLink(start, end, linkTextStart, lastChildCh) {
  return [
    markInfo(start, end, cls('link')),
    markInfo(linkTextStart, { line: end.line, ch: lastChildCh }, cls('link-desc')),
    markInfo(
      { line: start.line, ch: linkTextStart.ch + 1 },
      { line: end.line, ch: lastChildCh - 1 },
      classNameMap.TEXT
    ),
    markInfo({ line: end.line, ch: lastChildCh }, end, cls('link-url')),
    markInfo(
      { line: end.line, ch: lastChildCh + 1 },
      { line: end.line, ch: end.ch - 1 },
      classNameMap.TEXT
    )
  ];
}

function image(node, start, end) {
  const { lastChild } = node;
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 3; // 3: length of '![]'
  const linkTextEnd = { line: start.line, ch: start.ch + 1 };

  return {
    marks: [
      markInfo(start, linkTextEnd, classNameMap.META),
      ...markLink(start, end, linkTextEnd, lastChildCh)
    ]
  };
}

function link(node, start, end) {
  const { lastChild } = node;
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 2; // 2: length of '[]'

  return { marks: markLink(start, end, start, lastChildCh) };
}

function code(node, start, end) {
  const { tickCount } = node;
  const openDelimEnd = { line: start.line, ch: start.ch + tickCount };
  const closeDelimStart = { line: end.line, ch: end.ch - tickCount };

  return {
    marks: [
      markInfo(start, end, cls('code')),
      markInfo(start, openDelimEnd, classNameMap.DELIM),
      markInfo(openDelimEnd, closeDelimStart, classNameMap.TEXT),
      markInfo(closeDelimStart, end, classNameMap.DELIM)
    ]
  };
}

function codeBlock(node, start, end, endLine) {
  const { fenceOffset, fenceLength, fenceChar, info } = node;
  const fenceEnd = fenceOffset + fenceLength;
  let openDelimEnd = { line: start.line, ch: start.ch + fenceEnd };

  const marks = [
    markInfo(start, end, classNameMap.CODE_BLOCK),
    markInfo(start, openDelimEnd, classNameMap.DELIM)
  ];

  if (info) {
    openDelimEnd = { line: start.line, ch: fenceEnd + info.length };
    marks.push(markInfo({ line: start.line, ch: fenceEnd }, openDelimEnd, classNameMap.META));
  }

  const codeBlockEnd = `^(\\s{0,${fenceOffset}})(${fenceChar}{${fenceLength},})`;
  const CLOSED_RX = new RegExp(codeBlockEnd);

  let closeDelimStart = end;

  if (CLOSED_RX.test(endLine)) {
    closeDelimStart = { line: end.line, ch: 0 };
    marks.push(markInfo(closeDelimStart, end, classNameMap.DELIM));
  }

  return {
    marks: [...marks, markInfo(openDelimEnd, closeDelimStart, classNameMap.TEXT)],
    lineBackground: {
      start: start.line,
      end: end.line,
      className: classNameMap.CODE_BLOCK
    }
  };
}

function markListItemChildren(node, className) {
  const marks = [];

  while (node) {
    const { type } = node;

    if (type === 'paragraph' || type === 'codeBlock') {
      marks.push(
        markInfo(
          { line: getMdStartLine(node) - 1, ch: getMdStartCh(node) - 1 },
          { line: getMdEndLine(node) - 1, ch: getMdEndCh(node) },
          className
        )
      );
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
        classNameMap.TEXT
      )
    );
    node = node.next;
  }

  return marks;
}

function blockQuote(node, start, end) {
  let marks =
    node.parent && node.parent.type !== 'blockQuote'
      ? [markInfo(start, end, cls('block-quote'))]
      : [];

  if (node.firstChild) {
    let childMarks = [];

    if (node.firstChild.type === 'paragraph') {
      childMarks = markParagraphInBlockQuote(node.firstChild.firstChild, classNameMap.TEXT);
    } else if (node.firstChild.type === 'list') {
      childMarks = markListItemChildren(node.firstChild, classNameMap.TEXT);
    }

    marks = [...marks, ...childMarks];
  }

  return { marks };
}

function getClassNameOfListItem(node) {
  let depth = 0;

  while (node.parent.parent && node.parent.parent.type === 'item') {
    node = node.parent.parent;
    depth += 1;
  }

  const newClassName = ['list-item-odd', 'list-item-even'][depth % 2];

  // @TODO remove it in the next major version
  // these class names are for the legacy style 'old.css'
  const oldClassName = ['fisrt', 'second', 'third'][depth % 3];

  return `${cls(['list-item', `${newClassName}`])} ${oldClassName}`;
}

function item(node, start) {
  const itemClassName = getClassNameOfListItem(node);
  const { padding, task } = node.listData;
  const { line, ch } = start;
  const chWithPadding = ch + padding;

  return {
    marks: [
      markInfo(start, { line, ch: chWithPadding }, `${itemClassName} ${cls('list-item-bullet')}`),
      ...(task
        ? [
            markInfo(
              { line, ch: chWithPadding },
              { line, ch: chWithPadding + 3 },
              `${itemClassName} ${classNameMap.DELIM}`
            ),
            markInfo(
              { line, ch: chWithPadding + 1 },
              { line, ch: chWithPadding + 2 },
              classNameMap.META
            )
          ]
        : []),
      ...markListItemChildren(node.firstChild, `${itemClassName} ${classNameMap.TEXT}`)
    ]
  };
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

const simpleMarkClass = {
  thematicBreak: classNameMap.THEMATIC_BREAK,
  table: classNameMap.TABLE,
  tableCell: classNameMap.TEXT
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

  if (simpleMarkClass[type]) {
    return { marks: [markInfo(start, end, simpleMarkClass[type])] };
  }

  return null;
}
