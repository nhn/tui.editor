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

function createMarkInfo(start, end, className) {
  return { start, end, className };
}

function heading(node, start, end) {
  const marks = [];
  const { level } = node;

  marks.push(createMarkInfo(start, end, cls(['heading', `heading${level}`])));
  marks.push(createMarkInfo(start, { line: start.line, ch: start.ch + level }, classNameMap.DELIM));

  return { marks };
}

function emphasisAndStrikethrough(node, start, end) {
  const marks = [];
  const { type } = node;
  const openDelimEnd = { line: start.line, ch: start.ch + delimSize[type] };
  const closeDelimStart = { line: end.line, ch: end.ch - delimSize[type] };

  marks.push(createMarkInfo(start, end, cls(`${type}`)));
  marks.push(createMarkInfo(start, openDelimEnd, classNameMap.DELIM));
  marks.push(createMarkInfo(closeDelimStart, end, classNameMap.DELIM));

  return { marks };
}

function addMarkInfoOfLink(start, end, linkTextStart, lastChildCh, marks) {
  marks.push(createMarkInfo(start, end, cls('link')));
  marks.push(createMarkInfo(linkTextStart, { line: end.line, ch: lastChildCh }, cls('link-desc')));
  marks.push(
    createMarkInfo(
      { line: start.line, ch: linkTextStart.ch + 1 },
      { line: end.line, ch: lastChildCh - 1 },
      classNameMap.TEXT
    )
  );

  marks.push(createMarkInfo({ line: end.line, ch: lastChildCh }, end, cls('link-url')));
  marks.push(
    createMarkInfo(
      { line: end.line, ch: lastChildCh + 1 },
      { line: end.line, ch: end.ch - 1 },
      classNameMap.TEXT
    )
  );
}

function image(node, start, end) {
  const marks = [];
  const { lastChild } = node;
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 3; // 3: length of '![]'
  const linkTextEnd = { line: start.line, ch: start.ch + 1 };

  marks.push(createMarkInfo(start, linkTextEnd, classNameMap.META));

  addMarkInfoOfLink(start, end, linkTextEnd, lastChildCh, marks);

  return { marks };
}

function link(node, start, end) {
  const marks = [];
  const { lastChild } = node;
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 2; // 2: length of '[]'

  addMarkInfoOfLink(start, end, start, lastChildCh, marks);

  return { marks };
}

function code(node, start, end) {
  const marks = [];
  const { tickCount } = node;
  const openDelimEnd = { line: start.line, ch: start.ch + tickCount };
  const closeDelimStart = { line: end.line, ch: end.ch - tickCount };

  marks.push(createMarkInfo(start, end, cls('code')));
  marks.push(createMarkInfo(start, openDelimEnd, classNameMap.DELIM));
  marks.push(createMarkInfo(openDelimEnd, closeDelimStart, classNameMap.TEXT));
  marks.push(createMarkInfo(closeDelimStart, end, classNameMap.DELIM));

  return { marks };
}

function getClassNamesOfCodeBlockLine(startLine, endLine) {
  const classNames = [];

  for (let index = startLine; index <= endLine; index += 1) {
    classNames.push({ line: index, className: classNameMap.CODE_BLOCK });
  }

  return classNames;
}

function codeBlock(node, start, end, endLine) {
  const marks = [];
  const { fenceOffset, fenceLength, fenceChar, info } = node;

  const fenceEnd = fenceOffset + fenceLength;
  let openDelimEnd = { line: start.line, ch: start.ch + fenceEnd };

  marks.push(createMarkInfo(start, end, classNameMap.CODE_BLOCK));
  marks.push(createMarkInfo(start, openDelimEnd, classNameMap.DELIM));

  if (info) {
    openDelimEnd = { line: start.line, ch: fenceEnd + info.length };
    marks.push(createMarkInfo({ line: start.line, ch: fenceEnd }, openDelimEnd, classNameMap.META));
  }

  const codeBlockEnd = `^(\\s{0,${fenceOffset}})(${fenceChar}{${fenceLength},})`;
  const CLOSED_RX = new RegExp(codeBlockEnd);

  let closeDelimStart = end;

  if (CLOSED_RX.test(endLine)) {
    closeDelimStart = { line: end.line, ch: 0 };
    marks.push(createMarkInfo(closeDelimStart, end, classNameMap.DELIM));
  }

  marks.push(createMarkInfo(openDelimEnd, closeDelimStart, classNameMap.TEXT));

  const lineClassNames = getClassNamesOfCodeBlockLine(start.line, end.line);

  return { marks, lineClassNames };
}

function addMarkInfokOfListItemChildren(node, className, marks) {
  while (node) {
    const { type } = node;

    if (type === 'paragraph' || type === 'codeBlock') {
      marks.push(
        createMarkInfo(
          { line: getMdStartLine(node) - 1, ch: getMdStartCh(node) - 1 },
          { line: getMdEndLine(node) - 1, ch: getMdEndCh(node) },
          className
        )
      );
    }
    node = node.next;
  }
}

function addMarkInfoOfParagraphInBlockQuote(node, className, marks) {
  while (node) {
    marks.push(
      createMarkInfo(
        { line: getMdStartLine(node) - 1, ch: getMdStartCh(node) - 1 },
        { line: getMdEndLine(node) - 1, ch: getMdEndCh(node) },
        classNameMap.TEXT
      )
    );
    node = node.next;
  }
}

function blockQuote(node, start, end) {
  const marks = [];

  if (node.parent && node.parent.type !== 'blockQuote') {
    marks.push(createMarkInfo(start, end, cls('block-quote')));
  }

  if (node.firstChild) {
    if (node.firstChild.type === 'paragraph') {
      addMarkInfoOfParagraphInBlockQuote(node.firstChild.firstChild, classNameMap.TEXT, marks);
    } else if (node.firstChild.type === 'list') {
      addMarkInfokOfListItemChildren(node.firstChild, classNameMap.TEXT, marks);
    }
  }

  return { marks };
}

function getClassNameOfListItem(node) {
  let depth = 0;

  const createClassName = classNames => classNames[depth % classNames.length];

  while (node.parent.parent && node.parent.parent.type === 'item') {
    node = node.parent.parent;
    depth += 1;
  }

  const newClassName = createClassName(['list-item-odd', 'list-item-even']);

  // @TODO remove it in the next major version
  // these class names are for the legacy style 'old.css'
  const oldClassName = createClassName(['first', 'second', 'third']);

  return `${cls(['list-item', `${newClassName}`])} ${oldClassName}`;
}

function item(node, start) {
  const marks = [];
  const itemClassName = getClassNameOfListItem(node);
  const { padding, task } = node.listData;

  const { line, ch } = start;
  const chWithPadding = ch + padding;

  marks.push(
    createMarkInfo(
      start,
      { line, ch: chWithPadding },
      `${itemClassName} ${cls('list-item-bullet')}`
    )
  );

  if (task) {
    marks.push(
      createMarkInfo(
        { line, ch: chWithPadding },
        { line, ch: chWithPadding + 3 },
        `${itemClassName} ${classNameMap.DELIM}`
      )
    );
    marks.push(
      createMarkInfo(
        { line, ch: chWithPadding + 1 },
        { line, ch: chWithPadding + 2 },
        classNameMap.META
      )
    );
  }

  addMarkInfokOfListItemChildren(node.firstChild, `${itemClassName} ${classNameMap.TEXT}`, marks);

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

const simpleMarkNode = {
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
    return markNodeFuncMap[type].apply(this, [node, start, end, endLine]);
  }

  if (simpleMarkNode[type]) {
    return { marks: [createMarkInfo(start, end, simpleMarkNode[type])] };
  }

  return null;
}
