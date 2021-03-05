import { Node as ProsemirrorNode, DOMOutputSpecArray, NodeSpec } from 'prosemirror-model';
import toArray from 'tui-code-snippet/collection/toArray';
import { ToDOMAdaptor } from '@t/convertor';
import { CustomHTMLRendererMap } from '@t/markdown';
import { SchemaMap } from '@t/editor';
import { ATTRIBUTE, reHTMLTag } from '@/convertors/toWysiwyg/htmlToWwConvertors';

export function getHTMLAttrsByHTMLString(html: string) {
  html = html.match(reHTMLTag)![0];
  const attrs = html.match(new RegExp(ATTRIBUTE, 'g'));

  return attrs
    ? attrs.reduce<Record<string, string | null>>((acc, attr) => {
        const [name, value] = attr.trim().split('=');

        if (value) {
          acc[name] = value.replace(/'|"/g, '').trim();
        }

        return acc;
      }, {})
    : {};
}

export function getHTMLAttrs(dom: HTMLElement) {
  return toArray(dom.attributes).reduce<Record<string, string | null>>((acc, attr) => {
    acc[attr.nodeName] = attr.nodeValue;
    return acc;
  }, {});
}

function createHTMLBlockSchema(typeName: string, wwToDOMAdaptor: ToDOMAdaptor): NodeSpec {
  return {
    atom: true,
    content: 'block+',
    group: 'block',
    attrs: {
      htmlAttrs: { default: {} },
      childrenHTML: { default: '' },
    },
    parseDOM: [
      {
        tag: typeName,
        getAttrs(dom: Node | string) {
          return {
            htmlAttrs: getHTMLAttrs(dom as HTMLElement),
            childrenHTML: (dom as HTMLElement).innerHTML,
          };
        },
      },
    ],
    toDOM(node: ProsemirrorNode): DOMOutputSpecArray {
      const dom = wwToDOMAdaptor.getToDOMNode(typeName)!(node) as HTMLElement;
      const htmlAttrs = getHTMLAttrs(dom);

      htmlAttrs.class = htmlAttrs.class ? `${htmlAttrs.class} html-block` : 'html-block';

      return [typeName, htmlAttrs, ...toArray(dom.childNodes)];
    },
  };
}

function createHTMLInlineSchema(typeName: string, wwToDOMAdaptor: ToDOMAdaptor): NodeSpec {
  return {
    inline: true,
    content: 'inline*',
    group: 'inline',
    attrs: { htmlAttrs: { default: {} }, inline: { default: true } },
    parseDOM: [
      {
        tag: typeName,
        getAttrs(dom: Node | string) {
          return {
            htmlAttrs: getHTMLAttrs(dom as HTMLElement),
          };
        },
      },
    ],
    toDOM(node: ProsemirrorNode): DOMOutputSpecArray {
      const dom = wwToDOMAdaptor.getToDOMNode(typeName)!(node) as HTMLElement;
      const htmlAttrs = getHTMLAttrs(dom);

      return [typeName, htmlAttrs, 0];
    },
  };
}

export function createHTMLSchemaMap(renderer: CustomHTMLRendererMap, wwToDOMAdaptor: ToDOMAdaptor) {
  const htmlSchemaMap: SchemaMap = {};

  if (renderer?.htmlBlock) {
    Object.keys(renderer.htmlBlock).forEach(
      (type) => (htmlSchemaMap[type] = createHTMLBlockSchema(type, wwToDOMAdaptor))
    );
  }
  if (renderer?.htmlInline) {
    Object.keys(renderer.htmlInline).forEach(
      (type) => (htmlSchemaMap[type] = createHTMLInlineSchema(type, wwToDOMAdaptor))
    );
  }
  return htmlSchemaMap;
}
