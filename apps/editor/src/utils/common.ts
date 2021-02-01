import isUndefined from 'tui-code-snippet/type/isUndefined';
import sendHostname from 'tui-code-snippet/request/sendHostname';

import { LinkAttributeNames, LinkAttributes } from '@t/editor';

export const isMac = /Mac/.test(navigator.platform);

export function sendHostName() {
  sendHostname('editor', 'UA-129966929-1');
}

export function includes<T>(arr: T[], targetItem: T) {
  return arr.indexOf(targetItem) !== -1;
}

const availableLinkAttributes: LinkAttributeNames[] = ['rel', 'target', 'hreflang', 'type'];

export function sanitizeLinkAttribute(attribute: LinkAttributes) {
  if (!attribute) {
    return null;
  }

  const linkAttributes: LinkAttributes = {};

  availableLinkAttributes.forEach((key) => {
    if (!isUndefined(attribute[key])) {
      linkAttributes[key] = attribute[key];
    }
  });

  return linkAttributes;
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

export function shallowEqual(o1: Record<string, any>, o2: Record<string, any>) {
  if (o1 === null && o1 === o2) {
    return true;
  }
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
