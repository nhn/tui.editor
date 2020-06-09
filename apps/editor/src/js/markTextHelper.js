import isFunction from 'tui-code-snippet/type/isFunction';
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import {
  getMdStartLine,
  getMdStartCh,
  getMdEndLine,
  getMdEndCh,
  addChPos,
  setChPos
} from './utils/markdown';

const CLS_PREFIX = 'tui-md-';

const classNameMap = applyClsToValue({
  DELIM: 'delimiter',
  META: 'meta',
  TEXT: 'marked-text',
  THEMATIC_BREAK: 'thematic-break',
  CODE_BLOCK: 'code-block',
  TABLE: 'table',
  HTML: 'html'
});

const delimSize = {
  strong: 2,
  emph: 1,
  strike: 2
};

function cls(...names) {
  return names.map(className => `${CLS_PREFIX}${className}`).join(' ');
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

function heading({ level, headingType }, start, end) {
  const marks = [markInfo(start, end, cls('heading', `heading${level}`))];

  if (headingType === 'atx') {
    marks.push(markInfo(start, addChPos(start, level), classNameMap.DELIM));
  } else {
    marks.push(markInfo(setChPos(end, 0), end, `${classNameMap.DELIM} setext`));
  }

  return { marks };
}

function emphasisAndStrikethrough({ type }, start, end) {
  return {
    marks: [
      markInfo(start, end, cls(`${type}`)),
      markInfo(start, addChPos(start, delimSize[type]), classNameMap.DELIM),
      markInfo(addChPos(end, -delimSize[type]), end, classNameMap.DELIM)
    ]
  };
}

function markLink(start, end, linkTextStart, lastChildCh) {
  return [
    markInfo(start, end, cls('link')),
    markInfo(linkTextStart, setChPos(end, lastChildCh), cls('link-desc')),
    markInfo(
      setChPos(start, linkTextStart.ch + 1),
      setChPos(end, lastChildCh - 1),
      classNameMap.TEXT
    ),
    markInfo(setChPos(end, lastChildCh), end, cls('link-url')),
    markInfo(setChPos(end, lastChildCh + 1), addChPos(end, -1), classNameMap.TEXT)
  ];
}

function image({ lastChild }, start, end) {
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 3; // 3: length of '![]'
  const linkTextEnd = addChPos(start, 1);

  return {
    marks: [
      markInfo(start, linkTextEnd, classNameMap.META),
      ...markLink(start, end, linkTextEnd, lastChildCh)
    ]
  };
}

function link({ lastChild, extendedAutolink }, start, end) {
  const lastChildCh = lastChild ? getMdEndCh(lastChild) + 1 : 2; // 2: length of '[]'
  const marks = extendedAutolink
    ? [markInfo(start, end, `${cls('link', 'link-desc')} ${classNameMap.TEXT}`)]
    : markLink(start, end, start, lastChildCh);

  return { marks };
}

function code({ tickCount }, start, end) {
  const openDelimEnd = addChPos(start, tickCount);
  const closeDelimStart = addChPos(end, -tickCount);

  return {
    marks: [
      markInfo(start, end, cls('code')),
      markInfo(start, openDelimEnd, `${classNameMap.DELIM} start`),
      markInfo(openDelimEnd, closeDelimStart, classNameMap.TEXT),
      markInfo(closeDelimStart, end, `${classNameMap.DELIM} end`)
    ]
  };
}

function codeBlock(node, start, end, endLine) {
  const { fenceOffset, fenceLength, fenceChar, info, infoPadding, parent } = node;
  const fenceEnd = fenceOffset + fenceLength;
  const marks = [markInfo(setChPos(start, 0), end, classNameMap.CODE_BLOCK)];

  if (fenceChar) {
    marks.push(markInfo(start, addChPos(start, fenceEnd), classNameMap.DELIM));
  }

  if (info) {
    marks.push(
      markInfo(
        setChPos(start, fenceEnd),
        setChPos(start, fenceEnd + infoPadding + info.length),
        classNameMap.META
      )
    );
  }

  const codeBlockEnd = `^(\\s{0,3})(${fenceChar}{${fenceLength},})`;
  const CLOSED_RX = new RegExp(codeBlockEnd);

  if (CLOSED_RX.test(endLine)) {
    marks.push(markInfo(setChPos(end, 0), end, classNameMap.DELIM));
  }

  const lineBackground =
    parent.type !== 'item' && parent.type !== 'blockQuote'
      ? {
          start: start.line,
          end: end.line,
          className: classNameMap.CODE_BLOCK
        }
      : null;

  return {
    marks,
    lineBackground: { ...lineBackground }
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

  return `${cls('list-item', `${newClassName}`)} ${oldClassName}`;
}

function item(node, start) {
  const itemClassName = getClassNameOfListItem(node);
  const { padding, task } = node.listData;

  return {
    marks: [
      markInfo(start, addChPos(start, padding), `${itemClassName} ${cls('list-item-bullet')}`),
      ...(task
        ? [
            markInfo(
              addChPos(start, padding),
              addChPos(start, padding + 3),
              `${itemClassName} ${classNameMap.DELIM}`
            ),
            markInfo(addChPos(start, padding + 1), addChPos(start, padding + 2), classNameMap.META)
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

const simpleMarkClassNameMap = {
  thematicBreak: classNameMap.THEMATIC_BREAK,
  table: classNameMap.TABLE,
  tableCell: classNameMap.TEXT,
  htmlInline: classNameMap.HTML
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
