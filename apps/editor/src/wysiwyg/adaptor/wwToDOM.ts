// @ts-ignore
import { Renderer } from '@toast-ui/toastmark';
import { ProsemirrorNode } from 'prosemirror-model';
import { getHTMLRenderConvertors } from '@/markdown/htmlRenderConvertors';
import { Context, CustomHTMLRendererMap, HTMLToken, MdNode, MdNodeType } from '@t/markdown';
import { ToDOM } from '@t/convertor';
import { createMdLikeNode, isContainer } from './mdLikeNode';
import { SpecArray, tokenToDOMNode, tokenToPmDOM } from './tokenToDOM';

export class WwToDOM implements ToDOM {
  public renderer: Renderer;

  public convertors: CustomHTMLRendererMap;

  constructor(linkAttribute: Record<string, any>, customRenderer: CustomHTMLRendererMap) {
    const convertors = getHTMLRenderConvertors(linkAttribute, customRenderer);

    this.renderer = new Renderer({
      gfm: true,
      convertors
    });
    this.convertors = this.renderer.getConvertors();
  }

  private generateTokens(node: ProsemirrorNode) {
    const mdLikeNnode = createMdLikeNode(node);
    const context: Context = {
      entering: true,
      leaf: node.isLeaf,
      options: this.renderer.getOptions(),
      getChildrenText: () => node.textContent,
      skipChildren: () => false
    };

    const convertor = this.convertors[node.type.name as MdNodeType]!;
    const converted = convertor(mdLikeNnode as MdNode, context, this.convertors);

    if (converted) {
      const tokens: HTMLToken[] = Array.isArray(converted) ? converted : [converted];

      if (isContainer(node.type.name)) {
        context.entering = false;

        tokens.push(convertor(mdLikeNnode as MdNode, context, this.convertors) as HTMLToken);
      }

      return tokens;
    }

    return null;
  }

  toDOM(node: ProsemirrorNode) {
    const tokens = this.generateTokens(node);

    if (!tokens) {
      return null;
    }

    const stack: SpecArray[] = [];

    tokens.forEach(token => tokenToPmDOM[token.type](token, stack));

    return stack;
  }

  toDOMNode(node: ProsemirrorNode) {
    const tokens = this.generateTokens(node);

    if (!tokens) {
      return null;
    }

    const stack: HTMLElement[] = [];

    tokens.forEach(token => {
      tokenToDOMNode[token.type](token, stack);
    });

    return stack[0];
  }
}
