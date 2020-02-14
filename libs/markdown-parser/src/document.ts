import { Parser } from './commonmark/blocks';
import { Node, NodeType } from './commonmark/node';

const reLineEnding = /\r\n|\n|\r/;

export type Position = [number, number];
export type Range = [Position, Position];
const enum Compare {
  LT = -1,
  EQ = 0,
  GT = 1
}

function isContainerBlock(type: NodeType) {
  switch (type) {
    case 'document':
    case 'blockQuote':
    case 'list':
    case 'item':
      return true;
    default:
      return false;
  }
}

function compareLine([startPos, endPos]: [Position, Position], line: number) {
  if (endPos[0] < line) {
    return Compare.LT;
  }
  if (startPos[0] > line) {
    return Compare.GT;
  }
  return Compare.EQ;
}

function lastLeafBlock(parent: Node | null) {
  if (!parent) {
    return null;
  }
  let node = parent;
  while (isContainerBlock(node.type) && node.lastChild) {
    node = node.lastChild;
  }
  return node;
}

function findBlockByLine(parent: Node, line: number) {
  let node: Node | null = parent;
  let prevNode = null;
  while (node) {
    const comp = compareLine(node.sourcepos!, line);
    if (comp === Compare.EQ) {
      if (isContainerBlock(node.type)) {
        prevNode = null;
        node = node.firstChild;
      } else {
        return node;
      }
    } else if (comp === Compare.GT) {
      return lastLeafBlock(prevNode);
    } else {
      prevNode = node;
      node = node.next;
    }
  }
  return lastLeafBlock(prevNode);
}

function replaceNodeWithDocument(target: Node, doc: Node) {
  const nodes: Node[] = [];
  const first = doc.firstChild!;
  let next = first.next;
  if (target) {
    target.replaceWith(first);
    nodes.push(first);
  }
  while (next) {
    const temp = next.next;
    first.insertAfter(next);
    nodes.push(next);
    next = temp;
  }

  return nodes;
}

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

    const targetNode = findBlockByLine(this.root, prevLine);
    if (targetNode) {
      const startLine = targetNode.sourcepos![0][0];
      const endLine = targetNode.sourcepos![1][0];
      const newLines = newText.split(reLineEnding);
      const newLineLen = newLines.length;
      const prevLineText = this.lineTexts[prevLine - 1];
      const nextLineText = this.lineTexts[nextLine - 1];
      newLines[0] = prevLineText.slice(0, prevEndCol) + newLines[0];
      newLines[newLineLen - 1] = newLines[newLineLen - 1] + nextLineText.slice(nextStartCol);

      this.lineTexts.splice(prevLine - 1, nextLine - prevLine + 1, ...newLines);

      const editedLines = this.lineTexts.slice(startLine - 1, endLine - startLine + newLineLen + 1);
      const newDoc = this.parser.partialParse(startLine, editedLines);
      const updated = replaceNodeWithDocument(targetNode, newDoc);

      return { updated };
    }
    return null;
  }

  getLineTexts() {
    return this.lineTexts;
  }

  getRootNode() {
    return this.root;
  }
}
