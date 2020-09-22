import { Parser } from '../blocks';
import { ListNode, BlockNode } from '../node';

const reTaskListItemMarker = /^\[([ \txX])\][ \t]+/;

// finalize for block handler
export function taskListItemFinalize(_: Parser, block: ListNode) {
  if (block.firstChild && block.firstChild.type === 'paragraph') {
    const p = block.firstChild as BlockNode;
    const m = p.stringContent!.match(reTaskListItemMarker);
    if (m) {
      const mLen = m[0].length;
      p.stringContent = p.stringContent!.substring(mLen - 1);
      p.sourcepos![0][1] += mLen;
      p.lineOffsets![0] += mLen;
      block.listData!.task = true;
      block.listData!.checked = /[xX]/.test(m[1]);
    }
  }
}
