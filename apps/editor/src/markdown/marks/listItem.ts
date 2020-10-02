import {
  DOMOutputSpecArray,
  Mark as ProsemirrorMark,
  Node as ProsemirrorNode
} from 'prosemirror-model';
import isNumber from 'tui-code-snippet/type/isNumber';
import { Context, EditorCommand } from '@t/spec';
import { MdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { isListNode } from '@/utils/markdown';
import { getEditorToMdLine, getExtendedRangeOffset, resolveSelectionPos } from '../helper/pos';
import { createParagraph, replaceBlockNodes } from '../helper/manipulation';
import { otherListToList, otherToList } from '../helper/list';

type CommandType = 'bullet' | 'ordered' | 'task';

function canNotBeListNode(mdNode: MdNode) {
  const { type } = mdNode;

  return type === 'codeBlock' || type === 'heading' || type.indexOf('table') !== -1;
}

export class ListItem extends Mark {
  get name() {
    return 'listItem';
  }

  get schema() {
    return {
      attrs: {
        odd: { default: false },
        even: { default: false },
        listStyle: { default: false }
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        const { odd, even, listStyle } = attrs;
        let classNames = 'list-item';

        if (listStyle) {
          classNames += '|list-item-style';
        }
        if (odd) {
          classNames += '|list-item-odd';
        }
        if (even) {
          classNames += '|list-item-even';
        }
        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    };
  }

  private toList({ schema, toastMark }: Context, commandType: CommandType): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, doc, tr } = state;
      const [from, to] = resolveSelectionPos(selection);

      const [startLine, endLine] = getEditorToMdLine(from, to, doc);
      let [startOffset, endOffset] = getExtendedRangeOffset(from, to, doc);

      let nodes: ProsemirrorNode[] = [];

      for (let line = startLine; line <= endLine; line += 1) {
        const mdNode: MdNode = toastMark.findFirstNodeAtLine(line);

        if (mdNode && canNotBeListNode(mdNode)) {
          break;
        }

        const curNodeInfo = { toastMark, mdNode, doc, line, range: [startLine, endLine] };
        const { firstListOffset, lastListOffset, lastListLine, changedTexts } = isListNode(mdNode)
          ? // @ts-ignore
            otherListToList[commandType](curNodeInfo)
          : // @ts-ignore
            otherToList[commandType](curNodeInfo);

        // To skip unnecessary processing
        if (lastListLine && lastListLine > line) {
          line = lastListLine;
        }

        // resolve start offset to change forward same depth list
        if (isNumber(firstListOffset) && firstListOffset < startOffset) {
          startOffset = firstListOffset;
        }

        // resolve end offset to change backward same depth list
        if (isNumber(lastListOffset)) {
          const offset = doc.resolve(lastListOffset).end();

          if (offset > endOffset) {
            endOffset = offset;
          }
        }

        nodes = nodes.concat(changedTexts.map(text => createParagraph(schema, text)));
      }

      if (nodes.length) {
        dispatch!(replaceBlockNodes(tr, startOffset, endOffset, nodes));
        return true;
      }

      return false;
    };
  }

  commands(context: Context) {
    return {
      ul: this.toList(context, 'bullet'),
      ol: this.toList(context, 'ordered'),
      task: this.toList(context, 'task')
    };
  }
}
