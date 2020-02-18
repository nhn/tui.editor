import { Parser } from './commonmark/blocks';
import { Node } from './commonmark/node';
import { last } from './helper';
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

  editMarkdown(
    [startLine, startCol]: Position,
    [endLine, endCol]: Position,
    newText: string
  ): EditResult {
    const newLines = newText.split(reLineEnding);
    const newLineLen = newLines.length;
    const startLineText = this.lineTexts[startLine - 1];
    const endLineText = this.lineTexts[endLine - 1];
    newLines[0] = startLineText.slice(0, startCol - 1) + newLines[0];
    newLines[newLineLen - 1] = newLines[newLineLen - 1] + endLineText.slice(endCol - 1);

    const removedLineLen = endLine - startLine + 1;
    this.lineTexts.splice(startLine - 1, removedLineLen, ...newLines);

    let startNode = findBlockByLine(this.root, startLine);
    let endNode: Node | null = null;
    if (startNode) {
      if (startLine === endLine || endLine <= startNode.sourcepos![1][0]) {
        endNode = startNode;
      } else {
        endNode = findBlockByLine(this.root, endLine);
      }
    }

    const parseStartLine = startNode ? startNode.sourcepos![0][0] : startLine;
    const parseEndLine = endNode ? Math.max(endNode.sourcepos![1][0], endLine) : endLine;
    const editedLines = this.lineTexts.slice(
      parseStartLine - 1,
      parseEndLine - removedLineLen + newLineLen
    );
    const newNodes = getChildNodes(this.parser.partialParse(parseStartLine, editedLines));

    if (!startNode) {
      prependChildNodes(this.root, newNodes);
    } else {
      if (startNode !== endNode) {
        const parent = findClosestCommonParent(startNode, endNode!)!;
        startNode = findChildNodeByLine(parent, startLine)!;
        endNode = findChildNodeByLine(parent, endLine)!;
      }
      insertNodesBefore(startNode, newNodes);
      removeNextUntil(startNode, endNode);
      startNode.unlink();
    }

    const nextNode = newNodes.length ? last(newNodes).next : this.root.firstChild;
    updateNextLineNumbers(nextNode, newLineLen - removedLineLen);
    this.root.sourcepos![1] = [this.lineTexts.length, last(this.lineTexts).length];

    return {
      nodes: newNodes,
      lineRange: [parseStartLine, parseEndLine]
    };
  }

  getLineTexts() {
    return this.lineTexts;
  }

  getRootNode() {
    return this.root;
  }
}
