export function flatten<T>(arr: T[]): T[] {
  return arr.reduce<T[]>((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}
