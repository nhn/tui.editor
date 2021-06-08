import { BlockStart, Matched } from '../blockStarts';
import { CustomBlockNode } from '../node';

const reCustomBlock = /^(\$\$)(\s*[a-zA-Z])+/;
const reCanBeCustomInline = /^(\$\$)(\s*[a-zA-Z])+.*(\$\$)/;

export const customBlock: BlockStart = (parser) => {
  let match;
  if (
    !parser.indented &&
    !reCanBeCustomInline.test(parser.currentLine) &&
    (match = parser.currentLine.match(reCustomBlock))
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
