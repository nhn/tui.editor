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

export function repeat(text: string, count: number) {
  let result = '';

  for (let i = 0; i < count; i += 1) {
    result += text;
  }

  return result;
}

export function escape(text: string, startOfLine?: boolean) {
  const result = text.replace(/[`*\\~[\]]/g, '\\$&');

  if (startOfLine) {
    return result.replace(/^[:#\-*+]/, '\\$&').replace(/^(\d+)\./, '$1\\.');
  }

  return result;
}

export function quote(text: string) {
  let result;

  if (text.indexOf('"') === -1) {
    result = '""';
  } else {
    result = text.indexOf("'") === -1 ? "''" : '()';
  }

  return result[0] + text + result[1];
}
