import { DOMOutputSpecArray, Mark as ProsemirrorMark, ProsemirrorNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';
import { ListItemMdNode, MdNode } from '@toast-ui/toastmark';
import { EditorCommand, MdSpecContext } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { isListNode } from '@/utils/markdown';
import { createText, createTextSelection } from '@/helper/manipulation';
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
    return ({ selection, doc, schema, tr }, dispatch) => {
      const { toastMark } = this.context;
      const { to, startFromOffset, endFromOffset, endIndex, endToOffset } = getRangeInfo(selection);
      const textContent = getTextContent(doc, endIndex);
      const isList = reList.test(textContent);

      if (!isList || selection.from === startFromOffset || !selection.empty) {
        return false;
      }

      const isEmpty = !textContent.replace(reCanBeTaskList, '').trim();

      if (isEmpty) {
        tr.deleteRange(endFromOffset, endToOffset).split(tr.mapping.map(endToOffset));
      } else {
        const commandType = getListType(textContent);
        // should add `1` to line for the markdown parser
        // because markdown parser has `1`(not zero) as the start number
        const mdNode = toastMark.findFirstNodeAtLine(endIndex + 1) as ListItemMdNode;
        const slicedText = textContent.slice(to - endFromOffset);
        const slicedTextLen = slicedText.length;
        const context: ExtendListContext = { toastMark, mdNode, doc, line: endIndex + 1 };
        const { listSyntax, changedResults } = extendList[commandType](context);

        const node = createText(schema, listSyntax + slicedText);

        // split the block
        tr.split(to);

        // change ordinal number of backward ordered list
        if (changedResults?.length) {
          changedResults.unshift({ text: listSyntax + slicedText, line: endIndex + 1 });
          let from = to;
          const sIndex = changedResults[0].line;
          const eIndex = changedResults[changedResults.length - 1].line;

          for (let i = sIndex; i <= eIndex; i += 1) {
            const { nodeSize, content } = tr.doc.child(i);
            const mappedFrom = tr.mapping.map(from);
            const mappedTo = mappedFrom + content.size;
            const [changedResult] = changedResults.filter((result) => result.line === i);

            if (changedResult) {
              tr.replaceWith(mappedFrom, mappedTo, createText(schema, changedResult.text));
            }
            from += nodeSize;
          }
          const pos = tr.mapping.map(endToOffset) - slicedText.length;

          tr.setSelection(createTextSelection(tr, pos));
        } else {
          tr.delete(tr.mapping.map(endToOffset) - slicedTextLen, tr.mapping.map(endToOffset))
            .insert(tr.mapping.map(endToOffset), node)
            .setSelection(createTextSelection(tr, tr.mapping.map(endToOffset) - slicedTextLen));
        }
      }
      dispatch!(tr);
      return true;
    };
  }

  private toList(commandType: CommandType): EditorCommand {
    return () => ({ doc, tr, selection }, dispatch) => {
      const { toastMark } = this.context;
      const rangeInfo = getRangeInfo(selection);
      // should add `1` to line for the markdown parser
      // because markdown parser has `1`(not zero) as the start number
      const startLine = rangeInfo.startIndex + 1;
      const endLine = rangeInfo.endIndex + 1;
      let { endToOffset } = rangeInfo;

      let skipLines: number[] = [];

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
        const { changedResults } = isListNode(mdNode)
          ? otherListToList[commandType](context as ToListContext)
          : otherNodeToList[commandType](context);

        const endOffset = this.changeToListPerLine(tr, doc, changedResults);

        endToOffset = Math.max(endOffset, endToOffset);

        if (changedResults) {
          skipLines = skipLines.concat(changedResults.map((info) => info.line));
        }
      }

      dispatch!(tr.setSelection(createTextSelection(tr, tr.mapping.map(endToOffset))));
      return false;
    };
  }

  private changeToListPerLine(
    tr: Transaction,
    doc: ProsemirrorNode,
    changedResults: ChangedListInfo[]
  ) {
    const { mapping } = tr;
    const { schema } = this.context;
    let maxEndOffset = 0;

    changedResults.forEach(({ line, text }) => {
      // should subtract '1' to markdown line position
      // because markdown parser has '1'(not zero) as the start number
      const { startOffset, endOffset } = getNodeContentOffsetRange(doc, line - 1);

      tr.replaceWith(mapping.map(startOffset), mapping.map(endOffset), createText(schema, text));

      maxEndOffset = Math.max(maxEndOffset, endOffset);
    });

    return maxEndOffset;
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
