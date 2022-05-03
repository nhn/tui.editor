import isUndefined from 'tui-code-snippet/type/isUndefined';
import hasClass from 'tui-code-snippet/domUtil/hasClass';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import 'tui-code-snippet/domUtil/matches';

export function isPositionInBox(style: CSSStyleDeclaration, offsetX: number, offsetY: number) {
  const left = parseInt(style.left, 10);
  const top = parseInt(style.top, 10);
  const width =
    parseInt(style.width, 10) + parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
  const height =
    parseInt(style.height, 10) + parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);

  return offsetX >= left && offsetX <= left + width && offsetY >= top && offsetY <= top + height;
}

export function toggleClass(element: Element, className: string, state?: boolean) {
  if (isUndefined(state)) {
    state = !hasClass(element, className);
  }
  const toggleFn = state ? addClass : removeClass;

  toggleFn(element, className);
}
