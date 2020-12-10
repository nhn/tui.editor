import { BlockStart, Matched } from '../blockStarts';
import { CustomBlockNode } from '../node';

const reCustomBlock = /^({{)([a-z])+/;

export const customBlock: BlockStart = parser => {
  let match;
  if (
    !parser.indented &&
    (match = parser.currentLine.slice(parser.nextNonspace).match(reCustomBlock))
  ) {
    const syntaxLength = match[1].length;
    parser.closeUnmatchedBlocks();
    const container = parser.addChild('customBlock', parser.nextNonspace) as CustomBlockNode;
    container.syntaxLength = syntaxLength;
    container.offset = parser.indent;
    parser.advanceNextNonspace();
    parser.advanceOffset(syntaxLength, false);
    return Matched.Leaf;
  }
  return Matched.None;
};
