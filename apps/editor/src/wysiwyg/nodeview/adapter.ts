// @ts-ignore
import { Renderer } from '@toast-ui/toastmark';
import { getHTMLRenderConvertors } from '@/markdown/htmlRenderConvertors';
import {
  Context,
  CustomHTMLRendererMap,
  HTMLToken,
  MdLikeNode,
  MdNode,
  MdNodeType
} from '@t/markdown';
import { DOMOutputSpec, DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';

type SpecArray = DOMOutputSpecArray & {
  push: typeof Array.prototype.push;
};

function createMdLikeNode(node: ProsemirrorNode) {
  const { attrs, type } = node;
  const nodeType = type.name;
  const mdLikeNode: MdLikeNode = {
    // @ts-ignore
    type,
    isWysiwyg: true,
    get firstChild() {
      return node.firstChild ? createMdLikeNode(node.firstChild) : null;
    },
    get lastChild() {
      return node.lastChild ? createMdLikeNode(node.lastChild) : null;
    },
    literal: isContainer(nodeType) ? node.textContent : null
  };

  switch (nodeType) {
    case 'heading':
      mdLikeNode.level = attrs.level;
      break;
    case 'link':
      mdLikeNode.destination = attrs.linkUrl;
      mdLikeNode.title = attrs.linkText;
      break;
    case 'image':
      mdLikeNode.destination = attrs.linkUrl;
      break;
    case 'codeBlock':
      mdLikeNode.info = attrs.language;
      break;
    case 'bulletList':
      mdLikeNode.type = 'list';
      mdLikeNode.listData = {
        type: 'bullet'
      };
      break;
    case 'orderedList':
      mdLikeNode.type = 'list';
      mdLikeNode.listData = {
        type: 'ordered',
        start: attrs.order
      };
      break;
    case 'listItem':
      mdLikeNode.type = 'item';
      mdLikeNode.listData = {
        task: attrs.task,
        checked: attrs.checked
      };
      break;
    // @TODO: table
    // case 'table':
    // case 'tableHead':
    // case 'tableBody':
    // case 'tableRow':
    // case 'tableCell':
    // case 'tableDelimRow':
    default:
  }
  return mdLikeNode;
}

function isContainer(type: string) {
  switch (type) {
    case 'document':
    case 'blockQuote':
    case 'list':
    case 'item':
    case 'paragraph':
    case 'heading':
    case 'emph':
    case 'strong':
    case 'strike':
    case 'link':
    case 'image':
    case 'table':
    case 'tableHead':
    case 'tableBody':
    case 'tableRow':
    case 'tableCell':
    case 'tableDelimRow':
      return true;
    default:
      return false;
  }
}

export class Adapter {
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

  generateTokens(node: ProsemirrorNode) {
    const mdLikeNnode = createMdLikeNode(node);
    const context: Context = {
      entering: true,
      leaf: node.isLeaf,
      options: this.renderer.getOptions(),
      getChildrenText: () => node.textContent,
      skipChildren: () => false
    };

    const convertor = this.convertors[node.type.name as MdNodeType]!;
    const converted = convertor(mdLikeNnode as MdNode, context);

    if (converted) {
      let tokens: HTMLToken[] = [];

      if (!Array.isArray(converted)) {
        tokens = [converted];
      }

      if (isContainer(node.type.name)) {
        context.entering = false;

        tokens.push(convertor(mdLikeNnode as MdNode, context) as HTMLToken);
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

    const stack: DOMOutputSpec[] = [];

    tokens.forEach(token => {
      if (token.type === 'openTag') {
        const { tagName, classNames, attributes } = token;
        const specArray: SpecArray = [tagName];
        let attrs: Record<string, any> = {};

        if (classNames) {
          attrs.class = classNames.join(' ');
        }
        if (attributes) {
          attrs = { ...attrs, ...attributes };
        }
        if (Object.keys(attrs).length) {
          specArray.push(attrs);
        }

        stack.push(specArray);
      } else if (token.type === 'closeTag' && stack.length > 1) {
        const specArray = stack.pop();
        const top = stack[stack.length - 1] as SpecArray;

        top.push(specArray);
      } else if (token.type === 'html') {
        const top = stack[stack.length - 1] as SpecArray;
        const container = document.createElement('div');

        container.innerHTML = token.content;

        top.push(container.firstChild);
      } else if (token.type === 'text') {
        const top = stack[stack.length - 1] as SpecArray;

        top.push(0);
      }
    });

    return stack;
  }
}
