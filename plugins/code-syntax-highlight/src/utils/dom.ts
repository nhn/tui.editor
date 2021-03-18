function stringToNumber(value: string) {
  return parseInt(value, 10);
}

export function isPositionInBox(style: CSSStyleDeclaration, offsetX: number, offsetY: number) {
  const left = stringToNumber(style.left);
  const top = stringToNumber(style.top);
  const width =
    stringToNumber(style.width) +
    stringToNumber(style.paddingLeft) +
    stringToNumber(style.paddingRight);
  const height =
    stringToNumber(style.height) +
    stringToNumber(style.paddingTop) +
    stringToNumber(style.paddingBottom);

  return offsetX >= left && offsetX <= left + width && offsetY >= top && offsetY <= top + height;
}

export function removeNode(node: Node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

const CLS_PREFIX = 'toastui-editor-';

export function cls(...names: string[]) {
  return names.map((className) => `${CLS_PREFIX}${className}`).join(' ');
}
