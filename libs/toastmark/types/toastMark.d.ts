import { MdNode, MdNodeType, Pos } from './node';

export type CustomParser = (node: MdNode, context: { entering: boolean }) => void;
export type CustomParserMap = Partial<Record<MdNodeType, CustomParser>>;

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

export interface ToastMark {
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
