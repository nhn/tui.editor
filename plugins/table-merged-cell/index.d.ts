type Plugin = (editor: any, options?: any) => void;

type SourcePos = [[number, number], [number, number]];

type BlockNodeType =
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
  | 'refDef';

type InlineNodeType =
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

type NodeType = BlockNodeType | InlineNodeType;

interface MdNode {
  type: NodeType;
  id: number;
  parent: MdNode | null;
  prev: MdNode | null;
  next: MdNode | null;
  sourcepos?: SourcePos;
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
interface NodeWalker {
  current: MdNode | null;
  root: MdNode;
  entering: boolean;

  next(): { entering: boolean; node: MdNode } | null;
  resumeAt(node: MdNode, entering: boolean): void;
}

type CustomParser = (node: MdNode, context: { entering: boolean }) => void;
type CustomParserMap = Partial<Record<NodeType, CustomParser>>;

interface Options {
  gfm: boolean;
  softbreak: string;
  nodeId: boolean;
  tagFilter: boolean;
  convertors?: HTMLConvertorMap;
}

interface Context {
  entering: boolean;
  leaf: boolean;
  options: Omit<Options, 'gfm' | 'convertors'>;
  getChildrenText: (node: MdNode) => string;
  skipChildren: () => void;
  origin?: () => ReturnType<HTMLConvertor>;
}

interface TagToken {
  tagName: string;
  outerNewLine?: boolean;
  innerNewLine?: boolean;
}

interface OpenTagToken extends TagToken {
  type: 'openTag';
  classNames?: string[];
  attributes?: Record<string, string>;
  selfClose?: boolean;
}

interface CloseTagToken extends TagToken {
  type: 'closeTag';
}

interface TextToken {
  type: 'text';
  content: string;
}

interface RawHTMLToken {
  type: 'html';
  content: string;
  outerNewLine?: boolean;
}

type HTMLToken = OpenTagToken | CloseTagToken | TextToken | RawHTMLToken;

type HTMLConvertor = (node: MdNode, context: Context) => HTMLToken | HTMLToken[] | null;
type HTMLConvertorMap = Partial<Record<NodeType, HTMLConvertor>>;

interface PluginInfo {
  pluginFn: Plugin;
  renderer: HTMLConvertorMap;
  parser: CustomParserMap;
}

declare const tableMergedCell: PluginInfo;
declare module '@toast-ui/editor-plugin-table-merged-cell' {
  export default tableMergedCell;
}
