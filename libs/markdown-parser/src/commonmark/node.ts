import NodeWalker from './nodeWalker';

export type BlockNodeType =
  | 'document'
  | 'list'
  | 'blockQuote'
  | 'item'
  | 'heading'
  | 'thematicBreak'
  | 'paragraph'
  | 'codeBlock'
  | 'htmlBlock'
  | 'table'
  | 'tableHead'
  | 'tableBody'
  | 'tableRow'
  | 'tableCell'
  | 'tableDelimRow'
  | 'tableDelimCell';

export type InlineNodeType =
  | 'code'
  | 'text'
  | 'emph'
  | 'strong'
  | 'strike'
  | 'link'
  | 'image'
  | 'htmlInline'
  | 'linebreak'
  | 'softbreak';

export type NodeType = BlockNodeType | InlineNodeType;

export type SourcePos = [[number, number], [number, number]];

export function isContainer(node: Node) {
  switch (node.type) {
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

export class Node {
  public type: NodeType;
  public parent: Node | null = null;
  public prev: Node | null = null;
  public next: Node | null = null;
  public sourcepos?: SourcePos;

  // only for container node
  public firstChild: Node | null = null;
  public lastChild: Node | null = null;

  // only for leaf node
  public literal: string | null = null;

  constructor(nodeType: NodeType, sourcepos?: SourcePos) {
    this.type = nodeType;
    this.sourcepos = sourcepos;
  }

  isContainer() {
    return isContainer(this);
  }

  unlink() {
    if (this.prev) {
      this.prev.next = this.next;
    } else if (this.parent) {
      this.parent.firstChild = this.next;
    }
    if (this.next) {
      this.next.prev = this.prev;
    } else if (this.parent) {
      this.parent.lastChild = this.prev;
    }
    this.parent = null;
    this.next = null;
    this.prev = null;
  }

  replaceWith(node: Node) {
    this.insertBefore(node);
    this.unlink();
  }

  insertAfter(sibling: Node) {
    sibling.unlink();
    sibling.next = this.next;
    if (sibling.next) {
      sibling.next.prev = sibling;
    }
    sibling.prev = this;
    this.next = sibling;
    if (this.parent) {
      sibling.parent = this.parent;
      if (!sibling.next) {
        sibling.parent.lastChild = sibling;
      }
    }
  }

  insertBefore(sibling: Node) {
    sibling.unlink();
    sibling.prev = this.prev;
    if (sibling.prev) {
      sibling.prev.next = sibling;
    }
    sibling.next = this;
    this.prev = sibling;
    sibling.parent = this.parent;
    if (!sibling.prev) {
      sibling.parent!.firstChild = sibling;
    }
  }

  appendChild(child: Node) {
    child.unlink();
    child.parent = this;
    if (this.lastChild) {
      this.lastChild.next = child;
      child.prev = this.lastChild;
      this.lastChild = child;
    } else {
      this.firstChild = child;
      this.lastChild = child;
    }
  }

  prependChild(child: Node) {
    child.unlink();
    child.parent = this;
    if (this.firstChild) {
      this.firstChild.prev = child;
      child.next = this.firstChild;
      this.firstChild = child;
    } else {
      this.firstChild = child;
      this.lastChild = child;
    }
  }

  walker() {
    return new NodeWalker(this);
  }
}

export class BlockNode extends Node {
  public type: BlockNodeType;

  // temporal data (for parsing)
  public open = true;
  public lineOffsets: number[] | null = null;
  public stringContent: string | null = null;
  public lastLineBlank = false;
  public lastLineChecked = false;

  constructor(nodeType: BlockNodeType, sourcepos?: SourcePos) {
    super(nodeType, sourcepos);
    this.type = nodeType;
  }
}

export type ListNodeData = {
  type: 'ordered' | 'bullet';
  tight: boolean;
  start: number;
  bulletChar: string;
  delimiter: string;
  markerOffset: number;
  padding: number;
  task: boolean;
  checked: boolean;
};

export class ListNode extends BlockNode {
  public listData: ListNodeData | null = null;
}

export class HeadingNode extends BlockNode {
  public level = 0;
}

export class LinkNode extends Node {
  public destination: string | null = null;
  public title: string | null = null;
}

export class CodeBlockNode extends BlockNode {
  public isFenced = false;
  public fenceChar: string | null = null;
  public fenceLength = 0;
  public fenceOffset = -1;
  public info: string | null = null;
}

export class HtmlBlockNode extends BlockNode {
  public htmlBlockType = -1;
}

export class CodeNode extends Node {
  public tickCount = 0;
}

export interface TableColumn {
  align: 'left' | 'center' | 'right';
}

export class TableNode extends BlockNode {
  public columns: TableColumn[] = [];
}

export class TableCellNode extends BlockNode {
  public columnIdx = 0;
  public ignored = false;
}

export function createNode(type: 'heading', sourcepos?: SourcePos): HeadingNode;
export function createNode(type: 'list' | 'item', sourcepos?: SourcePos): ListNode;
export function createNode(type: 'codeBlock', sourcepos?: SourcePos): CodeBlockNode;
export function createNode(type: 'htmlBlock', sourcepos?: SourcePos): HtmlBlockNode;
export function createNode(type: 'link' | 'image', sourcepos?: SourcePos): LinkNode;
export function createNode(type: 'code', sourcepos?: SourcePos): CodeNode;
export function createNode(type: 'table', sourcepos?: SourcePos): TableNode;
export function createNode(type: 'tableCell', sourcepos?: SourcePos): TableNode;
export function createNode(type: BlockNodeType, sourcepos?: SourcePos): BlockNode;
export function createNode(type: NodeType, sourcepos?: SourcePos): Node;
export function createNode(type: NodeType, sourcepos?: SourcePos) {
  switch (type) {
    case 'heading':
      return new HeadingNode(type, sourcepos);
    case 'list':
    case 'item':
      return new ListNode(type, sourcepos);
    case 'link':
    case 'image':
      return new LinkNode(type, sourcepos);
    case 'codeBlock':
      return new CodeBlockNode(type, sourcepos);
    case 'htmlBlock':
      return new HtmlBlockNode(type, sourcepos);
    case 'table':
      return new TableNode(type, sourcepos);
    case 'tableCell':
      return new TableCellNode(type, sourcepos);
    case 'document':
    case 'paragraph':
    case 'blockQuote':
    case 'thematicBreak':
    case 'tableRow':
    case 'tableBody':
    case 'tableHead':
      return new BlockNode(type, sourcepos);
    case 'code':
      return new CodeNode(type, sourcepos);
    default:
      return new Node(type, sourcepos) as Node;
  }
}

export function isCodeBlock(node: Node): node is CodeBlockNode {
  return node.type === 'codeBlock';
}

export function isHtmlBlock(node: Node): node is HtmlBlockNode {
  return node.type === 'htmlBlock';
}

export function isHeading(node: Node): node is HeadingNode {
  return node.type === 'heading';
}

export function isList(node: Node): node is ListNode {
  return node.type === 'list';
}

export function text(s: string, sourcepos?: SourcePos) {
  const node = createNode('text', sourcepos);
  node.literal = s;
  return node;
}
