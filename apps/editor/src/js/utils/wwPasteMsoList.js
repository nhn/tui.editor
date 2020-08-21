import domUtils from './dom';

const MSO_CLASS_NAME_LIST_RX = /MsoListParagraph/;
const MSO_CLASS_NAME_NORMAL_RX = /MsoNormal/;
const MSO_STYLE_PREFIX_RX = /style=.*mso-/;
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

function getListItemContents(pTag) {
  const removedNodes = [];
  const walker = document.createTreeWalker(pTag, 1, null, false);

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (
      domUtils.isElemNode(node) &&
      (isFromMso(node.outerHTML) || MSO_TAG_NAME_RX.test(node.nodeName))
    ) {
      removedNodes.push(node);
    }
  }

  removedNodes.forEach(domUtils.remove);

  return pTag.innerHTML.trim();
}

function createListItemDataFromPTag(pTag, index) {
  const styleAttr = pTag.getAttribute('style');
  const [, listItemInfo] = styleAttr.match(MSO_STYLE_LIST_RX);
  const [, levelStr] = listItemInfo.trim().split(' ');
  const level = parseInt(levelStr.replace('level', ''), 10);
  const unorderedListItem = UNORDERED_LIST_BULLET_RX.test(pTag.textContent);

  return {
    id: index,
    level,
    prev: null,
    parent: null,
    children: [],
    unorderedListItem,
    contents: getListItemContents(pTag)
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

function createListData(pTags) {
  const listData = [];

  pTags.forEach((pTag, index) => {
    const prevListItemData = listData[index - 1];
    const listItemData = createListItemDataFromPTag(pTag, index);

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

function makeListFromPTags(pTags) {
  const listData = createListData(pTags);
  const rootChildren = listData.filter(({ parent }) => !parent);

  return makeList(rootChildren);
}

/**
 * Convert pargraphs of ms office to standard list element
 * @param {HTMLElement} container - container element to convert to list
 */
export function convertMsoParagraphToList(container) {
  let pTags = [];

  domUtils.findAll(container, 'p').forEach(pTag => {
    const { className, nextSibling } = pTag;

    if (MSO_CLASS_NAME_LIST_RX.test(className)) {
      pTags.push(pTag);

      if (!nextSibling || (nextSibling && MSO_CLASS_NAME_NORMAL_RX.test(nextSibling.className))) {
        const list = makeListFromPTags(pTags);
        const target = nextSibling || container;

        if (nextSibling) {
          domUtils.prepend(target, list);
        } else {
          domUtils.append(target, list);
        }

        pTags.forEach(domUtils.remove);
        pTags = [];
      }
    }
  });
}
