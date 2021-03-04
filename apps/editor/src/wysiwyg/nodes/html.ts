import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';
import toArray from 'tui-code-snippet/collection/toArray';

export function createHTMLSchema(tagName: string, renderer, wwToDOMAdaptor) {
  return {
    content: 'block+',
    atom: true,
    group: 'block',
    attrs: {
      childNodes: { default: null },
      htmlAttrs: { default: {} },
      literal: { default: '' },
    },
    parseDOM: [
      {
        tag: tagName,
        getAttrs(dom: Node | string) {
          const { attributes, childNodes, outerHTML } = dom as HTMLElement;
          const htmlAttrs: Record<string, string | null> = {};

          toArray(attributes).forEach((attr) => (htmlAttrs[attr.nodeName] = attr.nodeValue));

          return { childNodes, htmlAttrs, literal: outerHTML };
        },
      },
    ],
    toDOM(node: ProsemirrorNode): DOMOutputSpecArray {
      const { htmlAttrs, childNodes } = node.attrs;
      const className = htmlAttrs.class ? `${htmlAttrs.class} html-block` : 'html-block';

      const specArray = wwToDOMAdaptor.getToDOM(tagName)(node);

      console.log(specArray);

      htmlAttrs.class = className;

      if (childNodes) {
        return [tagName, htmlAttrs, ...toArray(childNodes)];
      }
      return [tagName, htmlAttrs, 0];
    },
  };
}
