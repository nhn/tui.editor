import isArray from 'tui-code-snippet/type/isArray';
import { getMdStartLine, getMdStartCh, getMdEndLine, getMdEndCh } from './utils/markdown';

const CLS_PREFIX = 'tui-md-';

const classNamesMap = applyValueToCls({
  DELIM: 'delimiter',
  META: 'meta',
  TEXT: 'marked-text',
  THEMATIC_BREAK: 'thematic-break',
  CODE_BLOCK: 'code-block',
  TABLE: 'table'
});

const simpleMarkNode = {
  thematicBreak: classNamesMap.THEMATIC_BREAK,
  table: classNamesMap.TABLE,
  tableCell: classNamesMap.TEXT
};

const delimSize = {
  strong: 2,
  emph: 1,
  strike: 2
};

function cls(names) {
  const classNames = isArray(names) ? names : [names];

  return classNames.map(className => `${CLS_PREFIX}${className}`).join(' ');
}

function applyValueToCls(obj) {
  Object.keys(obj).forEach(key => {
    obj[key] = cls(obj[key]);
  });

  return obj;
}

function createMarkInfo(start, end, className) {
  return { start, end, className };
}

function getHeadingInfo(node, start, end) {
  const marks = [];
  const { level } = node;

  marks.push(createMarkInfo(start, end, cls(['heading', `heading${level}`])));
  marks.push(
    createMarkInfo(start, { line: start.line, ch: start.ch + level }, classNamesMap.DELIM)
  );

  return { marks };
}

function getEmphasisAndStrikethroughInfo(node, start, end) {
  const marks = [];
  const { type } = node;
  const openDelimEnd = { line: start.line, ch: start.ch + delimSize[type] };
  const closeDelimStart = { line: end.line, ch: end.ch - delimSize[type] };

  marks.push(createMarkInfo(start, end, cls(`${type}`)));
  marks.push(createMarkInfo(start, openDelimEnd, classNamesMap.DELIM));
  marks.push(createMarkInfo(closeDelimStart, end, classNamesMap.DELIM));

  return { marks };
}

function getLinkOrImageInfo(node, start, end) {
  const marks = [];
  const { type, lastChild } = node;

  let linkTextStart = start;
  let lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 2; // 2: length of '[]'

  marks.push(createMarkInfo(start, end, cls('link')));

  if (type === 'image') {
    const linkTextEnd = { line: start.line, ch: start.ch + 1 };

    marks.push(createMarkInfo(linkTextStart, linkTextEnd, classNamesMap.META));

    linkTextStart = linkTextEnd;
    lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 3; // 3: length of '![]'
  }

  marks.push(createMarkInfo(linkTextStart, { line: end.line, ch: lastChildCh }, cls('link-desc')));
  marks.push(
    createMarkInfo(
      { line: start.line, ch: linkTextStart.ch + 1 },
      { line: end.line, ch: lastChildCh - 1 },
      classNamesMap.TEXT
    )
  );

  marks.push(createMarkInfo({ line: end.line, ch: lastChildCh }, end, cls('link-url')));
  marks.push(
    createMarkInfo(
      { line: end.line, ch: lastChildCh + 1 },
      { line: end.line, ch: end.ch - 1 },
      classNamesMap.TEXT
    )
  );

  return { marks };
}

function getCodeInfo(node, start, end) {
  const marks = [];
  const { tickCount } = node;
  const openDelimEnd = { line: start.line, ch: start.ch + tickCount };
  const closeDelimStart = { line: end.line, ch: end.ch - tickCount };

  marks.push(createMarkInfo(start, end, cls('code')));
  marks.push(createMarkInfo(start, openDelimEnd, classNamesMap.DELIM));
  marks.push(createMarkInfo(openDelimEnd, closeDelimStart, classNamesMap.TEXT));
  marks.push(createMarkInfo(closeDelimStart, end, classNamesMap.DELIM));

  return { marks };
}

function getCodeBlockLineClasses(startLine, endLine) {
  const lineClasses = [];

  for (let index = startLine; index <= endLine; index += 1) {
    lineClasses.push({ line: index, className: classNamesMap.CODE_BLOCK });
  }

  return lineClasses;
}

function codeBlock(node, start, end, endLineInfo) {
  const marks = [];
  const { fenceOffset, fenceLength, fenceChar, info } = node;
  const { line: startLine, ch: startCh } = start;
  const { line: endLine } = end;

  const fenceEnd = fenceOffset + fenceLength;
  const openDelimEnd = { line: startLine, ch: startCh + fenceEnd };

  marks.push(createMarkInfo(start, end, classNamesMap.CODE_BLOCK));
  marks.push(createMarkInfo(start, openDelimEnd, classNamesMap.DELIM));

  if (info) {
    marks.push(
      createMarkInfo(
        { line: startLine, ch: fenceEnd },
        { line: startLine, ch: fenceEnd + info.length },
        classNamesMap.META
      )
    );
  }

  const codeBlockEnd = `^(\\s{0,${fenceOffset}})(${fenceChar}{${fenceLength},})`;
  const CLOSED_RX = new RegExp(codeBlockEnd);

  let closeDelimStart = end;

  if (CLOSED_RX.test(endLineInfo)) {
    closeDelimStart = { line: endLine, ch: 0 };
    marks.push(createMarkInfo(closeDelimStart, end, classNamesMap.DELIM));
  }

  marks.push(createMarkInfo(openDelimEnd, closeDelimStart, classNamesMap.TEXT));

  return { marks, lineClasses: getCodeBlockLineClasses(startLine, endLine) };
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

function getBlockQuoteInfo(node, start, end) {
  const marks = [];

  if (node.parent && node.parent.type !== 'blockQuote') {
    marks.push(createMarkInfo(start, end, cls('block-quote')));
  }

  if (node.firstChild) {
    addMarkInfokOfListItemChildren(node.firstChild, classNamesMap.TEXT, marks);
  }

  return { marks };
}

function getClassNameOfListItem(node) {
  let depth = 0;

  while (node.parent.parent && node.parent.parent.type === 'item') {
    node = node.parent.parent;
    depth += 1;
  }

  const newClassNames = ['list-item-odd', 'list-item-even'];
  const newClassName = newClassNames[depth % 2];

  // @TODO remove it in the next major version
  // these class names are for the legacy style 'old.css'
  const oldClassNames = ['first', 'second', 'third'];
  const oldClassName = oldClassNames[depth % 3];

  return `${cls(['list-item', `${newClassName}`])} ${oldClassName}`;
}

function getListItemInfo(node, start) {
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
        `${itemClassName} ${classNamesMap.DELIM}`
      )
    );
    marks.push(
      createMarkInfo(
        { line, ch: chWithPadding + 1 },
        { line, ch: chWithPadding + 2 },
        classNamesMap.META
      )
    );
  }

  addMarkInfokOfListItemChildren(node.firstChild, `${itemClassName} ${classNamesMap.TEXT}`, marks);

  return { marks };
}

/**
 * Gets mark information to the markdown node.
 * @param {Object} node - node returned from ToastMark
 * @param {Object} start - start node's data
 * @param {Object} end - end node's data
 * @param {Object} endLine - end line's data
 * @ignore
 */
export function getMarkInfo(node, start, end, endLine) {
  const { type } = node;

  switch (type) {
    case 'heading':
      return getHeadingInfo(node, start, end);
    case 'strong':
    case 'emph':
    case 'strike':
      return getEmphasisAndStrikethroughInfo(node, start, end);
    case 'link':
    case 'image':
      return getLinkOrImageInfo(node, start, end);
    case 'code':
      return getCodeInfo(node, start, end);
    case 'codeBlock':
      return codeBlock(node, start, end, endLine);
    case 'blockQuote':
      return getBlockQuoteInfo(node, start, end);
    case 'item':
      return getListItemInfo(node, start, end);
    default:
      return simpleMarkNode[type]
        ? { marks: [createMarkInfo(start, end, simpleMarkNode[type])] }
        : null;
  }
}
