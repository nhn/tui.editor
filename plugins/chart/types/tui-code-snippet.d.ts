declare module 'tui-code-snippet/type/isUndefined' {
  export default function isUndefined(value: unknown): value is undefined;
}

declare module 'tui-code-snippet/type/isString' {
  export default function isString(value: unknown): value is string;
}

declare module 'tui-code-snippet/array/inArray' {
  export default function inArray<T>(value: T, array: T[], startIndex?: number): number;
}

declare module 'tui-code-snippet/object/extend' {
  export default function extend<T extends object, K extends object>(target: T, source: K): T & K;
}
