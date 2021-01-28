import toArray from 'tui-code-snippet/collection/toArray';
import { getTotalOffsetTop } from './dom';

const offsetInfoMap: { [key: number]: { height: number; offsetTop: number } } = {};

export function setHeight(id: number, height: number) {
  offsetInfoMap[id] = offsetInfoMap[id] || {};
  offsetInfoMap[id].height = height;
}

export function setOffsetTop(id: number, offsetTop: number) {
  offsetInfoMap[id] = offsetInfoMap[id] || {};
  offsetInfoMap[id].offsetTop = offsetTop;
}

export function getHeight(id: number) {
  return offsetInfoMap[id] && offsetInfoMap[id].height;
}

export function getOffsetTop(id: number) {
  return offsetInfoMap[id] && offsetInfoMap[id].offsetTop;
}

export function removeOffsetInfoByNode(node: HTMLElement) {
  if (node) {
    delete offsetInfoMap[Number(node.getAttribute('data-nodeid'))];
    toArray(node.children).forEach((child) => {
      removeOffsetInfoByNode(child as HTMLElement);
    });
  }
}

export function getAndSaveOffsetInfo(node: HTMLElement, root: HTMLElement, mdNodeId: number) {
  const cachedHeight = getHeight(mdNodeId);
  const cachedTop = getOffsetTop(mdNodeId);
  const nodeHeight = cachedHeight || node.clientHeight;
  const offsetTop = cachedTop || getTotalOffsetTop(node, root) || node.offsetTop;

  if (!cachedHeight) {
    setHeight(mdNodeId, nodeHeight);
  }

  if (!cachedTop) {
    setOffsetTop(mdNodeId, offsetTop);
  }

  return { nodeHeight, offsetTop };
}
