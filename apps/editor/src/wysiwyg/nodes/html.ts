import { Node as ProsemirrorNode, DOMOutputSpecArray, NodeSpec } from 'prosemirror-model';
import toArray from 'tui-code-snippet/collection/toArray';
import { ToDOMAdaptor } from '@t/convertor';
import { CustomHTMLRendererMap } from '@t/markdown';
import { SchemaMap } from '@t/editor';

export function getHtmlAttrs(dom: HTMLElement) {
  return toArray(dom.attributes).reduce<Record<string, string | null>>((acc, attr) => {
    acc[attr.nodeName] = attr.nodeValue;
    return acc;
  }, {});
}

function createHTMLBlockSchema(typeName: string, wwToDOMAdaptor: ToDOMAdaptor): NodeSpec {
  return {
    content: 'block+',
    atom: true,
    group: 'block',
    attrs: {
      htmlAttrs: { default: {} },
      literal: { default: '' },
    },
    parseDOM: [
      {
        tag: typeName,
        getAttrs(dom: Node | string) {
          return {
            htmlAttrs: getHtmlAttrs(dom as HTMLElement),
            literal: (dom as HTMLElement).outerHTML,
          };
        },
      },
    ],
    toDOM(node: ProsemirrorNode): DOMOutputSpecArray {
      const dom = wwToDOMAdaptor.getToDOMNode(typeName)!(node) as HTMLElement;
      const htmlAttrs = getHtmlAttrs(dom);

      htmlAttrs.class = htmlAttrs.class ? `${htmlAttrs.class} html-block` : 'html-block';

      return [typeName, htmlAttrs, ...toArray(dom.childNodes)];
    },
  };
}

export function createHTMLBlockSchemaMap(
  renderer: CustomHTMLRendererMap,
  wwToDOMAdaptor: ToDOMAdaptor
) {
  const htmlBlockSchemaMap: SchemaMap = {};

  if (renderer?.htmlBlock) {
    Object.keys(renderer.htmlBlock).forEach(
      (type) => (htmlBlockSchemaMap[type] = createHTMLBlockSchema(type, wwToDOMAdaptor))
    );
  }
  return htmlBlockSchemaMap;
}
