import { BlockMdNode, BlockNodeType, MdNode, MdNodeType, RefDefMdNode, Sourcepos } from './node';

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

export class BlockParser {
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
