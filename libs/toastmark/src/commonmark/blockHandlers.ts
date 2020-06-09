import { Parser } from './blocks';
import { taskListItemFinalize } from './gfm/taskListItem';
import {
  table,
  tableHead,
  tableBody,
  tableRow,
  tableCell,
  tableDelimRow,
  tableDelimCell
} from './gfm/tableBlockHandler';
import { ListNode, BlockNode, CodeBlockNode, HtmlBlockNode } from './node';
import {
  peek,
  isBlank,
  isSpaceOrTab,
  endsWithBlankLine,
  reClosingCodeFence,
  CODE_INDENT,
  C_OPEN_BRACKET,
  C_GREATERTHAN
} from './blockHelper';
import { unescapeString } from './common';

export const enum Process {
  Go = 0,
  Stop = 1,
  Finished = 2
}

// 'finalize' is run when the block is closed.
// 'continue' is run to check whether the block is continuing
// at a certain line and offset (e.g. whether a block quote
// contains a `>`.  It returns 0 for matched, 1 for not matched,
// and 2 for "we've dealt with this line completely, go to next."
export interface BlockHandler {
  continue(parser: Parser, container: BlockNode): Process;
  finalize(parser: Parser, block: BlockNode): void;
  canContain(type: string): boolean;
  acceptsLines: boolean;
}

const document: BlockHandler = {
  continue() {
    return Process.Go;
  },
  finalize() {},
  canContain(t) {
    return t !== 'item';
  },
  acceptsLines: false
};

const list: BlockHandler = {
  continue() {
    return Process.Go;
  },
  finalize(_, block: ListNode) {
    let item = block.firstChild as BlockNode;
    while (item) {
      // check for non-final list item ending with blank line:
      if (endsWithBlankLine(item) && item.next) {
        block.listData!.tight = false;
        break;
      }
      // recurse into children of list item, to see if there are
      // spaces between any of them:
      let subitem = item.firstChild as BlockNode;
      while (subitem) {
        if (endsWithBlankLine(subitem) && (item.next || subitem.next)) {
          block.listData!.tight = false;
          break;
        }
        subitem = subitem.next as BlockNode;
      }
      item = item.next as BlockNode;
    }
  },
  canContain(t) {
    return t === 'item';
  },
  acceptsLines: false
};

const blockQuote: BlockHandler = {
  continue(parser) {
    const ln = parser.currentLine;
    if (!parser.indented && peek(ln, parser.nextNonspace) === C_GREATERTHAN) {
      parser.advanceNextNonspace();
      parser.advanceOffset(1, false);
      if (isSpaceOrTab(peek(ln, parser.offset))) {
        parser.advanceOffset(1, true);
      }
    } else {
      return Process.Stop;
    }
    return Process.Go;
  },
  finalize() {},
  canContain(t) {
    return t !== 'item';
  },
  acceptsLines: false
};

const item: BlockHandler = {
  continue(parser, container: ListNode) {
    if (parser.blank) {
      if (container.firstChild === null) {
        // Blank line after empty list item
        return Process.Stop;
      }
      parser.advanceNextNonspace();
    } else if (parser.indent >= container.listData!.markerOffset + container.listData!.padding) {
      parser.advanceOffset(container.listData!.markerOffset + container.listData!.padding, true);
    } else {
      return Process.Stop;
    }
    return Process.Go;
  },
  finalize: taskListItemFinalize,
  canContain(t) {
    return t !== 'item';
  },
  acceptsLines: false
};

const heading: BlockHandler = {
  continue() {
    // a heading can never container > 1 line, so fail to match:
    return Process.Stop;
  },
  finalize() {},
  canContain() {
    return false;
  },
  acceptsLines: false
};

const thematicBreak: BlockHandler = {
  continue() {
    // a thematic break can never container > 1 line, so fail to match:
    return Process.Stop;
  },
  finalize() {},
  canContain() {
    return false;
  },
  acceptsLines: false
};

const codeBlock: BlockHandler = {
  continue(parser, container: CodeBlockNode) {
    const ln = parser.currentLine;
    const indent = parser.indent;
    if (container.isFenced) {
      // fenced
      const match =
        indent <= 3 &&
        ln.charAt(parser.nextNonspace) === container.fenceChar &&
        ln.slice(parser.nextNonspace).match(reClosingCodeFence);
      if (match && match[0].length >= container.fenceLength) {
        // closing fence - we're at end of line, so we can return
        parser.lastLineLength = parser.offset + indent + match[0].length;
        parser.finalize(container as BlockNode, parser.lineNumber);
        return Process.Finished;
      }
      // skip optional spaces of fence offset
      let i = container.fenceOffset;
      while (i > 0 && isSpaceOrTab(peek(ln, parser.offset))) {
        parser.advanceOffset(1, true);
        i--;
      }
    } else {
      // indented
      if (indent >= CODE_INDENT) {
        parser.advanceOffset(CODE_INDENT, true);
      } else if (parser.blank) {
        parser.advanceNextNonspace();
      } else {
        return Process.Stop;
      }
    }
    return Process.Go;
  },
  finalize(_, block: CodeBlockNode) {
    if (block.stringContent === null) {
      return;
    }
    if (block.isFenced) {
      // fenced
      // first line becomes info string
      const content = block.stringContent;
      const newlinePos = content.indexOf('\n');
      const firstLine = content.slice(0, newlinePos);
      const rest = content.slice(newlinePos + 1);
      const infoString = firstLine.match(/^(\s*)(.*)/);
      block.infoPadding = infoString![1].length;
      block.info = unescapeString(infoString![2].trim());
      block.literal = rest;
    } else {
      // indented
      block.literal = block.stringContent?.replace(/(\n *)+$/, '\n');
    }
    block.stringContent = null; // allow GC
  },
  canContain() {
    return false;
  },
  acceptsLines: true
};

const htmlBlock: BlockHandler = {
  continue(parser, container: HtmlBlockNode) {
    return parser.blank && (container.htmlBlockType === 6 || container.htmlBlockType === 7)
      ? Process.Stop
      : Process.Go;
  },
  finalize(_, block) {
    block.literal = block.stringContent?.replace(/(\n *)+$/, '') || null;
    block.stringContent = null; // allow GC
  },
  canContain() {
    return false;
  },
  acceptsLines: true
};

const paragraph: BlockHandler = {
  continue(parser) {
    return parser.blank ? Process.Stop : Process.Go;
  },
  finalize(parser, block) {
    if (block.stringContent === null) {
      return;
    }

    let pos: number;
    let hasReferenceDefs = false;

    // try parsing the beginning as link reference definitions:
    while (
      peek(block.stringContent, 0) === C_OPEN_BRACKET &&
      (pos = parser.inlineParser.parseReference(block, parser.refMap))
    ) {
      block.stringContent = block.stringContent.slice(pos);
      hasReferenceDefs = true;
    }
    if (hasReferenceDefs && isBlank(block.stringContent)) {
      block.unlink();
    }
  },
  canContain() {
    return false;
  },
  acceptsLines: true
};

const refDef: BlockHandler = {
  continue() {
    return Process.Stop;
  },
  finalize() {},
  canContain() {
    return false;
  },
  acceptsLines: true
};

export const blockHandlers = {
  document,
  list,
  blockQuote,
  item,
  heading,
  thematicBreak,
  codeBlock,
  htmlBlock,
  paragraph,
  table,
  tableBody,
  tableHead,
  tableRow,
  tableCell,
  tableDelimRow,
  tableDelimCell,
  refDef
};
