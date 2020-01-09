import { BlockNode } from './node';

export const CODE_INDENT = 4;
export const C_TAB = 9;
export const C_NEWLINE = 10;
export const C_GREATERTHAN = 62;
export const C_LESSTHAN = 60;
export const C_SPACE = 32;
export const C_OPEN_BRACKET = 91;

export const reNonSpace = /[^ \t\f\v\r\n]/;

export const reClosingCodeFence = /^(?:`{3,}|~{3,})(?= *$)/;

// Returns true if block ends with a blank line, descending if needed
// into lists and sublists.
export function endsWithBlankLine(block: BlockNode) {
  let curBlock: BlockNode | null = block;

  while (curBlock) {
    if (curBlock.lastLineBlank) {
      return true;
    }
    const t = curBlock.type;
    if (!curBlock.lastLineChecked && (t === 'list' || t === 'item')) {
      curBlock.lastLineChecked = true;
      curBlock = curBlock.lastChild as BlockNode;
    } else {
      curBlock.lastLineChecked = true;
      break;
    }
  }
  return false;
}

export function peek(ln: string, pos: number) {
  if (pos < ln.length) {
    return ln.charCodeAt(pos);
  }
  return -1;
}

// Returns true if string contains only space characters.
export function isBlank(s: string) {
  return !reNonSpace.test(s);
}

export function isSpaceOrTab(c: number) {
  return c === C_SPACE || c === C_TAB;
}
