import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';
import { ListItemMdNode, MdNode } from '@toast-ui/toastmark';
import isNumber from 'tui-code-snippet/type/isNumber';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import { EditorCommand, MdSpecContext } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
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
import { getRangeInfo, getNodeContentOffsetRange } from '../helper/pos';
import { getTextContent } from '../helper/query';

type CommandType = 'bullet' | 'ordered' | 'task';

function cannotBeListNode({ type }: MdNode) {
  return type === 'codeBlock' || type === 'heading' || type.indexOf('table') !== -1;
}

export class ListItem extends Mark {
  context!: MdSpecContext;

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
        return ['span', { class: clsWithMdPrefix(...classNames.split('|')) }, 0];
      },
    };
  }

  private extendList(): Command {
    return ({ selection, tr, doc, schema }, dispatch) => {
      const { toastMark } = this.context;
      const { to, startFromOffset, endFromOffset, endToOffset, endIndex } = getRangeInfo(selection);
      const textContent = getTextContent(doc, endIndex);
      const isList = reList.test(textContent);

      if (!isList || selection.from === startFromOffset) {
        return false;
      }

      const isEmpty = !textContent.replace(reCanBeTaskList, '').trim();

      if (isEmpty) {
        const emptyNode = createParagraph(schema);
        // add 2 empty lines when the node is last node
        const nodes = doc.childCount - 1 === endIndex ? [emptyNode, emptyNode] : [emptyNode];

        dispatch!(replaceNodes(tr, startFromOffset, endToOffset, nodes));
      } else {
        const commandType = getListType(textContent);
        // should add `1` to line for the markdown parser
        // because markdown parser has `1`(not zero) as the start number
        const mdNode = toastMark.findFirstNodeAtLine(endIndex + 1) as ListItemMdNode;
        const slicedText = textContent.slice(to - endFromOffset);
        const context: ExtendListContext = { toastMark, mdNode, doc, line: endIndex + 1 };
        const { listSyntax, changedResults, lastIndex } = extendList[commandType](context);

        const node = createParagraph(schema, listSyntax + slicedText);
        let newTr: Transaction | null;

        // change ordinal number of backward ordered list
        if (changedResults?.length) {
          // get end offset of the last list
          const { endOffset } = getNodeContentOffsetRange(doc, lastIndex!);
          const nodes = changedResults.map(({ text }) => createParagraph(schema, text));

          nodes.unshift(node);

          newTr = replaceNodes(tr, to, endOffset, nodes, { from: 0, to: 1 });
        } else {
          newTr = slicedText
            ? replaceNodes(tr, to, endToOffset, node, { from: 0, to: 1 })
            : insertNodes(tr, endToOffset, node);
        }
        // should add `2` to selection end position considering start, end block tag position
        const newSelection = createTextSelection(newTr, to + listSyntax.length + 2);

        dispatch!(newTr.setSelection(newSelection));
      }

      return true;
    };
  }

  private toList(commandType: CommandType): EditorCommand {
    return () => ({ doc, tr, selection, schema }, dispatch) => {
      const { toastMark } = this.context;
      const rangeInfo = getRangeInfo(selection);
      // should add `1` to line for the markdown parser
      // because markdown parser has `1`(not zero) as the start number
      const startLine = rangeInfo.startIndex + 1;
      let endLine = rangeInfo.endIndex + 1;
      let { startFromOffset, endToOffset } = rangeInfo;

      let skipLines: number[] = [];
      let changed: ChangedListInfo[] = [];

      for (let line = startLine; line <= endLine; line += 1) {
        const mdNode: MdNode = toastMark.findFirstNodeAtLine(line)!;

        if (mdNode && cannotBeListNode(mdNode)) {
          break;
        }

        // to skip unnecessary processing
        if (skipLines.indexOf(line) !== -1) {
          continue;
        }

        const context: ToListContext<MdNode> = { toastMark, mdNode, doc, line, startLine };
        const { firstIndex, lastIndex, changedResults } = isListNode(mdNode)
          ? otherListToList[commandType](context as ToListContext)
          : otherNodeToList[commandType](context);
        let firstListStartOffset, lastListEndOffset;

        if (!isUndefined(firstIndex)) {
          firstListStartOffset = getNodeContentOffsetRange(doc, firstIndex).startOffset;
        }
        if (!isUndefined(lastIndex)) {
          endLine = Math.max(endLine, lastIndex + 1);
          lastListEndOffset = getNodeContentOffsetRange(doc, lastIndex).endOffset;
        }

        if (changedResults) {
          skipLines = skipLines.concat(changedResults.map((info) => info.line));
        }

        // resolve start offset to change forward same depth list
        if (isNumber(firstListStartOffset) && firstListStartOffset < startFromOffset) {
          startFromOffset = firstListStartOffset;
        }

        // resolve end offset to change backward same depth list
        if (isNumber(lastListEndOffset) && lastListEndOffset > endToOffset) {
          endToOffset = lastListEndOffset;
        }
        changed = changed.concat(changedResults);
      }

      if (changed.length) {
        changed.sort((a, b) => (a.line < b.line ? -1 : 1));
        const nodes = changed.map((info) => createParagraph(schema, info.text));

        replaceNodes(tr, startFromOffset, endToOffset, nodes);
        dispatch!(tr.setSelection(createTextSelection(tr, tr.mapping.map(endToOffset) - 1)));
        return true;
      }
      return false;
    };
  }

  private toggleTask(): Command {
    return ({ selection, tr, doc, schema }, dispatch) => {
      const { toastMark } = this.context;
      const { startIndex, endIndex } = getRangeInfo(selection);
      let newTr: Transaction | null = null;

      for (let i = startIndex; i <= endIndex; i += 1) {
        const mdNode = toastMark.findFirstNodeAtLine(i + 1)!;

        if (isListNode(mdNode) && mdNode.listData.task) {
          const { checked, padding } = mdNode.listData;
          const stateChar = checked ? ' ' : 'x';
          const [mdPos] = mdNode.sourcepos!;
          let { startOffset } = getNodeContentOffsetRange(doc, mdPos[0] - 1);

          startOffset += mdPos[1] + padding;

          newTr = tr.replaceWith(startOffset, startOffset + 1, schema.text(stateChar));
        }
      }
      if (newTr) {
        dispatch!(newTr);
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
    const togleTaskCommand = this.toggleTask();

    return {
      'Mod-u': bulletCommand,
      'Mod-U': bulletCommand,
      'Mod-o': orderedCommand,
      'Mod-O': orderedCommand,
      'alt-t': taskCommand,
      'alt-T': taskCommand,
      'Shift-Ctrl-x': togleTaskCommand,
      'Shift-Ctrl-X': togleTaskCommand,
      Enter: this.extendList(),
    };
  }
}
