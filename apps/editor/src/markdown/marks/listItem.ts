import {
  DOMOutputSpecArray,
  Mark as ProsemirrorMark,
  Node as ProsemirrorNode
} from 'prosemirror-model';
import { TextSelection, Transaction } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';
import isNumber from 'tui-code-snippet/type/isNumber';
import { Context, EditorCommand } from '@t/spec';
import { ListItemMdNode, MdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { isListNode } from '@/utils/markdown';
import { getEditorToMdLine, getExtendedRangeOffset, resolveSelectionPos } from '../helper/pos';
import { createParagraph, insertBlockNodes, replaceBlockNodes } from '../helper/manipulation';
import {
  ChangedListInfo,
  extendList,
  ExtendListContext,
  getListType,
  otherListToList,
  otherNodeToList,
  reList,
  ToListContext
} from '../helper/list';
import { getTextByMdLine } from '../helper/query';

type CommandType = 'bullet' | 'ordered' | 'task';

function canNotBeListNode(mdNode: MdNode) {
  const { type } = mdNode;

  return type === 'codeBlock' || type === 'heading' || type.indexOf('table') !== -1;
}

function getPosInfo(doc: ProsemirrorNode, from: number, to: number) {
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

  private extendList({ schema, toastMark }: Context): Command {
    return (state, dispatch) => {
      const { selection, tr, doc } = state;
      const [, to] = resolveSelectionPos(selection);
      const { startOffset, endOffset, endLine } = getPosInfo(doc, to, to);

      const lineText = getTextByMdLine(doc, endLine);
      const isList = reList.test(lineText);

      if (!isList || selection.from === startOffset) {
        return false;
      }

      const isEmpty = !lineText.replace(reList, '').trim();
      const commandType: CommandType = getListType(lineText);

      const mdNode: ListItemMdNode = toastMark.findFirstNodeAtLine(endLine);
      const emptyNode = createParagraph(schema);

      if (isEmpty) {
        dispatch!(replaceBlockNodes(tr, startOffset, endOffset, [emptyNode, emptyNode]));
      } else {
        const slicedText = lineText.slice(to - startOffset);
        const context: ExtendListContext = { toastMark, mdNode, doc, line: endLine };
        const { listSyntax, orderedList, lastListOffset } = extendList[commandType](context);

        const node = createParagraph(schema, listSyntax + slicedText);
        let newTr: Transaction | null = null;

        // To change ordinal number of backward ordered list
        if (orderedList?.length) {
          const offset = doc.resolve(lastListOffset!).end();
          const nodes = orderedList.map(({ text }) => createParagraph(schema, text));

          nodes.unshift(node);

          newTr = replaceBlockNodes(tr, to, offset, nodes, { from: 0, to: 1 });
        } else {
          newTr = slicedText
            ? replaceBlockNodes(tr, to, endOffset, node, { from: 0, to: 1 })
            : insertBlockNodes(tr, endOffset, node);
        }

        const newSelection = TextSelection.create(newTr.doc, endOffset + listSyntax.length + 2);

        dispatch!(newTr.setSelection(newSelection));
      }

      return true;
    };
  }

  private toList({ schema, toastMark }: Context, commandType: CommandType): EditorCommand {
    return () => (state, dispatch) => {
      const { doc, tr, selection } = state;
      const [from, to] = resolveSelectionPos(selection);
      const posInfo = getPosInfo(doc, from, to);
      const { startLine, endLine } = posInfo;
      let { startOffset, endOffset } = posInfo;

      let skipLines: number[] = [];
      let changed: ChangedListInfo[] = [];

      for (let line = startLine; line <= endLine; line += 1) {
        const mdNode: MdNode = toastMark.findFirstNodeAtLine(line);

        if (mdNode && canNotBeListNode(mdNode)) {
          break;
        }

        // To skip unnecessary processing
        if (skipLines.indexOf(line) !== -1) {
          continue;
        }

        const context: ToListContext<MdNode> = { toastMark, mdNode, doc, line, startLine };
        const { firstListOffset, lastListOffset, changedResults } = isListNode(mdNode)
          ? otherListToList[commandType](context as ToListContext<ListItemMdNode>)
          : otherNodeToList[commandType](context);

        if (changedResults) {
          skipLines = skipLines.concat(changedResults.map(info => info.line));
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

        changed = changed.concat(changedResults);
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
    const bulletCommand = this.toList(context, 'bullet')();
    const orderedCommand = this.toList(context, 'ordered')();
    const taskCommand = this.toList(context, 'task')();

    return {
      'Mod-u': bulletCommand,
      'Mod-U': bulletCommand,
      'Mod-o': orderedCommand,
      'Mod-O': orderedCommand,
      'alt-t': taskCommand,
      'alt-T': taskCommand,
      Enter: this.extendList(context)
    };
  }
}
