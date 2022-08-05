import {
  Context,
  HTMLConvertorMap,
  HTMLToken,
  MdNode,
  MdNodeType,
  OpenTagToken,
  RawHTMLToken,
  Renderer,
  TextToken,
} from '@toast-ui/toastmark';
import { ProsemirrorNode, Mark } from 'prosemirror-model';
import isArray from 'tui-code-snippet/type/isArray';
import { getHTMLRenderConvertors } from '@/markdown/htmlRenderConvertors';
import { ToDOMAdaptor } from '@t/convertor';
import { includes, last } from '@/utils/common';
import { CustomHTMLRenderer, LinkAttributes } from '@t/editor';
import { setAttributes } from '@/utils/dom';
import { createMdLikeNode, isContainer, isPmNode } from './mdLikeNode';

interface TokenToDOM<T> {
  openTag: (token: HTMLToken, stack: T[]) => void;
  closeTag: (token: HTMLToken, stack: T[]) => void;
  html: (token: HTMLToken, stack: T[]) => void;
  text: (token: HTMLToken, stack: T[]) => void;
}

const tokenToDOMNode: TokenToDOM<HTMLElement> = {
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
    setAttributes(attrs, el);

    stack.push(el);
  },
  closeTag(_, stack) {
    if (stack.length > 1) {
      const el = stack.pop();

      last(stack).appendChild(el!);
    }
  },
  html(token, stack) {
    last(stack).insertAdjacentHTML('beforeend', (token as RawHTMLToken).content);
  },
  text(token, stack) {
    const textNode = document.createTextNode((token as TextToken).content);

    last(stack).appendChild(textNode);
  },
};

export class WwToDOMAdaptor implements ToDOMAdaptor {
  private customConvertorKeys: string[];

  renderer: Renderer;

  convertors: HTMLConvertorMap;

  constructor(linkAttributes: LinkAttributes | null, customRenderer: CustomHTMLRenderer) {
    const convertors = getHTMLRenderConvertors(linkAttributes, customRenderer);
    const customHTMLConvertor = { ...customRenderer.htmlBlock, ...customRenderer.htmlInline };

    // flatten the html block, inline convertor to other custom convertors
    this.customConvertorKeys = Object.keys(customRenderer).concat(Object.keys(customHTMLConvertor));
    this.renderer = new Renderer({
      gfm: true,
      convertors: { ...convertors, ...customHTMLConvertor },
    });
    this.convertors = this.renderer.getConvertors();
  }

  private generateTokens(node: ProsemirrorNode | Mark) {
    const mdLikeNode = createMdLikeNode(node);
    const context: Context = {
      entering: true,
      leaf: isPmNode(node) ? node.isLeaf : false,
      options: this.renderer.getOptions(),
      getChildrenText: () => (isPmNode(node) ? node.textContent : ''),
      skipChildren: () => false,
    };

    const convertor = this.convertors[node.type.name as MdNodeType]!;
    const converted = convertor(mdLikeNode as MdNode, context, this.convertors)!;
    let tokens: HTMLToken[] = isArray(converted) ? converted : [converted];

    if (isContainer(node.type.name) || node.attrs.htmlInline) {
      context.entering = false;

      tokens.push({ type: 'text', content: isPmNode(node) ? node.textContent : '' });
      tokens = tokens.concat(convertor(mdLikeNode as MdNode, context, this.convertors)!);
    }

    return tokens;
  }

  private toDOMNode(node: ProsemirrorNode | Mark) {
    const tokens = this.generateTokens(node);
    const stack: HTMLElement[] = [];

    tokens.forEach((token) => tokenToDOMNode[token.type](token, stack));

    return stack[0];
  }

  getToDOMNode(name: string) {
    if (includes(this.customConvertorKeys, name)) {
      return this.toDOMNode.bind(this);
    }
    return null;
  }
}
