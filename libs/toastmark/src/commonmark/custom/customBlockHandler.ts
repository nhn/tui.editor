import { Process, BlockHandler } from '../blockHandlers';
import { isSpaceOrTab, peek } from '../blockHelper';
import { unescapeString } from '../common';
import { CustomBlockNode, BlockNode } from '../node';

const reClosingCustomBlock = /^\$\$$/;

export const customBlock: BlockHandler = {
  continue(parser, container: CustomBlockNode) {
    const line = parser.currentLine;
    const match = line.match(reClosingCustomBlock);
    if (match) {
      // closing custom block
      parser.lastLineLength = match[0].length;
      parser.finalize(container as BlockNode, parser.lineNumber);
      return Process.Finished;
    }
    // skip optional spaces of custom block offset
    let i = container.offset;
    while (i > 0 && isSpaceOrTab(peek(line, parser.offset))) {
      parser.advanceOffset(1, true);
      i--;
    }
    return Process.Go;
  },
  finalize(_, block: CustomBlockNode) {
    if (block.stringContent === null) {
      return;
    }
    // first line becomes info string
    const content = block.stringContent;
    const newlinePos = content.indexOf('\n');
    const firstLine = content.slice(0, newlinePos);
    const rest = content.slice(newlinePos + 1);
    const infoString = firstLine.match(/^(\s*)(.*)/);

    block.info = unescapeString(infoString![2].trim());
    block.literal = rest;
    block.stringContent = null;
  },
  canContain() {
    return false;
  },
  acceptsLines: true,
};
