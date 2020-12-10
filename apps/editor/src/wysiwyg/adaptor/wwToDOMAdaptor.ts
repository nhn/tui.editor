// @ts-ignore
import { Renderer } from '@toast-ui/toastmark';
import { DOMOutputSpecArray, Node as ProsemirrorNode, Mark } from 'prosemirror-model';
import { getHTMLRenderConvertors } from '@/markdown/htmlRenderConvertors';
import { Context, CustomHTMLRendererMap, HTMLToken, MdNode, MdNodeType } from '@t/markdown';
import { ToDOMAdaptor } from '@t/convertor';
import { includes } from '@/utils/common';
import { createMdLikeNode, isContainer, isNode } from './mdLikeNode';
import { SpecArray, tokenToDOMNode, tokenToPmDOM } from './tokenToDOM';

export class WwToDOMAdaptor implements ToDOMAdaptor {
  private customConvertorKeys: string[];

  public renderer: Renderer;

  public convertors: CustomHTMLRendererMap;

  constructor(linkAttribute: Record<string, any>, customRenderer: CustomHTMLRendererMap) {
    const convertors = getHTMLRenderConvertors(linkAttribute, customRenderer);

    this.customConvertorKeys = Object.keys(customRenderer);
    this.renderer = new Renderer({
      gfm: true,
      convertors
    });
    this.convertors = this.renderer.getConvertors();
  }

  private generateTokens(node: ProsemirrorNode | Mark) {
    const mdLikeNnode = createMdLikeNode(node);
    const context: Context = {
      entering: true,
      leaf: isNode(node) ? node.isLeaf : false,
      options: this.renderer.getOptions(),
      getChildrenText: () => (isNode(node) ? node.textContent : ''),
      skipChildren: () => false
    };

    const convertor = this.convertors[node.type.name as MdNodeType]!;
    const converted = convertor(mdLikeNnode as MdNode, context, this.convertors)!;
    const tokens: HTMLToken[] = Array.isArray(converted) ? converted : [converted];

    if (isContainer(node.type.name)) {
      context.entering = false;

      tokens.push({ type: 'text' } as HTMLToken);
      tokens.push(convertor(mdLikeNnode as MdNode, context, this.convertors) as HTMLToken);
    }

    return tokens;
  }

  private toDOM(node: ProsemirrorNode | Mark) {
    const tokens = this.generateTokens(node);
    const stack: SpecArray[] = [];

    tokens.forEach(token => tokenToPmDOM[token.type](token, stack));

    return stack[0] as DOMOutputSpecArray;
  }

  private toDOMNode(node: ProsemirrorNode | Mark) {
    const tokens = this.generateTokens(node);
    const stack: HTMLElement[] = [];

    tokens.forEach(token => {
      tokenToDOMNode[token.type](token, stack);
    });

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
