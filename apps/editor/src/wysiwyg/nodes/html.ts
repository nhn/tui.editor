import { Node as ProsemirrorNode, DOMOutputSpecArray, NodeSpec } from 'prosemirror-model';
import { HTMLConvertorMap, MdNode } from '@toast-ui/toastmark';
import toArray from 'tui-code-snippet/collection/toArray';
import { ToDOMAdaptor } from '@t/convertor';
import { SchemaMap, Sanitizer } from '@t/editor';
import { ATTRIBUTE, reHTMLTag } from '@/convertors/toWysiwyg/htmlToWwConvertors';
import { registerTagWhitelistIfPossible } from '@/sanitizer/htmlSanitizer';

export function getChildrenHTML(node: MdNode, typeName: string) {
  return node
    .literal!.replace(new RegExp(`(<\\s*${typeName}[^>]+?>)|(</${typeName}\\s*[>])`, 'ig'), '')
    .trim();
}

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

export function sanitizeDOM(
  node: ProsemirrorNode,
  typeName: string,
  sanitizer: Sanitizer,
  wwToDOMAdaptor: ToDOMAdaptor
) {
  let dom = wwToDOMAdaptor.getToDOMNode(typeName)!(node) as HTMLElement;
  const html = sanitizer(dom.outerHTML);
  const container = document.createElement('div');

  container.innerHTML = html;
  dom = container.firstChild as HTMLElement;

  const htmlAttrs = getHTMLAttrs(dom);

  return { dom, htmlAttrs };
}

const schemaFactory = {
  htmlBlock(typeName: string, sanitizeHTML: Sanitizer, wwToDOMAdaptor: ToDOMAdaptor): NodeSpec {
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
        const { dom, htmlAttrs } = sanitizeDOM(node, typeName, sanitizeHTML, wwToDOMAdaptor);

        htmlAttrs.class = htmlAttrs.class ? `${htmlAttrs.class} html-block` : 'html-block';

        return [typeName, htmlAttrs, ...toArray(dom.childNodes)];
      },
    };
  },
  htmlInline(typeName: string, sanitizeHTML: Sanitizer, wwToDOMAdaptor: ToDOMAdaptor): NodeSpec {
    return {
      inline: true,
      content: 'inline*',
      group: 'inline',
      attrs: {
        htmlAttrs: { default: {} },
        inline: { default: true },
      },
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
        const { htmlAttrs } = sanitizeDOM(node, typeName, sanitizeHTML, wwToDOMAdaptor);

        return [typeName, htmlAttrs, 0];
      },
    };
  },
};

export function createHTMLSchemaMap(
  renderer: HTMLConvertorMap,
  sanitizeHTML: Sanitizer,
  wwToDOMAdaptor: ToDOMAdaptor
) {
  const htmlSchemaMap: SchemaMap = {};

  (['htmlBlock', 'htmlInline'] as const).forEach((htmlType) => {
    if (renderer[htmlType]) {
      Object.keys(renderer[htmlType]!).forEach((type) => {
        // register tag white list for preventing to remove the html in sanitizer
        registerTagWhitelistIfPossible(type);
        htmlSchemaMap[type] = schemaFactory[htmlType](type, sanitizeHTML, wwToDOMAdaptor);
      });
    }
  });

  return htmlSchemaMap;
}
