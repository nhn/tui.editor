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

export function last<T>(arr: T[]) {
  return arr[arr.length - 1];
}

export function between(value: number, min: number, max: number) {
  return value >= min && value <= max;
}

function isObject(obj: unknown): obj is object {
  return typeof obj === 'object' && obj !== null;
}

export function deepMergedCopy<T1 extends Record<string, any>, T2 extends Record<string, any>>(
  targetObj: T1,
  obj: T2
) {
  const resultObj = { ...targetObj } as T1 & T2;

  if (targetObj && obj) {
    Object.keys(obj).forEach((prop: keyof T2) => {
      if (isObject(resultObj[prop])) {
        if (Array.isArray(obj[prop])) {
          resultObj[prop as keyof T1 & T2] = deepCopyArray(obj[prop]);
        } else if (resultObj.hasOwnProperty(prop)) {
          resultObj[prop] = deepMergedCopy(resultObj[prop], obj[prop]);
        } else {
          resultObj[prop as keyof T1 & T2] = deepCopy(obj[prop]);
        }
      } else {
        resultObj[prop as keyof T1 & T2] = obj[prop];
      }
    });
  }

  return resultObj;
}

export function deepCopyArray<T extends Array<any>>(items: T): T {
  return items.map((item) => {
    if (isObject(item)) {
      return Array.isArray(item) ? deepCopyArray(item) : deepCopy(item);
    }
    return item;
  }) as T;
}

export function deepCopy<T extends Record<string, any>>(obj: T) {
  const keys = Object.keys(obj);

  if (!keys.length) {
    return obj;
  }

  return keys.reduce((acc, prop: keyof T) => {
    if (isObject(obj[prop])) {
      acc[prop] = Array.isArray(obj[prop]) ? deepCopyArray(obj[prop]) : deepCopy(obj[prop]);
    } else {
      acc[prop] = obj[prop];
    }
    return acc;
  }, {} as T);
}

export function getSortedNumPair(valueA: number, valueB: number) {
  return valueA > valueB ? [valueB, valueA] : [valueA, valueB];
}
