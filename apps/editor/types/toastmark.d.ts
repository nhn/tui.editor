// @TODO replace these definition for Definitely Type
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
export type MdPos = Pos;
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

export type AutolinkParser = (
  content: string
) => {
  url: string;
  text: string;
  range: [number, number];
}[];

export type CustomParser = (
  node: MdNode,
  context: { entering: boolean; options: ParserOptions }
) => void;
export type CustomParserMap = Partial<Record<MdNodeType, CustomParser>>;

type RefDefState = {
  id: number;
  destination: string;
  title: string;
  unlinked: boolean;
  sourcepos: Sourcepos;
};

export type RefMap = {
  [k: string]: RefDefState;
};

export type RefLinkCandidateMap = {
  [k: number]: {
    node: BlockMdNode;
    refLabel: string;
  };
};

export type RefDefCandidateMap = {
  [k: number]: RefDefMdNode;
};

export interface ParserOptions {
  smart: boolean;
  tagFilter: boolean;
  extendedAutolinks: boolean | AutolinkParser;
  disallowedHtmlBlockTags: string[];
  referenceDefinition: boolean;
  disallowDeepHeading: boolean;
  frontMatter: boolean;
  customParser: CustomParserMap | null;
}

export class Parser {
  constructor(options?: Partial<ParserOptions>);

  advanceOffset(count: number, columns?: boolean): void;

  advanceNextNonspace(): void;

  findNextNonspace(): void;

  addLine(): void;

  addChild(tag: BlockNodeType, offset: number): BlockMdNode;

  closeUnmatchedBlocks(): void;

  finalize(block: BlockMdNode, lineNumber: number): void;

  processInlines(block: BlockMdNode): void;

  incorporateLine(ln: string): void;

  // The main parsing function.  Returns a parsed document AST.
  parse(input: string, lineTexts?: string[]): MdNode;

  partialParseStart(lineNumber: number, lines: string[]): MdNode;

  partialParseExtends(lines: string[]): void;

  partialParseFinish(): void;

  setRefMaps(
    refMap: RefMap,
    refLinkCandidateMap: RefLinkCandidateMap,
    refDefCandidateMap: RefDefCandidateMap
  ): void;

  clearRefMaps(): void;
}

export type HTMLConvertor = (
  node: MdNode,
  context: Context,
  convertors?: HTMLConvertorMap
) => HTMLToken | HTMLToken[] | null;

export type HTMLConvertorMap = Partial<Record<string, HTMLConvertor>>;

interface RendererOptions {
  gfm: boolean;
  softbreak: string;
  nodeId: boolean;
  tagFilter: boolean;
  convertors?: HTMLConvertorMap;
}

interface Context {
  entering: boolean;
  leaf: boolean;
  options: Omit<RendererOptions, 'convertors'>;
  getChildrenText: (node: MdNode) => string;
  skipChildren: () => void;
  origin?: () => ReturnType<HTMLConvertor>;
}

interface TagToken {
  tagName: string;
  outerNewLine?: boolean;
  innerNewLine?: boolean;
}

export interface OpenTagToken extends TagToken {
  type: 'openTag';
  classNames?: string[];
  attributes?: Record<string, any>;
  selfClose?: boolean;
}

export interface CloseTagToken extends TagToken {
  type: 'closeTag';
}

export interface TextToken {
  type: 'text';
  content: string;
}

export interface RawHTMLToken {
  type: 'html';
  content: string;
  outerNewLine?: boolean;
}

export type HTMLToken = OpenTagToken | CloseTagToken | TextToken | RawHTMLToken;

export class Renderer {
  constructor(customOptions?: Partial<RendererOptions>);

  getConvertors(): HTMLConvertorMap;

  getOptions(): RendererOptions;

  render(rootNode: MdNode): string;

  renderHTMLNode(node: HTMLToken): void;
}

export interface RemovedNodeRange {
  id: [number, number];
  line: [number, number];
}

export interface EditResult {
  nodes: MdNode[];
  removedNodeRange: RemovedNodeRange | null;
}

type EventName = 'change';

type EventHandlerMap = {
  [key in EventName]: Function[];
};

export class ToastMark {
  constructor(contents?: string, options?: Partial<ParserOptions>);

  lineTexts: string[];

  editMarkdown(startPos: Pos, endPos: Pos, newText: string): EditResult[];

  getLineTexts(): string[];

  getRootNode(): MdNode;

  findNodeAtPosition(pos: Pos): MdNode | null;

  findFirstNodeAtLine(line: number): MdNode | null;

  on(eventName: EventName, callback: () => void): void;

  off(eventName: EventName, callback: () => void): void;

  findNodeById(id: number): MdNode | null;

  removeAllNode(): void;
}
