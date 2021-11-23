import {
  CloseTagToken,
  Context,
  HTMLConvertorMap,
  HTMLRenderer,
  HTMLToken,
  OpenTagToken,
  RawHTMLToken,
  RendererOptions,
  TagToken,
  TextToken,
} from '@t/renderer';
import { MdNodeType } from '@t/node';
import { Node, isContainer, isCustomBlock, isCustomInline } from '../commonmark/node';
import { escapeXml } from '../commonmark/common';
import { last } from '../helper';
import { baseConvertors } from './baseConvertors';
import { gfmConvertors } from './gfmConvertors';

const defaultOptions: RendererOptions = {
  softbreak: '\n',
  gfm: false,
  tagFilter: false,
  nodeId: false,
};

function getChildrenText(node: Node) {
  const buffer: string[] = [];
  const walker = node.walker();
  let event: ReturnType<typeof walker.next> = null;

  while ((event = walker.next())) {
    const { node } = event;
    if (node.type === 'text') {
      buffer.push(node.literal!);
    }
  }
  return buffer.join('');
}

export class Renderer implements HTMLRenderer {
  private convertors: HTMLConvertorMap;

  private options: RendererOptions;

  private buffer: string[] = [];

  constructor(customOptions?: Partial<RendererOptions>) {
    this.options = { ...defaultOptions, ...customOptions };
    this.convertors = this.createConvertors();

    delete this.options.convertors;
  }

  private createConvertors() {
    let convertors: HTMLConvertorMap = { ...baseConvertors };

    if (this.options.gfm) {
      convertors = { ...convertors, ...gfmConvertors };
    }

    if (this.options.convertors) {
      const customConvertors = this.options.convertors;
      const nodeTypes = Object.keys(customConvertors) as MdNodeType[];
      const defaultConvertors = { ...baseConvertors, ...gfmConvertors };
      nodeTypes.forEach((nodeType) => {
        const orgConvertor = convertors[nodeType];
        const convertor = customConvertors[nodeType]!;
        const convertorType =
          Object.keys(defaultConvertors).indexOf(nodeType) === -1
            ? nodeType.toLowerCase()
            : nodeType;

        if (orgConvertor) {
          convertors[convertorType] = (node, context, convertors) => {
            context.origin = () => orgConvertor(node, context, convertors);
            return convertor(node, context);
          };
        } else {
          convertors[convertorType] = convertor;
        }
      });
    }
    return convertors;
  }

  getConvertors() {
    return this.convertors;
  }

  getOptions() {
    return this.options;
  }

  render(rootNode: Node): string {
    this.buffer = [];

    const walker = rootNode.walker();
    let event: ReturnType<typeof walker.next> = null;

    while ((event = walker.next())) {
      const { node, entering } = event;
      const convertor = this.convertors[node.type];
      if (!convertor) {
        continue;
      }

      let skipped = false;
      const context: Context = {
        entering,
        leaf: !isContainer(node),
        options: this.options,
        getChildrenText,
        skipChildren: () => {
          skipped = true;
        },
      };

      const converted =
        isCustomBlock(node) || isCustomInline(node)
          ? convertor(node, context, this.convertors)
          : convertor(node, context);
      if (converted) {
        const htmlNodes = Array.isArray(converted) ? converted : [converted];
        htmlNodes.forEach((htmlNode, index) => {
          if (htmlNode.type === 'openTag' && this.options.nodeId && index === 0) {
            if (!htmlNode.attributes) {
              htmlNode.attributes = {};
            }
            htmlNode.attributes['data-nodeid'] = String(node.id);
          }
          this.renderHTMLNode(htmlNode);
        });

        if (skipped) {
          walker.resumeAt(node, false);
          walker.next();
        }
      }
    }
    this.addNewLine();

    return this.buffer.join('');
  }

  renderHTMLNode(node: HTMLToken) {
    switch (node.type) {
      case 'openTag':
      case 'closeTag':
        this.renderElementNode(node);
        break;
      case 'text':
        this.renderTextNode(node);
        break;
      case 'html':
        this.renderRawHtmlNode(node);
        break;
      default:
      // no-default-case
    }
  }

  private generateOpenTagString(node: OpenTagToken) {
    const { tagName, classNames, attributes } = node;

    this.buffer.push(`<${tagName}`);

    if (classNames && classNames.length > 0) {
      this.buffer.push(` class="${classNames.join(' ')}"`);
    }

    if (attributes) {
      Object.keys(attributes).forEach((attrName) => {
        const attrValue = attributes[attrName];
        this.buffer.push(` ${attrName}="${attrValue}"`);
      });
    }

    if (node.selfClose) {
      this.buffer.push(' /');
    }
    this.buffer.push('>');
  }

  private generateCloseTagString({ tagName }: CloseTagToken) {
    this.buffer.push(`</${tagName}>`);
  }

  private addNewLine() {
    if (this.buffer.length && last(last(this.buffer)) !== '\n') {
      this.buffer.push('\n');
    }
  }

  private addOuterNewLine(node: TagToken | RawHTMLToken) {
    if (node.outerNewLine) {
      this.addNewLine();
    }
  }

  private addInnerNewLine(node: TagToken) {
    if (node.innerNewLine) {
      this.addNewLine();
    }
  }

  private renderTextNode(node: TextToken) {
    this.buffer.push(escapeXml(node.content));
  }

  private renderRawHtmlNode(node: RawHTMLToken) {
    this.addOuterNewLine(node);
    this.buffer.push(node.content);
    this.addOuterNewLine(node);
  }

  private renderElementNode(node: OpenTagToken | CloseTagToken) {
    if (node.type === 'openTag') {
      this.addOuterNewLine(node);
      this.generateOpenTagString(node);
      if (node.selfClose) {
        this.addOuterNewLine(node);
      } else {
        this.addInnerNewLine(node);
      }
    } else {
      this.addInnerNewLine(node);
      this.generateCloseTagString(node);
      this.addOuterNewLine(node);
    }
  }
}
