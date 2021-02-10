import {
  CodeBlockMdNode,
  CodeMdNode,
  ListItemMdNode,
  MdNode,
  MdNodeType,
  CustomHTMLRendererMap,
  Context,
  OpenTagToken,
} from '@t/markdown';
import { LinkAttributes } from '@t/editor';

type TokenAttrs = Record<string, any>;

const baseConvertors: CustomHTMLRendererMap = {
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
};

export function getHTMLRenderConvertors(
  linkAttributes: LinkAttributes | null,
  customConvertors: CustomHTMLRendererMap
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
    // @ts-ignore
    Object.keys(customConvertors).forEach((nodeType: MdNodeType) => {
      const orgConvertor = convertors[nodeType];
      const customConvertor = customConvertors[nodeType]!;

      if (orgConvertor) {
        convertors[nodeType] = (node, context) => {
          const newContext = { ...context };

          newContext.origin = () => orgConvertor(node, context);
          return customConvertor(node, newContext);
        };
      } else {
        convertors[nodeType] = customConvertor;
      }
    });
  }

  return convertors;
}
