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

export function shallowEqual(o1: Record<string, any>, o2: Record<string, any>) {
  if (typeof o1 !== 'object' || typeof o2 !== 'object') {
    return o1 === o2;
  }
  for (const key in o1) {
    if (o1[key] !== o2[key]) {
      return false;
    }
  }
  for (const key in o2) {
    if (!(key in o1)) {
      return false;
    }
  }

  return true;
}
