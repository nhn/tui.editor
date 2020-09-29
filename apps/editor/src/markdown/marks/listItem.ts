import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import isNumber from 'tui-code-snippet/type/isNumber';
// @ts-ignore
import { Context, EditorCommand } from '@t/spec';
import { MdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { isListNode } from '@/utils/markdown';
import {
  getEditorToMdPos,
  getMdToEditorPos,
  replaceBlockNodes,
  resolveSelectionPos,
  spaceToNbsp
} from '../helper/pos';
import { otherListToList, otherToList } from '../helper/list';

type CommandType = 'bullet' | 'ordered' | 'task';

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
      const fragment = doc.content;

      const [startPos, endPos] = getEditorToMdPos(from, to, doc, selection.empty);
      const [startLine, startOffset] = startPos;
      const [endLine, endOffset] = endPos;

      let result: string[] = [];

      for (let line = startLine; line <= endLine; line += 1) {
        const mdNode: MdNode = toastMark.findFirstNodeAtLine(line);
        const { type } = mdNode;

        if (type === 'codeBlock' || type === 'heading' || type === 'table') {
          break;
        }

        const curNodeInfo = { toastMark, mdNode, fragment, line };

        const { firstSameLine, lastSameLine, changedTexts } = isListNode(mdNode)
          ? otherListToList[commandType](curNodeInfo)
          : otherToList[commandType](curNodeInfo);

        // To skip unnecessary processing
        if (lastSameLine && lastSameLine > line) {
          line = lastSameLine;
        }

        result = result.concat(changedTexts);
      }

      const nodes = result.map(text =>
        schema.nodes.paragraph.create(null, schema.text(spaceToNbsp(text)))
      );

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
