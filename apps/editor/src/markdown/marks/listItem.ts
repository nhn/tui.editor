import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import isNumber from 'tui-code-snippet/type/isNumber';
import { Context, EditorCommand } from '@t/spec';
import { MdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { isListNode } from '@/utils/markdown';
import { getEditorToMdLine, getExtendedRangeOffset, resolveSelectionPos } from '../helper/pos';
import { createParagraph, replaceBlockNodes } from '../helper/manipulation';
import { ChangedInfo, CurNodeInfo, otherListToList, otherNodeToList } from '../helper/list';

type CommandType = 'bullet' | 'ordered' | 'task';

function canNotBeListNode(mdNode: MdNode) {
  const { type } = mdNode;

  return type === 'codeBlock' || type === 'heading' || type.indexOf('table') !== -1;
}

function getPosInfo(state: EditorState) {
  const { selection, doc } = state;
  const [from, to] = resolveSelectionPos(selection);
  const [startOffset, endOffset] = getExtendedRangeOffset(from, to, doc);
  const [startLine, endLine] = getEditorToMdLine(from, to, doc);

  return { startOffset, endOffset, startLine, endLine };
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
      const { doc, tr } = state;
      const posInfo = getPosInfo(state);
      const { startLine, endLine } = posInfo;
      let { startOffset, endOffset } = posInfo;

      let skipLines: number[] = [];
      let changed: ChangedInfo[] = [];

      for (let line = startLine; line <= endLine; line += 1) {
        const mdNode: MdNode = toastMark.findFirstNodeAtLine(line);

        // To skip unnecessary processing
        if (skipLines.indexOf(line) !== -1) {
          continue;
        }
        if (mdNode && canNotBeListNode(mdNode)) {
          break;
        }

        const curNodeInfo: CurNodeInfo = {
          toastMark,
          mdNode,
          doc,
          line,
          range: [startLine, endLine]
        };
        const { firstListOffset, lastListOffset, changedInfo } = isListNode(mdNode)
          ? otherListToList[commandType](curNodeInfo)
          : otherNodeToList[commandType](curNodeInfo);

        if (changedInfo) {
          skipLines = skipLines.concat(changedInfo.map(info => info.line));
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

        changed = changed.concat(changedInfo);
      }

      if (changed.length) {
        changed.sort((a, b) => (a.line < b.line ? -1 : 1));
        const nodes = changed.map(info => createParagraph(schema, info.text));

        dispatch!(replaceBlockNodes(tr, startOffset, endOffset, nodes));
        return true;
      }

      return false;
    };
  }

  commands(context: Context) {
    return {
      bulletList: this.toList(context, 'bullet'),
      orderedList: this.toList(context, 'ordered'),
      taskList: this.toList(context, 'task')
    };
  }

  keymaps(context: Context) {
    const ulCommand = this.toList(context, 'bullet')();
    const olCommand = this.toList(context, 'ordered')();
    const taskCommand = this.toList(context, 'task')();

    return {
      'Mod-u': ulCommand,
      'Mod-U': ulCommand,
      'Mod-o': olCommand,
      'Mod-O': olCommand,
      'alt-t': taskCommand,
      'alt-T': taskCommand
    };
  }
}
