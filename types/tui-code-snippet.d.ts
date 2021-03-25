declare module 'tui-code-snippet/type/isFunction' {
  export default function isFunction(value: unknown): value is Function;
}

declare module 'tui-code-snippet/type/isUndefined' {
  export default function isUndefined(value: unknown): value is undefined;
}

declare module 'tui-code-snippet/type/isFalsy' {
  export default function isFalsy(value: unknown): value is false;
}

declare module 'tui-code-snippet/type/isString' {
  export default function isString(value: unknown): value is string;
}

declare module 'tui-code-snippet/type/isArray' {
  export default function isArray(value: unknown): value is any[];
}

declare module 'tui-code-snippet/type/isExisty' {
  export default function isExisty(value: unknown): value is NonNullable<any>;
}

declare module 'tui-code-snippet/type/isNumber' {
  export default function isNumber(value: unknown): value is number;
}

declare module 'tui-code-snippet/type/isNull' {
  export default function isNull(value: unknown): value is null;
}

declare module 'tui-code-snippet/type/isObject' {
  export default function isObject(value: unknown): value is object;
}

declare module 'tui-code-snippet/type/isBoolean' {
  export default function isBoolean(value: unknown): value is boolean;
}

declare module 'tui-code-snippet/collection/forEachOwnProperties' {
  export default function forEachOwnProperties<T extends object>(
    obj: T,
    iteratee: (value: NonNullable<T[keyof T]>, key: keyof T, targetObj: T) => boolean | void,
    context?: object
  ): void;
}

declare module 'tui-code-snippet/collection/forEachArray' {
  export default function forEachArray<T>(
    arr: Array<T> | ArrayLike<T>,
    iteratee: (value: T, index: number, targetArr: Array<T> | ArrayLike<T>) => boolean | void,
    context?: object
  ): void;
}

declare module 'tui-code-snippet/collection/toArray' {
  export default function toArray<T>(value: ArrayLike<T>): T[];
}

declare module 'tui-code-snippet/array/inArray' {
  export default function inArray<T>(value: T, array: T[], startIndex?: number): number;
}

declare module 'tui-code-snippet/object/extend' {
  export default function extend<T extends object, K extends object>(target: T, source: K): T & K;
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

declare module 'tui-code-snippet/domEvent/on' {
  export default function on(
    element: Element,
    types: string,
    handler: (...args: any[]) => any
  ): void;
}

declare module 'tui-code-snippet/domEvent/off' {
  export default function off(
    element: Element,
    types: string,
    handler?: (...args: any[]) => any
  ): void;
}

declare module 'tui-code-snippet/request/sendHostname' {
  export default function sendHostname(appName: string, trackingId: string): void;
}

declare module 'tui-code-snippet/domUtil/matches' {
  export default function matches(element: Element, selector: string): boolean;
}

declare module 'tui-code-snippet/tricks/throttle' {
  export default function throttle(fn: () => void, interval: number): () => void;
}

declare module 'tui-code-snippet/domUtil/closest' {
  export default function closest(el: HTMLElement, found: string): HTMLElement | null;
}
