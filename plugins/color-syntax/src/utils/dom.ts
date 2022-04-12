function hasClass(element: HTMLElement, className: string) {
  return element.classList.contains(className);
}

export function findParentByClassName(el: HTMLElement, className: string) {
  let currentEl: HTMLElement | null = el;

  while (currentEl && !hasClass(currentEl, className)) {
    currentEl = currentEl.parentElement;
  }

  return currentEl;
}
