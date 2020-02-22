import { Parser } from './commonmark/blocks';
import { Node, BlockNode } from './commonmark/node';
import {
  removeNextUntil,
  getChildNodes,
  insertNodesBefore,
  prependChildNodes,
  updateNextLineNumbers,
  findChildNodeByLine
} from './nodeHelper';

const reLineEnding = /\r\n|\n|\r/;

export type Position = [number, number];

export type Range = [Position, Position];

interface EditResult {
  nodes: BlockNode[];
}

export class MarkdownDocument {
  public lineTexts: string[];
  private parser: Parser;
  private root: BlockNode;

  constructor(contents = '') {
    this.lineTexts = contents.split(reLineEnding);
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
    if (this.root.lastChild) {
      this.root.lastLineBlank = (this.root.lastChild as BlockNode).lastLineBlank;
    }

    const { lineTexts } = this;
    let i = lineTexts.length - 1;
    while (!lineTexts[i]) {
      i -= 1;
    }

    if (lineTexts.length - 2 > i) {
      i += 1;
    }

    this.root.sourcepos![1] = [i + 1, lineTexts[i].length];
  }

  private replaceRangeNodes(startNode: Node | null, endNode: Node | null, newNodes: Node[]) {
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

  private parseRange(startLine: number, endLine: number) {
    const editedLines = this.lineTexts.slice(startLine - 1, endLine);
    return getChildNodes(this.parser.partialParse(startLine, editedLines));
  }

  public editMarkdown(start: Position, end: Position, newText: string): EditResult {
    const lineDiff = this.updateLineTexts(start, end, newText);
    const startNode = findChildNodeByLine(this.root, start[0]);
    let endNode = findChildNodeByLine(this.root, end[0]);
    let nextNode = endNode ? endNode.next : this.root.firstChild;

    // extend node range to include a following block without preceding blank lines
    if (nextNode && end[0] + 1 === nextNode.sourcepos![0][0]) {
      endNode = nextNode;
      nextNode = nextNode.next;
    }

    const parseStartLine = startNode ? Math.min(startNode.sourcepos![0][0], start[0]) : start[0];
    let parseEndLine = (endNode ? Math.max(endNode.sourcepos![1][0], end[0]) : end[0]) + lineDiff;

    // extend line range to include following blank lines
    while (this.lineTexts[parseEndLine] === '') {
      parseEndLine += 1;
    }

    const newNodes = this.parseRange(parseStartLine, parseEndLine) as BlockNode[];

    this.replaceRangeNodes(startNode, endNode!, newNodes);
    updateNextLineNumbers(nextNode, lineDiff);
    this.updateRootNodeState();

    return { nodes: newNodes };
  }

  public getLineTexts() {
    return this.lineTexts;
  }

  public getRootNode() {
    return this.root;
  }
}
