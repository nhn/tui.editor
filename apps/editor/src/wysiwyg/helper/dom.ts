// @TODO move to utils/dom.ts
export function isPositionInBox(style: CSSStyleDeclaration, offsetX: number, offsetY: number) {
  const rect = {
    left: parseInt(style.left, 10),
    top: parseInt(style.top, 10),
    width: parseInt(style.width, 10),
    height: parseInt(style.height, 10)
  };

  return (
    offsetX >= rect.left &&
    offsetX <= rect.left + rect.width &&
    offsetY >= rect.top &&
    offsetY <= rect.top + rect.height
  );
}
