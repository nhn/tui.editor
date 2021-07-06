import isFunction from 'tui-code-snippet/type/isFunction';
import {
  HTMLConvertorMap,
  MdNode,
  ListItemMdNode,
  CodeMdNode,
  CodeBlockMdNode,
  CustomInlineMdNode,
  OpenTagToken,
  Context,
  HTMLConvertor,
} from '@t/toastmark';
import { LinkAttributes, CustomHTMLRenderer } from '@t/editor';
import { HTMLMdNode } from '@t/markdown';
import { getWidgetContent, widgetToDOM } from '@/widget/rules';
import { getChildrenHTML, getHTMLAttrsByHTMLString } from '@/wysiwyg/nodes/html';
import { includes } from '@/utils/common';
import { reHTMLTag } from '@/utils/constants';

type TokenAttrs = Record<string, any>;

const reCloseTag = /^\s*<\s*\//;

const baseConvertors: HTMLConvertorMap = {
  paragraph(_, { entering, origin, options }: Context) {
    if (options.nodeId) {
      return {
        type: entering ? 'openTag' : 'closeTag',
        outerNewLine: true,
        tagName: 'p',
      };
    }

    return origin!();
  },

  softbreak(node: MdNode) {
    const isPrevNodeHTML = node.prev && node.prev.type === 'htmlInline';
    const isPrevBR = isPrevNodeHTML && /<br ?\/?>/.test(node.prev!.literal!);
    const content = isPrevBR ? '\n' : '<br>\n';

    return { type: 'html', content };
  },

  item(node: MdNode, { entering }: Context) {
    if (entering) {
      const attributes: TokenAttrs = {};
      const classNames = [];

      if ((node as ListItemMdNode).listData.task) {
        attributes['data-task'] = '';
        classNames.push('task-list-item');
        if ((node as ListItemMdNode).listData.checked) {
          classNames.push('checked');
          attributes['data-task-checked'] = '';
        }
      }

      return {
        type: 'openTag',
        tagName: 'li',
        classNames,
        attributes,
        outerNewLine: true,
      };
    }

    return {
      type: 'closeTag',
      tagName: 'li',
      outerNewLine: true,
    };
  },

  code(node: MdNode) {
    const attributes = { 'data-backticks': String((node as CodeMdNode).tickCount) };

    return [
      { type: 'openTag', tagName: 'code', attributes },
      { type: 'text', content: node.literal! },
      { type: 'closeTag', tagName: 'code' },
    ];
  },

  codeBlock(node: MdNode) {
    const { fenceLength, info } = node as CodeBlockMdNode;
    const infoWords = info ? info.split(/\s+/) : [];
    const preClasses = [];
    const codeAttrs: TokenAttrs = {};

    if (fenceLength > 3) {
      codeAttrs['data-backticks'] = fenceLength;
    }
    if (infoWords.length > 0 && infoWords[0].length > 0) {
      const [lang] = infoWords;

      preClasses.push(`lang-${lang}`);
      codeAttrs['data-language'] = lang;
    }

    return [
      { type: 'openTag', tagName: 'pre', classNames: preClasses },
      { type: 'openTag', tagName: 'code', attributes: codeAttrs },
      { type: 'text', content: node.literal! },
      { type: 'closeTag', tagName: 'code' },
      { type: 'closeTag', tagName: 'pre' },
    ];
  },

  customInline(node: MdNode, { origin, entering, skipChildren }: Context) {
    const { info } = node as CustomInlineMdNode;

    if (info.indexOf('widget') !== -1 && entering) {
      skipChildren();
      const content = getWidgetContent(node as CustomInlineMdNode);
      const htmlInline = widgetToDOM(info, content).outerHTML;

      return [
        { type: 'openTag', tagName: 'span', classNames: ['tui-widget'] },
        { type: 'html', content: htmlInline },
        { type: 'closeTag', tagName: 'span' },
      ];
    }
    return origin!();
  },
};

export function getHTMLRenderConvertors(
  linkAttributes: LinkAttributes | null,
  customConvertors: CustomHTMLRenderer
) {
  const convertors = { ...baseConvertors };

  if (linkAttributes) {
    convertors.link = (_, { entering, origin }: Context) => {
      const result = origin!();

      if (entering) {
        (result as OpenTagToken).attributes = {
          ...(result as OpenTagToken).attributes,
          ...linkAttributes,
        } as TokenAttrs;
      }
      return result;
    };
  }

  if (customConvertors) {
    Object.keys(customConvertors).forEach((nodeType: string) => {
      const orgConvertor = convertors[nodeType];
      const customConvertor = customConvertors[nodeType]!;

      if (orgConvertor && isFunction(customConvertor)) {
        convertors[nodeType] = (node, context) => {
          const newContext = { ...context };

          newContext.origin = () => orgConvertor(node, context);
          return customConvertor(node, newContext);
        };
      } else if (includes(['htmlBlock', 'htmlInline'], nodeType) && !isFunction(customConvertor)) {
        convertors[nodeType] = (node, context) => {
          const matched = node.literal!.match(reHTMLTag);

          if (matched) {
            const [rootHTML, openTagName, , closeTagName] = matched;
            const typeName = (openTagName || closeTagName).toLowerCase();
            const htmlConvertor = customConvertor[typeName];
            const childrenHTML = getChildrenHTML(node, typeName);

            if (htmlConvertor) {
              // copy for preventing to overwrite the originial property
              const newNode: HTMLMdNode = { ...node };

              newNode.attrs = getHTMLAttrsByHTMLString(rootHTML);
              newNode.childrenHTML = childrenHTML;
              newNode.type = typeName;
              context.entering = !reCloseTag.test(node.literal!);

              return htmlConvertor(newNode, context);
            }
          }
          return context.origin!();
        };
      } else {
        convertors[nodeType] = customConvertor as HTMLConvertor;
      }
    });
  }

  return convertors;
}
