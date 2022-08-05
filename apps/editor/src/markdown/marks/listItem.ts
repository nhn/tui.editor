import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';
import { ListItemMdNode, MdNode } from '@toast-ui/toastmark';
import { EditorCommand, MdSpecContext } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { isListNode } from '@/utils/markdown';
import { createTextNode, createTextSelection, splitAndExtendBlock } from '@/helper/manipulation';
import { last } from '@/utils/common';
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

function cannotBeListNode({ type, sourcepos }: MdNode, line: number) {
  // eslint-disable-next-line prefer-destructuring
  const startLine = sourcepos![0][0];

  return line <= startLine && (type === 'codeBlock' || type === 'heading' || type.match('table'));
}

interface RangeInfo {
  from: number;
  startLine: number;
  endLine: number;
  indexDiff?: number;
}

export class ListItem extends Mark {
  context!: MdSpecContext;

  get name() {
    return 'listItem';
  }

  get schema() {
    return {
      attrs: {
        odd: { default: false },
        even: { default: false },
        listStyle: { default: false },
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpec {
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
        const context: ExtendListContext = { toastMark, mdNode, doc, line: endIndex + 1 };
        const { listSyntax, changedResults } = extendList[commandType](context);

        // change ordinal number of backward ordered list
        if (changedResults?.length) {
          // split the block
          tr.split(to);

          // set first ordered list info
          changedResults.unshift({ text: listSyntax + slicedText, line: endIndex + 1 });

          this.changeToListPerLine(tr, changedResults, {
            from: to,
            // don't subtract 1 because the line has increased through 'split' command.
            startLine: changedResults[0].line,
            endLine: last(changedResults).line,
          });

          const pos = tr.mapping.map(endToOffset) - slicedText.length;

          tr.setSelection(createTextSelection(tr, pos));
        } else {
          const node = createTextNode(schema, listSyntax + slicedText);

          splitAndExtendBlock(tr, endToOffset, slicedText, node);
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

        if (mdNode && cannotBeListNode(mdNode, line)) {
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

        const endOffset = this.changeToListPerLine(tr, changedResults, {
          from: getNodeContentOffsetRange(doc, changedResults[0].line - 1).startOffset,
          startLine: changedResults[0].line,
          endLine: last(changedResults).line,
          indexDiff: 1,
        });

        endToOffset = Math.max(endOffset, endToOffset);

        if (changedResults) {
          skipLines = skipLines.concat(changedResults.map((info) => info.line));
        }
      }

      dispatch!(tr.setSelection(createTextSelection(tr, tr.mapping.map(endToOffset))));
      return true;
    };
  }

  private changeToListPerLine(
    tr: Transaction,
    changedResults: ChangedListInfo[],
    { from, startLine, endLine, indexDiff = 0 }: RangeInfo
  ) {
    let maxEndOffset = 0;

    for (let i = startLine - indexDiff; i <= endLine - indexDiff; i += 1) {
      const { nodeSize, content } = tr.doc.child(i);
      const mappedFrom = tr.mapping.map(from);
      const mappedTo = mappedFrom + content.size;
      const [changedResult] = changedResults.filter((result) => result.line - indexDiff === i);

      if (changedResult) {
        tr.replaceWith(
          mappedFrom,
          mappedTo,
          createTextNode(this.context.schema, changedResult.text)
        );
        maxEndOffset = Math.max(maxEndOffset, from + content.size);
      }
      from += nodeSize;
    }

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
