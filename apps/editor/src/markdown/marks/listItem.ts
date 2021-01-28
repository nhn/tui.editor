import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';
import isNumber from 'tui-code-snippet/type/isNumber';
import { EditorCommand } from '@t/spec';
import { ListItemMdNode, MdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { isListNode } from '@/utils/markdown';
import {
  createParagraph,
  createTextSelection,
  insertNodes,
  replaceNodes,
} from '@/helper/manipulation';
import {
  ChangedListInfo,
  extendList,
  ExtendListContext,
  getListType,
  otherListToList,
  otherNodeToList,
  reCanBeTaskList,
  reList,
  ToListContext,
} from '../helper/list';
import { getTextByMdLine } from '../helper/query';
import { getPosInfo } from '../helper/pos';

type CommandType = 'bullet' | 'ordered' | 'task';

function canNotBeListNode({ type }: MdNode) {
  return type === 'codeBlock' || type === 'heading' || type.indexOf('table') !== -1;
}

export class ListItem extends Mark {
  get name() {
    return 'listItem';
  }

  get defaultSchema() {
    return {
      attrs: {
        odd: { default: false },
        even: { default: false },
        listStyle: { default: false },
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
      },
    };
  }

  private extendList(): Command {
    return ({ selection, tr, doc, schema }, dispatch) => {
      const { toastMark } = this.context;
      const { to, startOffset, endOffset, endLine } = getPosInfo(doc, selection, true);

      const lineText = getTextByMdLine(doc, endLine);
      const isList = reList.test(lineText);

      if (!isList || selection.from === startOffset) {
        return false;
      }

      const isEmpty = !lineText.replace(reCanBeTaskList, '').trim();
      const commandType = getListType(lineText);

      if (isEmpty) {
        const emptyNode = createParagraph(schema);

        dispatch!(replaceNodes(tr, startOffset, endOffset, [emptyNode, emptyNode]));
      } else {
        const mdNode: ListItemMdNode = toastMark.findFirstNodeAtLine(endLine);
        const slicedText = lineText.slice(to - startOffset);
        const context: ExtendListContext = { toastMark, mdNode, doc, line: endLine };
        const { listSyntax, changedResults, lastListOffset } = extendList[commandType](context);

        const node = createParagraph(schema, listSyntax + slicedText);
        let newTr: Transaction | null;

        // To change ordinal number of backward ordered list
        if (changedResults?.length) {
          const extendedEndOffset = doc.resolve(lastListOffset!).end();
          const nodes = changedResults.map(({ text }) => createParagraph(schema, text));

          nodes.unshift(node);

          newTr = replaceNodes(tr, to, extendedEndOffset, nodes, { from: 0, to: 1 });
        } else {
          newTr = slicedText
            ? replaceNodes(tr, to, endOffset, node, { from: 0, to: 1 })
            : insertNodes(tr, endOffset, node);
        }

        const newSelection = createTextSelection(newTr, endOffset + listSyntax.length + 2);

        dispatch!(newTr.setSelection(newSelection));
      }

      return true;
    };
  }

  private toList(commandType: CommandType): EditorCommand {
    return () => ({ doc, tr, selection, schema }, dispatch) => {
      const { toastMark } = this.context;
      const posInfo = getPosInfo(doc, selection);
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
          ? otherListToList[commandType](context as ToListContext)
          : otherNodeToList[commandType](context);

        if (changedResults) {
          skipLines = skipLines.concat(changedResults.map((info) => info.line));
        }

        // resolve start offset to change forward same depth list
        if (isNumber(firstListOffset) && firstListOffset < startOffset) {
          startOffset = firstListOffset;
        }

        // resolve end offset to change backward same depth list
        if (isNumber(lastListOffset)) {
          const lastEndOffset = doc.resolve(lastListOffset).end();

          if (lastEndOffset > endOffset) {
            endOffset = lastEndOffset;
          }
        }

        changed = changed.concat(changedResults);
      }

      if (changed.length) {
        changed.sort((a, b) => (a.line < b.line ? -1 : 1));
        const nodes = changed.map((info) => createParagraph(schema, info.text));

        dispatch!(replaceNodes(tr, startOffset, endOffset, nodes));
        return true;
      }

      return false;
    };
  }

  commands() {
    return {
      bulletList: this.toList('bullet'),
      orderedList: this.toList('ordered'),
      taskList: this.toList('task'),
    };
  }

  keymaps() {
    const bulletCommand = this.toList('bullet')();
    const orderedCommand = this.toList('ordered')();
    const taskCommand = this.toList('task')();

    return {
      'Mod-u': bulletCommand,
      'Mod-U': bulletCommand,
      'Mod-o': orderedCommand,
      'Mod-O': orderedCommand,
      'alt-t': taskCommand,
      'alt-T': taskCommand,
      Enter: this.extendList(),
    };
  }
}
