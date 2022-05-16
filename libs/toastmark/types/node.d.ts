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
  | 'tableDelimCell'
  | 'refDef'
  | 'customBlock'
  | 'frontMatter';

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
  | 'softbreak'
  | 'customInline';

export type MdNodeType = BlockNodeType | InlineNodeType;

export type Pos = [number, number];
export type Sourcepos = [Pos, Pos];

export interface NodeWalker {
  current: MdNode | null;
  root: MdNode;
  entering: boolean;

  next(): { entering: boolean; node: MdNode } | null;
  resumeAt(node: MdNode, entering: boolean): void;
}

export interface MdNode {
  type: MdNodeType;
  id: number;
  parent: MdNode | null;
  prev: MdNode | null;
  next: MdNode | null;
  sourcepos?: Sourcepos;
  firstChild: MdNode | null;
  lastChild: MdNode | null;
  literal: string | null;

  isContainer(): boolean;
  unlink(): void;
  replaceWith(node: MdNode): void;
  insertAfter(node: MdNode): void;
  insertBefore(node: MdNode): void;
  appendChild(child: MdNode): void;
  prependChild(child: MdNode): void;
  walker(): NodeWalker;
}

export interface BlockMdNode extends MdNode {
  type: BlockNodeType;

  // temporal data (for parsing)
  open: boolean;
  lineOffsets: number[] | null;
  stringContent: string | null;
  lastLineBlank: boolean;
  lastLineChecked: boolean;
}

export interface ListData {
  type: 'ordered' | 'bullet';
  tight: boolean;
  start: number;
  bulletChar: string;
  delimiter: string;
  markerOffset: number;
  padding: number;
  task: boolean;
  checked: boolean;
}

export interface ListMdNode extends BlockMdNode {
  listData: ListData | null;
}

export interface ListItemMdNode extends BlockMdNode {
  parent: MdNode;
  listData: ListData;
}

export interface HeadingMdNode extends BlockMdNode {
  level: number;
  headingType: 'atx' | 'setext';
}

export interface CodeBlockMdNode extends BlockMdNode {
  fenceOffset: number;
  fenceLength: number;
  fenceChar: string | null;
  info: string | null;
  infoPadding: number;
}

export interface TableColumn {
  align: 'left' | 'center' | 'right' | null;
}

export interface TableMdNode extends BlockMdNode {
  columns: TableColumn[];
}

export interface TableCellMdNode extends BlockMdNode {
  startIdx: number;
  endIdx: number;
  paddingLeft: number;
  paddingRight: number;
  ignored: boolean;
  attrs?: Record<string, any>;
}

export interface CustomBlockMdNode extends BlockMdNode {
  disabledEntityParse?: boolean;
}

export interface RefDefMdNode extends BlockMdNode {
  title: string;
  dest: string;
  label: string;
}

export interface CustomBlockMdNode extends BlockMdNode {
  syntaxLength: number;
  offset: number;
  info: string;
}

export interface HtmlBlockMdNode extends BlockMdNode {
  htmlBlockType: number;
}

export interface LinkMdNode extends MdNode {
  destination: string | null;
  title: string | null;
  extendedAutolink: boolean;
  lastChild: MdNode;
}

export interface CodeMdNode extends MdNode {
  tickCount: number;
}

export interface CustomInlineMdNode extends MdNode {
  info: string;
}
