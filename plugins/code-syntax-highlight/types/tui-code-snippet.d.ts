declare module 'tui-code-snippet/type/isFunction' {
  export default function isFunction(value: unknown): value is Function;
}

declare module 'tui-code-snippet/type/isString' {
  export default function isString(value: unknown): value is string;
}

declare module 'tui-code-snippet/collection/toArray' {
  export default function toArray<T>(value: ArrayLike<T>): T[];
}

declare module 'tui-code-snippet/array/inArray' {
  export default function inArray<T>(value: T, array: T[], startIndex?: number): number;
}

declare module 'tui-code-snippet/domUtil/css' {
  export default function css(
    element: Element,
    key: string | Record<string, any>,
    value?: string
  ): void;
}

declare module 'tui-code-snippet/domUtil/addClass' {
  export default function addClass(element: Element, ...classNames: string[]): void;
}

declare module 'tui-code-snippet/domUtil/removeClass' {
  export default function removeClass(element: Element, ...classNames: string[]): void;
}

declare module 'tui-code-snippet/domUtil/hasClass' {
  export default function hasClass(element: Element, ...classNames: string[]): boolean;
}
