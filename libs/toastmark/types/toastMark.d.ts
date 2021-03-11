import { MdNode, Pos } from './node';
import { ParserOptions } from './parser';

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
