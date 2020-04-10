export function last<T>(arr: T[]): T;
export function last(arr: string): string;

export function last<T>(arr: T[] | string) {
  return arr[arr.length - 1];
}

type OmitedKey<T, K extends keyof T> = keyof Omit<T, K>;

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

export function iterateObject<T>(obj: T, iteratee: (key: any, obj: T) => void) {
  Object.keys(obj).forEach(key => {
    iteratee(key, obj);
  });
}

export function omit<T extends object, K extends keyof T>(obj: T, ...propNames: K[]) {
  const resultMap = {} as Omit<T, K>;
  Object.keys(obj).forEach(key => {
    if (propNames.indexOf(key as K) === -1) {
      resultMap[key as OmitedKey<T, K>] = obj[key as OmitedKey<T, K>];
    }
  });
  return resultMap;
}

export function isEmptyObj<T extends object>(obj: T) {
  return !Object.keys(obj).length;
}
