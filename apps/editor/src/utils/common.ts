import isUndefined from 'tui-code-snippet/type/isUndefined';
import sendHostname from 'tui-code-snippet/request/sendHostname';

export const isMac = /Mac/.test(navigator.platform);

export function sendHostName() {
  sendHostname('editor', 'UA-129966929-1');
}

export function includes<T>(arr: T[], targetItem: T) {
  return arr.indexOf(targetItem) !== -1;
}

const availableLinkAttributes = ['rel', 'target', 'contenteditable', 'hreflang', 'type'];

/**
 * sanitize attribute for link
 * @param {?object} attribute - attribute for link
 * @returns {object} sanitized attribute
 */
export function sanitizeLinkAttribute(attribute: Record<string, any>) {
  if (!attribute) {
    return null;
  }

  const linkAttribute: Record<string, any> = {};

  availableLinkAttributes.forEach(key => {
    if (!isUndefined(attribute[key])) {
      linkAttribute[key] = attribute[key];
    }
  });

  return linkAttribute;
}
