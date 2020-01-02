import NodeWalker from './nodeWalker';

export type BlockNodeType =
  | 'document'
  | 'list'
  | 'blockQuote'
  | 'item'
  | 'heading'
  | 'thematicBreak'
  | 'codeBlock'
  | 'htmlBlock'
  | 'paragraph';

export type NodeType =
  // containers
  | BlockNodeType
  // other blocks
  | 'customInline'
  | 'customBlock'
  | 'code'
  // inlines
  | 'text'
  | 'emph'
  | 'strong'
  | 'link'
  | 'image'
  | 'linebreak'
  | 'htmlInline'
  | 'linebreak'
  | 'softbreak';

type SourcePos = [[number, number], [number, number]];

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
    case 'link':
    case 'image':
    case 'customInline':
    case 'customBlock':
      return true;
    default:
      return false;
  }
}

export class Node {
  public lastLineBlank = false;
  public lastLineChecked = false;
  public open = true;
  public htmlBlockType = -1;
  public isFenced = false;
  public fenceChar: string | null = null;
  public fenceLength = 0;
  public fenceOffset = -1;
  public stringContent: string | null = null;
  public type: NodeType;
  public parent: Node | null = null;
  public firstChild: Node | null = null;
  public lastChild: Node | null = null;
  public prev: Node | null = null;
  public next: Node | null = null;
  public sourcepos?: SourcePos;
  public literal: string | null = null;
  public info: string | null = null;
  public destination: string | null = null;
  public title: string | null = null;
  public level: number | null = null;
  public onEnter = null;
  public onExit = null;

  constructor(nodeType: NodeType, sourcepos?: SourcePos) {
    this.type = nodeType;
    this.sourcepos = sourcepos;
  }

  isContainer() {
    return isContainer(this);
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
    if (this.parent) {
      sibling.parent = this.parent;
      if (!sibling.prev) {
        sibling.parent.firstChild = sibling;
      }
    }
  }

  /* Example of use of walker:
     var walker = w.walker();
     var event;

     while (event = walker.next()) {
     console.log(event.entering, event.node.type);
     }
  */
  walker() {
    return new NodeWalker(this);
  }
}

export interface BlockNode extends Node {
  type: BlockNodeType;
  parent: BlockNode;
  sourcepos: SourcePos;
}

export type ListNodeData = {
  type: 'ordered' | 'bullet';
  tight: boolean;
  start: number;
  bulletChar: string;
  delimiter: string;
  markerOffset: number;
  padding: number;
};

export interface ListNode extends BlockNode {
  listData: ListNodeData;
}
