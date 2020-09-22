export function last<T>(arr: T[]): T;
export function last(arr: string): string;

export function last<T>(arr: T[] | string) {
  return arr[arr.length - 1];
}

// normalize a reference in reference link (remove []s, trim,
// collapse internal space, unicode case fold.
// See commonmark/commonmark.js#168.
export function normalizeReference(str: string) {
  return str
    .slice(1, str.length - 1)
    .trim()
    .replace(/[ \t\r\n]+/, ' ')
    .toLowerCase()
    .toUpperCase();
}

export function iterateObject<T>(obj: T, iteratee: (key: keyof T, value: T[keyof T]) => void) {
  Object.keys(obj).forEach(key => {
    iteratee(key as keyof T, obj[key as keyof T]);
  });
}

export function omit<T extends object>(obj: T, ...propNames: (keyof T)[]) {
  const resultMap = { ...obj };
  propNames.forEach(key => {
    delete resultMap[key];
  });
  return resultMap;
}

export function isEmptyObj<T extends object>(obj: T) {
  return !Object.keys(obj).length;
}

export function clearObj<T extends object>(obj: T) {
  Object.keys(obj).forEach(key => {
    delete obj[key as keyof T];
  });
}
