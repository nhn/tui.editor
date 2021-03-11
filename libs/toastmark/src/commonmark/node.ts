import {
  BlockMdNode,
  BlockNodeType,
  CodeBlockMdNode,
  CodeMdNode,
  CustomBlockMdNode,
  CustomInlineMdNode,
  HeadingMdNode,
  HtmlBlockMdNode,
  LinkMdNode,
  ListData,
  ListMdNode,
  MdNode,
  MdNodeType,
  RefDefMdNode,
  Sourcepos,
  TableCellMdNode,
  TableColumn,
  TableMdNode,
} from '@t/node';
import NodeWalker from './nodeWalker';

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
    case 'customInline':
      return true;
    default:
      return false;
  }
}

let lastNodeId = 1;
let nodeMap: { [key: number]: Node } = {};

export function getNodeById(id: number) {
  return nodeMap[id];
}

export function removeNodeById(id: number) {
  delete nodeMap[id];
}

export function removeAllNode() {
  nodeMap = {};
}

export class Node implements MdNode {
  type: MdNodeType;
  id: number;
  parent: Node | null = null;
  prev: Node | null = null;
  next: Node | null = null;
  sourcepos?: Sourcepos;

  // only for container node
  firstChild: Node | null = null;
  lastChild: Node | null = null;

  // only for leaf node
  literal: string | null = null;

  constructor(nodeType: MdNodeType, sourcepos?: Sourcepos) {
    if (nodeType === 'document') {
      this.id = -1;
    } else {
      this.id = lastNodeId++;
    }

    this.type = nodeType;
    this.sourcepos = sourcepos;
    nodeMap![this.id] = this;
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

export class BlockNode extends Node implements BlockMdNode {
  type: BlockNodeType;

  // temporal data (for parsing)
  open = true;
  lineOffsets: number[] | null = null;
  stringContent: string | null = null;
  lastLineBlank = false;
  lastLineChecked = false;

  constructor(nodeType: BlockNodeType, sourcepos?: Sourcepos) {
    super(nodeType, sourcepos);
    this.type = nodeType;
  }
}

export class ListNode extends BlockNode implements ListMdNode {
  listData: ListData | null = null;
}

export class HeadingNode extends BlockNode implements HeadingMdNode {
  level = 0;
  headingType: 'atx' | 'setext' = 'atx';
}

export class CodeBlockNode extends BlockNode implements CodeBlockMdNode {
  isFenced = false;
  fenceChar: string | null = null;
  fenceLength = 0;
  fenceOffset = -1;
  info: string | null = null;
  infoPadding = 0;
}

export class TableNode extends BlockNode implements TableMdNode {
  columns: TableColumn[] = [];
}

export class TableCellNode extends BlockNode implements TableCellMdNode {
  startIdx = 0;
  endIdx = 0;
  paddingLeft = 0;
  paddingRight = 0;
  ignored = false;
}

export class RefDefNode extends BlockNode implements RefDefMdNode {
  title = '';
  dest = '';
  label = '';
}

export class CustomBlockNode extends BlockNode implements CustomBlockMdNode {
  syntaxLength = 0;
  offset = -1;
  info = '';
}

export class HtmlBlockNode extends BlockNode implements HtmlBlockMdNode {
  htmlBlockType = -1;
}

export class LinkNode extends Node implements LinkMdNode {
  destination: string | null = null;
  title: string | null = null;
  extendedAutolink = false;
  lastChild!: Node;
}

export class CodeNode extends Node implements CodeMdNode {
  tickCount = 0;
}

export class CustomInlineNode extends Node implements CustomInlineMdNode {
  info = '';
}

export function createNode(type: 'heading', sourcepos?: Sourcepos): HeadingNode;
export function createNode(type: 'list' | 'item', sourcepos?: Sourcepos): ListNode;
export function createNode(type: 'codeBlock', sourcepos?: Sourcepos): CodeBlockNode;
export function createNode(type: 'htmlBlock', sourcepos?: Sourcepos): HtmlBlockNode;
export function createNode(type: 'link' | 'image', sourcepos?: Sourcepos): LinkNode;
export function createNode(type: 'code', sourcepos?: Sourcepos): CodeNode;
export function createNode(type: 'table', sourcepos?: Sourcepos): TableNode;
export function createNode(type: 'tableCell', sourcepos?: Sourcepos): TableNode;
export function createNode(type: 'refDef', sourcepos?: Sourcepos): RefDefNode;
export function createNode(type: 'customBlock', sourcepos?: Sourcepos): CustomBlockNode;
export function createNode(type: BlockNodeType, sourcepos?: Sourcepos): BlockNode;
export function createNode(type: MdNodeType, sourcepos?: Sourcepos): Node;
export function createNode(type: MdNodeType, sourcepos?: Sourcepos) {
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
    case 'frontMatter':
      return new BlockNode(type, sourcepos);
    case 'code':
      return new CodeNode(type, sourcepos);
    case 'refDef':
      return new RefDefNode(type, sourcepos);
    case 'customBlock':
      return new CustomBlockNode(type, sourcepos);
    case 'customInline':
      return new CustomInlineNode(type, sourcepos);
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

export function isTable(node: Node): node is TableNode {
  return node.type === 'table';
}

export function isRefDef(node: Node): node is RefDefNode {
  return node.type === 'refDef';
}

export function isCustomBlock(node: Node): node is CustomBlockNode {
  return node.type === 'customBlock';
}

export function isCustomInline(node: Node) {
  return node.type === 'customInline';
}

export function text(s: string, sourcepos?: Sourcepos) {
  const node = createNode('text', sourcepos);
  node.literal = s;
  return node;
}
