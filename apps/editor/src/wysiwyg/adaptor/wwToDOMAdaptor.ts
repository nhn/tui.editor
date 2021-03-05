// @ts-ignore
import { Renderer } from '@toast-ui/toastmark';
import { DOMOutputSpecArray, Node as ProsemirrorNode, Mark } from 'prosemirror-model';
import isArray from 'tui-code-snippet/type/isArray';
import { getHTMLRenderConvertors } from '@/markdown/htmlRenderConvertors';
import {
  Context,
  CustomHTMLRendererMap,
  HTMLToken,
  MdNode,
  MdNodeType,
  TextToken,
} from '@t/markdown';
import { ToDOMAdaptor } from '@t/convertor';
import { includes } from '@/utils/common';
import { LinkAttributes } from '@t/editor';
import { createMdLikeNode, isContainer, isPmNode } from './mdLikeNode';
import { SpecArray, tokenToDOMNode, tokenToPmDOM } from './tokenToDOM';

export class WwToDOMAdaptor implements ToDOMAdaptor {
  private customConvertorKeys: string[];

  public renderer: Renderer;

  public convertors: CustomHTMLRendererMap;

  constructor(linkAttributes: LinkAttributes | null, customRenderer: CustomHTMLRendererMap) {
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
    const tokens: HTMLToken[] = isArray(converted) ? converted : [converted];

    if (isContainer(node.type.name) || node.attrs.inline) {
      context.entering = false;

      tokens.push({ type: 'text', content: isPmNode(node) ? node.textContent : '' } as TextToken);
      tokens.push(convertor(mdLikeNode as MdNode, context, this.convertors) as HTMLToken);
    }

    return tokens;
  }

  private toDOM(node: ProsemirrorNode | Mark) {
    const tokens = this.generateTokens(node);
    const stack: SpecArray[] = [];

    tokens.forEach((token) => {
      tokenToPmDOM[token.type](token, stack);
    });

    return stack[0] as DOMOutputSpecArray;
  }

  private toDOMNode(node: ProsemirrorNode | Mark) {
    const tokens = this.generateTokens(node);
    const stack: HTMLElement[] = [];

    tokens.forEach((token) => tokenToDOMNode[token.type](token, stack));

    return stack[0];
  }

  getToDOM(name: string) {
    if (includes(this.customConvertorKeys, name)) {
      return this.toDOM.bind(this);
    }
    return null;
  }

  getToDOMNode(name: string) {
    if (includes(this.customConvertorKeys, name)) {
      return this.toDOMNode.bind(this);
    }
    return null;
  }
}
