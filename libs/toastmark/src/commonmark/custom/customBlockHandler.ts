import { Process, BlockHandler } from '../blockHandlers';
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
  acceptsLines: true
};
