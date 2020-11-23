import domUtils from './dom';

const MSO_CLASS_NAME_LIST_PARA = 'p.MsoListParagraph';
const MSO_CLASS_NAME_LIST_RX = /MsoListParagraph/;
const MSO_STYLE_PREFIX_RX = /style=(.|\n)*mso-/;
const MSO_STYLE_LIST_RX = /mso-list:(.*)/;
const MSO_TAG_NAME_RX = /O:P/;
const UNORDERED_LIST_BULLET_RX = /^(n|u|l)/;

/**
 * Whether html string is copied from ms office or not
 * ms office use specific css attributes with 'mso-' prefix
 * @param {string} html - html string
 * @returns {boolean}
 */
export function isFromMso(html) {
  return MSO_STYLE_PREFIX_RX.test(html);
}

function getListItemContents(para) {
  const removedNodes = [];
  const walker = document.createTreeWalker(para, 1, null, false);

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (domUtils.isElemNode(node)) {
      const { outerHTML, textContent } = node;
      const msoSpan = MSO_STYLE_PREFIX_RX.test(outerHTML);
      const bulletSpan = MSO_STYLE_LIST_RX.test(outerHTML);

      if (msoSpan && !bulletSpan && textContent) {
        removedNodes.push([node, true]);
      } else if (MSO_TAG_NAME_RX.test(node.nodeName) || (msoSpan && !textContent) || bulletSpan) {
        removedNodes.push([node, false]);
      }
    }
  }

  removedNodes.forEach(([node, isUnwrap]) => {
    if (isUnwrap) {
      domUtils.unwrap(node);
    } else {
      domUtils.remove(node);
    }
  });

  return para.innerHTML.trim();
}

function createListItemDataFromParagraph(para, index) {
  const styleAttr = para.getAttribute('style');
  const [, listItemInfo] = styleAttr.match(MSO_STYLE_LIST_RX);
  const [, levelStr] = listItemInfo.trim().split(' ');
  const level = parseInt(levelStr.replace('level', ''), 10);
  const unorderedListItem = UNORDERED_LIST_BULLET_RX.test(para.textContent);

  return {
    id: index,
    level,
    prev: null,
    parent: null,
    children: [],
    unorderedListItem,
    contents: getListItemContents(para)
  };
}

function addListItemDetailData(data, prevData) {
  if (prevData.level < data.level) {
    prevData.children.push(data);
    data.parent = prevData;
  } else {
    while (prevData) {
      if (prevData.level === data.level) {
        break;
      }
      prevData = prevData.parent;
    }

    if (prevData) {
      data.prev = prevData;
      data.parent = prevData.parent;

      if (data.parent) {
        data.parent.children.push(data);
      }
    }
  }
}

function createListData(paras) {
  const listData = [];

  paras.forEach((para, index) => {
    const prevListItemData = listData[index - 1];
    const listItemData = createListItemDataFromParagraph(para, index);

    if (prevListItemData) {
      addListItemDetailData(listItemData, prevListItemData);
    }

    listData.push(listItemData);
  });

  return listData;
}

function makeList(listData) {
  const listTagName = listData[0].unorderedListItem ? 'ul' : 'ol';
  const list = document.createElement(listTagName);

  listData.forEach(data => {
    const { children, contents } = data;
    const listItem = document.createElement('li');

    listItem.innerHTML = contents;
    list.appendChild(listItem);

    if (children.length) {
      list.appendChild(makeList(children));
    }
  });

  return list;
}

function makeListFromParagraphs(paras) {
  const listData = createListData(paras);
  const rootChildren = listData.filter(({ parent }) => !parent);

  return makeList(rootChildren);
}

function isMsoListParagraphEnd(node) {
  while (node) {
    if (domUtils.isElemNode(node)) {
      break;
    }
    node = node.nextSibling;
  }

  return node ? !MSO_CLASS_NAME_LIST_RX.test(node.className) : true;
}

/**
 * Convert pargraphs of ms office to standard list element
 * @param {HTMLElement} container - container element to convert to list
 */
export function convertMsoParagraphsToList(container) {
  let paras = [];

  domUtils.findAll(container, MSO_CLASS_NAME_LIST_PARA).forEach(para => {
    const msoListParaEnd = isMsoListParagraphEnd(para.nextSibling);

    paras.push(para);

    if (msoListParaEnd) {
      const list = makeListFromParagraphs(paras);
      const { nextSibling } = para;

      if (nextSibling) {
        domUtils.insertBefore(list, nextSibling);
      } else {
        domUtils.append(container, list);
      }

      paras = [];
    }

    domUtils.remove(para);
  });

  return container;
}
