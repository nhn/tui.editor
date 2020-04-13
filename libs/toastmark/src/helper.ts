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
