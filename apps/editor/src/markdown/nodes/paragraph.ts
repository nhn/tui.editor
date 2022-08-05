import { DOMOutputSpec, ProsemirrorNode, Schema } from 'prosemirror-model';
import { Transaction, Selection } from 'prosemirror-state';
import { chainCommands, joinForward, Command } from 'prosemirror-commands';
import { EditorCommand, MdSpecContext } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Node from '@/spec/node';
import { isBulletListNode, isOrderedListNode } from '@/utils/markdown';
import { createTextNode, createTextSelection, replaceTextNode } from '@/helper/manipulation';
import { reBlockQuote } from '../marks/blockQuote';
import { getRangeInfo, getNodeContentOffsetRange } from '../helper/pos';
import { getReorderedListInfo, reList, reOrderedListGroup } from '../helper/list';
import { getTextByMdLine, getTextContent } from '../helper/query';

interface SelectionInfo {
  from: number;
  to: number;
}

interface IndentSelectionInfo extends SelectionInfo {
  type: 'indent';
  lineLen: number;
}

interface OutdentSelectionInfo extends SelectionInfo {
  type: 'outdent';
  spaceLenList: number[];
}

const reStartSpace = /(^\s{1,4})(.*)/;

function isBlockUnit(from: number, to: number, text: string) {
  return from < to || reList.test(text) || reBlockQuote.test(text);
}

function isInTableCellNode(doc: ProsemirrorNode, schema: Schema, selection: Selection) {
  let $pos = selection.$from;

  if ($pos.depth === 0) {
    $pos = doc.resolve($pos.pos - 1);
  }
  const node = $pos.node(1);
  const startOffset = $pos.start(1);
  const contentSize = node.content.size;

  return (
    node.rangeHasMark(0, contentSize, schema.marks.table) &&
    $pos.pos - startOffset !== contentSize &&
    $pos.pos !== startOffset
  );
}

function createSelection(tr: Transaction, posInfo: IndentSelectionInfo | OutdentSelectionInfo) {
  let { from, to } = posInfo;

  if (posInfo.type === 'indent') {
    const softTabLen = 4;

    from += softTabLen;
    to += (posInfo.lineLen + 1) * softTabLen;
  } else {
    const { spaceLenList } = posInfo;

    from -= spaceLenList[0];
    for (let i = 0; i < spaceLenList.length; i += 1) {
      to -= spaceLenList[i];
    }
  }

  return createTextSelection(tr, from, to);
}

export class Paragraph extends Node {
  context!: MdSpecContext;

  get name() {
    return 'paragraph';
  }

  get schema() {
    return {
      content: 'inline*',
      attrs: {
        className: { default: null },
        codeStart: { default: null },
        codeEnd: { default: null },
      },
      selectable: false,
      group: 'block',
      parseDOM: [{ tag: 'div' }],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        return attrs.className
          ? ['div', { class: clsWithMdPrefix(attrs.className) }, 0]
          : ['div', 0];
      },
    };
  }

  private reorderList(startLine: number, endLine: number) {
    const { view, toastMark, schema } = this.context;
    const { tr, selection, doc } = view.state;

    let mdNode = toastMark.findFirstNodeAtLine(startLine);
    let topListNode = mdNode;

    while (mdNode && !isBulletListNode(mdNode!) && mdNode.parent!.type !== 'document') {
      mdNode = mdNode.parent!;
      if (isOrderedListNode(mdNode!)) {
        topListNode = mdNode;
        break;
      }
    }

    if (topListNode) {
      startLine = topListNode.sourcepos![0][0];
    }

    const [, indent, , start] = reOrderedListGroup.exec(getTextByMdLine(doc, startLine))!;
    const indentLen = indent.length;
    const { line, nodes } = getReorderedListInfo(doc, schema, startLine, Number(start), indentLen);

    endLine = Math.max(endLine, line - 1);

    let { startOffset } = getNodeContentOffsetRange(doc, startLine - 1);

    for (let i = startLine - 1; i <= endLine - 1; i += 1) {
      const { nodeSize, content } = doc.child(i);
      const mappedFrom = tr.mapping.map(startOffset);
      const mappedTo = mappedFrom + content.size;

      tr.replaceWith(mappedFrom, mappedTo, nodes[i - startLine + 1]);

      startOffset += nodeSize;
    }

    const newSelection = createTextSelection(tr, selection.from, selection.to);

    view.dispatch!(tr.setSelection(newSelection));
  }

  private indent(tabKey = false): EditorCommand {
    return () => (state, dispatch) => {
      const { schema, selection, doc } = state;
      const { from, to, startFromOffset, startIndex, endIndex } = getRangeInfo(selection);

      if (tabKey && isInTableCellNode(doc, schema, selection)) {
        return false;
      }

      const startLineText = getTextContent(doc, startIndex);

      if (
        (tabKey && isBlockUnit(from, to, startLineText)) ||
        (!tabKey && reList.test(startLineText))
      ) {
        const tr = replaceTextNode({
          state,
          from: startFromOffset,
          startIndex,
          endIndex,
          createText: (textContent) => `    ${textContent}`,
        });
        const posInfo: IndentSelectionInfo = {
          type: 'indent',
          from,
          to,
          lineLen: endIndex - startIndex,
        };

        dispatch!(tr.setSelection(createSelection(tr, posInfo)));

        if (reOrderedListGroup.test(startLineText)) {
          this.reorderList(startIndex + 1, endIndex + 1);
        }
      } else if (tabKey) {
        dispatch!(state.tr.insert(to, createTextNode(schema, '    ')));
      }

      return true;
    };
  }

  private outdent(tabKey = false): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, doc, schema } = state;
      const { from, to, startFromOffset, startIndex, endIndex } = getRangeInfo(selection);

      if (tabKey && isInTableCellNode(doc, schema, selection)) {
        return false;
      }

      const startLineText = getTextContent(doc, startIndex);

      if (
        (tabKey && isBlockUnit(from, to, startLineText)) ||
        (!tabKey && reList.test(startLineText))
      ) {
        const spaceLenList: number[] = [];
        const tr = replaceTextNode({
          state,
          from: startFromOffset,
          startIndex,
          endIndex,
          createText: (textContent) => {
            const searchResult = reStartSpace.exec(textContent);

            spaceLenList.push(searchResult ? searchResult[1].length : 0);

            return textContent.replace(reStartSpace, '$2');
          },
        });

        const posInfo: OutdentSelectionInfo = { type: 'outdent', from, to, spaceLenList };

        dispatch!(tr.setSelection(createSelection(tr, posInfo)));

        if (reOrderedListGroup.test(startLineText)) {
          this.reorderList(startIndex + 1, endIndex + 1);
        }
      } else if (tabKey) {
        const startText = startLineText.slice(0, to - startFromOffset);
        const startTextWithoutSpace = startText.replace(/\s{1,4}$/, '');
        const deletStart = to - (startText.length - startTextWithoutSpace.length);

        dispatch!(state.tr.delete(deletStart, to));
      }

      return true;
    };
  }

  private deleteLines(): Command {
    return (state, dispatch) => {
      const { view } = this.context;
      const { startFromOffset, endToOffset } = getRangeInfo(state.selection);

      const deleteRange: Command = () => {
        dispatch!(state.tr.deleteRange(startFromOffset, endToOffset));

        return true;
      };

      return chainCommands(deleteRange, joinForward)(state, dispatch, view);
    };
  }

  private moveDown(): Command {
    return (state, dispatch) => {
      const { doc, tr, selection, schema } = state;
      const { startFromOffset, endToOffset, endIndex } = getRangeInfo(selection);

      if (endIndex < doc.content.childCount - 1) {
        const { nodeSize, textContent } = doc.child(endIndex + 1);

        tr.delete(endToOffset, endToOffset + nodeSize)
          .split(startFromOffset)
          // subtract 2(start, end tag length) to insert prev line
          .insert(tr.mapping.map(startFromOffset) - 2, createTextNode(schema, textContent));

        dispatch!(tr);
        return true;
      }
      return false;
    };
  }

  private moveUp(): Command {
    return (state, dispatch) => {
      const { tr, doc, selection, schema } = state;
      const { startFromOffset, endToOffset, startIndex } = getRangeInfo(selection);

      if (startIndex > 0) {
        const { nodeSize, textContent } = doc.child(startIndex - 1);

        tr.delete(startFromOffset - nodeSize, startFromOffset)
          .split(tr.mapping.map(endToOffset))
          .insert(tr.mapping.map(endToOffset), createTextNode(schema, textContent));

        dispatch!(tr);

        return true;
      }
      return false;
    };
  }

  commands() {
    return {
      indent: this.indent(),
      outdent: this.outdent(),
    };
  }

  keymaps() {
    return {
      Tab: this.indent(true)(),
      'Shift-Tab': this.outdent(true)(),
      'Mod-d': this.deleteLines(),
      'Mod-D': this.deleteLines(),
      'Alt-ArrowUp': this.moveUp(),
      'Alt-ArrowDown': this.moveDown(),
    };
  }
}
