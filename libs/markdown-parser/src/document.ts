import { Parser } from './commonmark/blocks';
import { BlockNode, isList } from './commonmark/node';
import {
  removeNextUntil,
  getChildNodes,
  insertNodesBefore,
  prependChildNodes,
  updateNextLineNumbers,
  findChildNodeByLine
} from './nodeHelper';
import { reBulletListMarker, reOrderedListMarker } from './commonmark/blockStarts';

const reLineEnding = /\r\n|\n|\r/;

export type Position = [number, number];

export type Range = [Position, Position];

type EventName = 'change';

type EventHandlerMap = {
  [key in EventName]: Function[];
};

interface EditResult {
  nodes: BlockNode[];
  removedNodeRange: [number, number] | null;
}

function canBeContinuation(lineText: string) {
  const spaceMatch = lineText.match(/^[ \t]+/);
  if (spaceMatch && (spaceMatch[0].length >= 2 || /\t/.test(spaceMatch[0]))) {
    return true;
  }

  const leftTrimmed = spaceMatch ? lineText.slice(spaceMatch.length) : lineText;
  return reBulletListMarker.test(leftTrimmed) || reOrderedListMarker.test(leftTrimmed);
}

export class MarkdownDocument {
  public lineTexts: string[];
  private parser: Parser;
  private root: BlockNode;
  private eventHandlerMap: EventHandlerMap;

  constructor(contents = '') {
    this.lineTexts = contents.split(reLineEnding);
    this.eventHandlerMap = { change: [] };
    this.parser = new Parser();
    this.root = this.parser.parse(contents);
  }

  private updateLineTexts(start: Position, end: Position, newText: string) {
    const [startLine, startCol] = start;
    const [endLine, endCol] = end;
    const newLines = newText.split(reLineEnding);
    const newLineLen = newLines.length;
    const startLineText = this.lineTexts[startLine - 1];
    const endLineText = this.lineTexts[endLine - 1];
    newLines[0] = startLineText.slice(0, startCol - 1) + newLines[0];
    newLines[newLineLen - 1] = newLines[newLineLen - 1] + endLineText.slice(endCol - 1);

    const removedLineLen = endLine - startLine + 1;
    this.lineTexts.splice(startLine - 1, removedLineLen, ...newLines);

    return newLineLen - removedLineLen;
  }

  private updateRootNodeState() {
    if (this.lineTexts.length === 1 && this.lineTexts[0] === '') {
      this.root.lastLineBlank = true;
      this.root.sourcepos = [[1, 1] as Position, [1, 0] as Position];
      return;
    }

    if (this.root.lastChild) {
      this.root.lastLineBlank = (this.root.lastChild as BlockNode).lastLineBlank;
    }

    const { lineTexts } = this;
    let idx = lineTexts.length - 1;
    while (lineTexts[idx] === '') {
      idx -= 1;
    }
    if (lineTexts.length - 2 > idx) {
      idx += 1;
    }

    this.root.sourcepos![1] = [idx + 1, lineTexts[idx].length];
  }

  private replaceRangeNodes(
    startNode: BlockNode | null,
    endNode: BlockNode | null,
    newNodes: BlockNode[]
  ) {
    if (!startNode) {
      if (endNode) {
        insertNodesBefore(endNode, newNodes);
        endNode.unlink();
      } else {
        prependChildNodes(this.root, newNodes);
      }
    } else {
      insertNodesBefore(startNode, newNodes);
      removeNextUntil(startNode, endNode!);
      startNode.unlink();
    }
  }

  private getNodeRange(start: Position, end: Position) {
    let startNode = findChildNodeByLine(this.root, start[0]);
    let endNode = findChildNodeByLine(this.root, end[0]);

    // extend node range to include a following block which doesn't have preceding blank line
    if (endNode && endNode.next && end[0] + 1 === endNode.next.sourcepos![0][0]) {
      endNode = endNode.next;
    }

    if (!startNode && endNode) {
      startNode = endNode;
    }

    return [startNode, endNode] as [BlockNode, BlockNode];
  }

  private trigger(eventName: EventName, param: any) {
    this.eventHandlerMap[eventName].forEach(handler => {
      handler(param);
    });
  }

  private parseRange(
    startLine: number,
    endLine: number,
    startNode: BlockNode,
    endNode: BlockNode | null
  ) {
    // extends starting range if the first node can be a continuation of the preceding node
    const firstLineText = this.lineTexts[startLine - 1];
    if (startNode && startNode.prev && isList(startNode.prev) && canBeContinuation(firstLineText)) {
      startNode = startNode.prev;
      startLine = startNode.sourcepos![0][0];
    }

    const editedLines = this.lineTexts.slice(startLine - 1, endLine);
    const root = this.parser.partialParseStart(startLine, editedLines);

    // extends ending range if the following node can be a continuation of the last node
    if (root.lastChild && isList(root.lastChild)) {
      let nextNode = endNode ? endNode.next : this.root.firstChild;
      while (nextNode) {
        if (nextNode.type !== 'list' && nextNode.sourcepos![0][1] < 3) {
          break;
        }
        let newEndLine = nextNode.sourcepos![1][0];
        while (this.lineTexts[newEndLine] === '') {
          newEndLine += 1;
        }

        this.parser.partialParseExtends(this.lineTexts.slice(endLine, newEndLine));
        endNode = nextNode as BlockNode;
        nextNode = nextNode.next;
      }
    }

    this.parser.partialParseFinish();

    const newNodes = getChildNodes(root)! as BlockNode[];
    return { newNodes, extStartNode: startNode, extEndNode: endNode };
  }

  public editMarkdown(start: Position, end: Position, newText: string): EditResult {
    const [startNode, endNode] = this.getNodeRange(start, end);
    const lineDiff = this.updateLineTexts(start, end, newText);
    const startLine = startNode ? Math.min(startNode.sourcepos![0][0], start[0]) : start[0];
    let endLine = (endNode ? Math.max(endNode.sourcepos![1][0], end[0]) : end[0]) + lineDiff;

    while (this.lineTexts[endLine] === '') {
      endLine += 1;
    }

    const parseResult = this.parseRange(startLine, endLine, startNode, endNode);
    const { newNodes, extStartNode, extEndNode } = parseResult;
    const nextNode = extEndNode ? extEndNode.next : this.root.firstChild;

    this.replaceRangeNodes(extStartNode, extEndNode, newNodes);
    updateNextLineNumbers(nextNode, lineDiff);
    this.updateRootNodeState();

    const result = {
      nodes: newNodes,
      removedNodeRange: !extStartNode ? null : [extStartNode.id, extEndNode!.id]
    } as EditResult;

    this.trigger('change', result);

    return result;
  }

  public getLineTexts() {
    return this.lineTexts;
  }

  public getRootNode() {
    return this.root;
  }

  public on(eventName: EventName, callback: Function) {
    this.eventHandlerMap[eventName].push(callback);
  }

  public off(eventName: EventName, callback: Function) {
    const handlers = this.eventHandlerMap[eventName];
    const idx = handlers.indexOf(callback);
    handlers.splice(idx, 1);
  }
}
