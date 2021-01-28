import { DOMOutputSpecArray } from 'prosemirror-model';
import { HTMLToken, OpenTagToken, RawHTMLToken, TextToken } from '@t/markdown';

export type SpecArray = DOMOutputSpecArray & {
  push: typeof Array.prototype.push;
};

interface TokenToDOM<T> {
  openTag: (token: HTMLToken, stack: T[]) => void;
  closeTag: (token: HTMLToken, stack: T[]) => void;
  html: (token: HTMLToken, stack: T[]) => void;
  text: (token: HTMLToken, stack: T[]) => void;
}

function getTop<T>(stack: T[]) {
  return stack[stack.length - 1];
}

export const tokenToPmDOM: TokenToDOM<SpecArray> = {
  openTag(token, stack) {
    const { tagName, classNames, attributes } = token as OpenTagToken;
    const specArray: SpecArray = [tagName];
    let attrs: Record<string, any> = {};

    if (classNames) {
      attrs.class = classNames.join(' ');
    }
    attrs = { ...attrs, ...attributes };
    if (Object.keys(attrs).length) {
      specArray.push(attrs);
    }

    stack.push(specArray);
  },
  closeTag(_, stack) {
    if (stack.length > 1) {
      const specArray = stack.pop();

      getTop(stack).push(specArray);
    }
  },
  html(token, stack) {
    // html node should be ignored in prosemirror schema to control the wysiwyg node properly
    this.text(token, stack);
  },
  text(_, stack) {
    getTop(stack).push(0);
  },
};

export const tokenToDOMNode: TokenToDOM<HTMLElement> = {
  openTag(token, stack) {
    const { tagName, classNames, attributes } = token as OpenTagToken;
    const el = document.createElement(tagName);
    let attrs: Record<string, any> = {};

    if (classNames) {
      el.className = classNames.join(' ');
    }
    if (attributes) {
      attrs = { ...attrs, ...attributes };
    }
    Object.keys(attrs).forEach((attr) => {
      el.setAttribute(attr, attrs[attr]);
    });

    stack.push(el);
  },
  closeTag(_, stack) {
    if (stack.length > 1) {
      const el = stack.pop();

      getTop(stack).appendChild(el!);
    }
  },
  html(token, stack) {
    getTop(stack).insertAdjacentHTML('beforeend', (token as RawHTMLToken).content);
  },
  text(token, stack) {
    const textNode = document.createTextNode((token as TextToken).content);

    getTop(stack).appendChild(textNode);
  },
};
