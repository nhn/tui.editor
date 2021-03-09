export function isPositionInBox(style: CSSStyleDeclaration, offsetX: number, offsetY: number) {
  const left = parseInt(style.left, 10);
  const top = parseInt(style.top, 10);
  const width =
    parseInt(style.width, 10) + parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
  const height =
    parseInt(style.height, 10) + parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);

  return offsetX >= left && offsetX <= left + width && offsetY >= top && offsetY <= top + height;
}

export function removeNode(node: Node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

const CLS_PREFIX = 'tui-editor-';

export function cls(...names: string[]) {
  return names.map((className) => `${CLS_PREFIX}${className}`).join(' ');
}
