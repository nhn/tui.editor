export function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function toggleClass(element, className) {
  if (element) {
    element.classList.toggle(className);
  }

  return null;
}
