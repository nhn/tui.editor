import { Parser } from './commonmark/blocks';
import { Node } from './commonmark/node';
import {
  removeNextUntil,
  findClosestCommonParent,
  replaceNodeWithDocument,
  findBlockByLine,
  findChildNodeByLine
} from './nodeHelper';

const reLineEnding = /\r\n|\n|\r/;

export type Position = [number, number];

export type Range = [Position, Position];

interface EditResult {
  updated?: Node[];
}

export class MarkdownDocument {
  private lineTexts: string[];
  private parser: Parser;
  private root: Node;

  constructor(contents = '') {
    this.lineTexts = contents.split(reLineEnding);
    this.parser = new Parser();
    this.root = this.parser.parse(contents);
  }

  editMarkdown(start: Position | null, end: Position | null, newText: string): EditResult | null {
    if (!start && !end) {
      return null;
    }

    let prevLine, prevEndCol, nextLine, nextStartCol;
    let result: EditResult | null = null;

    if (!start || !end) {
      const position = (start || end) as Position;
      prevLine = nextLine = position[0];
      prevEndCol = nextStartCol = position[1] - (start ? 1 : 0);
    } else {
      prevLine = start[0];
      prevEndCol = start[1] - 1;
      nextLine = end[0];
      nextStartCol = end[1];
    }

    let startNode = findBlockByLine(this.root, prevLine)!;
    let endNode: Node;
    if (prevLine === nextLine || nextLine <= startNode.sourcepos![1][0]) {
      endNode = startNode;
    } else {
      endNode = findBlockByLine(this.root, nextLine)!;
    }

    const startLine = startNode.sourcepos![0][0];
    const endLine = endNode.sourcepos![1][0];
    const newLines = newText.split(reLineEnding);
    const newLineLen = newLines.length;
    const prevLineText = this.lineTexts[prevLine - 1];
    const nextLineText = this.lineTexts[nextLine - 1];
    newLines[0] = prevLineText.slice(0, prevEndCol) + newLines[0];
    newLines[newLineLen - 1] = newLines[newLineLen - 1] + nextLineText.slice(nextStartCol);

    this.lineTexts.splice(prevLine - 1, nextLine - prevLine + 1, ...newLines);

    if (startNode !== endNode) {
      const parent = findClosestCommonParent(startNode, endNode)!;
      startNode = findChildNodeByLine(parent, prevLine)!;
      endNode = findChildNodeByLine(parent, nextLine)!;
      removeNextUntil(startNode, endNode);
    }

    const editedLines = this.lineTexts.slice(startLine - 1, endLine - startLine + newLineLen + 1);
    const newDoc = this.parser.partialParse(startLine, editedLines);
    const updated = replaceNodeWithDocument(startNode, newDoc);

    result = { updated };

    this.root.sourcepos![1] = [
      this.lineTexts.length,
      this.lineTexts[this.lineTexts.length - 1].length
    ];

    return result;
  }

  getLineTexts() {
    return this.lineTexts;
  }

  getRootNode() {
    return this.root;
  }
}
