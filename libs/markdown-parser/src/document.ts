import { Parser } from './commonmark/blocks';
import { Node } from './commonmark/node';
import {
  removeNextUntil,
  findClosestCommonParent,
  findBlockByLine,
  findChildNodeByLine,
  getChildNodes,
  insertNodesBefore,
  prependChildNodes,
  updateNextLineNumbers
} from './nodeHelper';

const reLineEnding = /\r\n|\n|\r/;

export type Position = [number, number];

export type Range = [Position, Position];

interface EditResult {
  nodes: Node[];
  lineRange: [number, number];
}

export class MarkdownDocument {
  public lineTexts: string[];
  private parser: Parser;
  private root: Node;

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

  private updateRootSourcepos() {
    if (this.root.lastChild) {
      this.root.sourcepos![1] = [...this.root.lastChild!.sourcepos![1]] as Position;
    } else {
      this.root.sourcepos![1] = [1, 1];
    }
  }

  private getNodeRange(startLine: number, endLine: number) {
    const startNode = findBlockByLine(this.root, startLine);
    let endNode: Node | null = null;
    if (startNode && (startLine === endLine || endLine <= startNode.sourcepos![1][0])) {
      endNode = startNode;
    } else {
      endNode = findBlockByLine(this.root, endLine);
    }

    return [startNode, endNode];
  }

  private replaceRangeNodes(startNode: Node, endNode: Node, newNodes: Node[]) {
    if (startNode !== endNode) {
      const parent = findClosestCommonParent(startNode, endNode!)!;
      startNode = findChildNodeByLine(parent, startNode.sourcepos![0][0])!;
      endNode = findChildNodeByLine(parent, endNode.sourcepos![1][0])!;
    }
    insertNodesBefore(startNode, newNodes);
    removeNextUntil(startNode, endNode);
    startNode.unlink();
  }

  private parseRange(startLine: number, endLine: number) {
    const editedLines = this.lineTexts.slice(startLine - 1, endLine);
    return getChildNodes(this.parser.partialParse(startLine, editedLines));
  }

  public editMarkdown(start: Position, end: Position, newText: string): EditResult {
    const lineDiff = this.updateLineTexts(start, end, newText);
    const [startNode, endNode] = this.getNodeRange(start[0], end[0]);
    const parseStartLine = startNode ? startNode.sourcepos![0][0] : start[0];
    const parseEndLine = endNode ? Math.max(endNode.sourcepos![1][0], end[0]) : end[0];
    const newNodes = this.parseRange(parseStartLine, parseEndLine + lineDiff);
    const nextNode = endNode ? endNode.next : this.root.firstChild;

    if (!startNode) {
      if (endNode) {
        insertNodesBefore(endNode, newNodes);
        endNode.unlink();
      } else {
        prependChildNodes(this.root, newNodes);
      }
    } else {
      this.replaceRangeNodes(startNode, endNode!, newNodes);
    }

    updateNextLineNumbers(nextNode, lineDiff);
    this.updateRootSourcepos();

    return {
      nodes: newNodes,
      lineRange: [parseStartLine, parseEndLine]
    };
  }

  public getLineTexts() {
    return this.lineTexts;
  }

  public getRootNode() {
    return this.root;
  }
}
