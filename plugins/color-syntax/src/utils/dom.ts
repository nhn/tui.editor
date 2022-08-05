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

export function removeProseMirrorHackNodes(html: string) {
  const reProseMirrorImage = /<img class="ProseMirror-separator" alt="">/g;
  const reProseMirrorTrailingBreak = / class="ProseMirror-trailingBreak"/g;

  let resultHTML = html;

  resultHTML = resultHTML.replace(reProseMirrorImage, '');
  resultHTML = resultHTML.replace(reProseMirrorTrailingBreak, '');

  return resultHTML;
}
