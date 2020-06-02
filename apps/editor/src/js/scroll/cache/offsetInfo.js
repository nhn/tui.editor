import toArray from 'tui-code-snippet/collection/toArray';

const offsetInfoMap = {};

export function setOffsetHeight(id, height) {
  offsetInfoMap[id] = offsetInfoMap[id] || {};
  offsetInfoMap[id].height = height;
}

export function setOffsetTop(id, offsetTop) {
  offsetInfoMap[id] = offsetInfoMap[id] || {};
  offsetInfoMap[id].offsetTop = offsetTop;
}

export function getOffsetHeight(id) {
  return offsetInfoMap[id] && offsetInfoMap[id].height;
}

export function getOffsetTop(id) {
  return offsetInfoMap[id] && offsetInfoMap[id].offsetTop;
}

export function removeOffsetInfoByNode(node) {
  if (node) {
    delete offsetInfoMap[node.getAttribute('data-nodeid')];
    toArray(node.children).forEach(child => {
      removeOffsetInfoByNode(child);
    });
  }
}
