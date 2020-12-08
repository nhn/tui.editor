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

export const tokenToPmDOM: TokenToDOM<SpecArray> = {
  openTag(token, stack) {
    const { tagName, classNames, attributes } = token as OpenTagToken;
    const specArray: SpecArray = [tagName];
    let attrs: Record<string, any> = {};

    if (classNames) {
      attrs.class = classNames.join(' ');
    }
    if (attributes) {
      attrs = { ...attrs, ...attributes };
    }
    if (Object.keys(attrs).length) {
      specArray.push(attrs);
    }

    stack.push(specArray);
  },
  closeTag(_, stack) {
    if (stack.length > 1) {
      const specArray = stack.pop();
      const top = stack[stack.length - 1];

      top.push(specArray);
    }
  },
  html(token, stack) {
    const top = stack[stack.length - 1];
    const container = document.createElement('div');

    container.innerHTML = (token as RawHTMLToken).content;

    top.push(container.firstChild);
  },
  text(_, stack) {
    const top = stack[stack.length - 1];

    top.push(0);
  }
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
    Object.keys(attrs).forEach(attr => {
      el.setAttribute(attr, attrs[attr]);
    });

    stack.push(el);
  },
  closeTag(_, stack) {
    if (stack.length > 1) {
      const el = stack.pop();
      const parent = stack[stack.length - 1];

      parent.appendChild(el!);
    }
  },
  html(token, stack) {
    const parent = stack[stack.length - 1];

    parent.insertAdjacentHTML('beforeend', (token as RawHTMLToken).content);
  },
  text(token, stack) {
    const textNode = document.createTextNode((token as TextToken).content);
    const parent = stack[stack.length - 1];

    parent.appendChild(textNode);
  }
};
