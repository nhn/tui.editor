import { Node, Mark } from 'prosemirror-model';

import { includes, escape, last } from '@/utils/common';

import { WwNodeType, WwMarkType } from '@t/wysiwyg';
import {
  ToMdConvertors,
  ToMdNodeTypeConvertorMap,
  ToMdMarkTypeConvertorMap,
  FirstDelimFn,
  InfoForPosSync,
} from '@t/convertor';

export default class ToMdConvertorState {
  private readonly nodeTypeConvertors: ToMdNodeTypeConvertorMap;

  private readonly markTypeConvertors: ToMdMarkTypeConvertorMap;

  private delim: string;

  private result: string;

  private closed: boolean | Node;

  private tightList: boolean;

  public stopNewline: boolean;

  public inTable: boolean;

  constructor({ nodeTypeConvertors, markTypeConvertors }: ToMdConvertors) {
    this.nodeTypeConvertors = nodeTypeConvertors;
    this.markTypeConvertors = markTypeConvertors;
    this.delim = '';
    this.result = '';
    this.closed = false;
    this.tightList = false;
    this.stopNewline = false;
    this.inTable = false;
  }

  private getMarkConvertor(mark: Mark) {
    const type = mark.attrs.htmlInline ? 'html' : (mark.type.name as WwMarkType);

    return this.markTypeConvertors[type];
  }

  private isInBlank() {
    return /(^|\n)$/.test(this.result);
  }

  private markText(mark: Mark, entering: boolean, parent: Node, index: number) {
    const convertor = this.getMarkConvertor(mark);

    if (convertor) {
      const { delim, rawHTML } = convertor({ node: mark, parent, index }, entering);

      return (rawHTML as string) || (delim as string);
    }

    return '';
  }

  setDelim(delim: string) {
    this.delim = delim;
  }

  getDelim() {
    return this.delim;
  }

  flushClose(size?: number) {
    if (!this.stopNewline && this.closed) {
      if (!this.isInBlank()) {
        this.result += '\n';
      }

      if (!size) {
        size = 2;
      }

      if (size > 1) {
        let delimMin = this.delim;
        const trim = /\s+$/.exec(delimMin);

        if (trim) {
          delimMin = delimMin.slice(0, delimMin.length - trim[0].length);
        }

        for (let i = 1; i < size; i += 1) {
          this.result += `${delimMin}\n`;
        }
      }

      this.closed = false;
    }
  }

  wrapBlock(delim: string, firstDelim: string | null, node: Node, fn: () => void) {
    const old = this.getDelim();

    this.write(firstDelim || delim);
    this.setDelim(this.getDelim() + delim);
    fn();
    this.setDelim(old);
    this.closeBlock(node);
  }

  ensureNewLine() {
    if (!this.isInBlank()) {
      this.result += '\n';
    }
  }

  write(content = '') {
    this.flushClose();

    if (this.delim && this.isInBlank()) {
      this.result += this.delim;
    }

    if (content) {
      this.result += content;
    }
  }

  closeBlock(node: Node) {
    this.closed = node;
  }

  text(text: string, escaped = true) {
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      this.write();
      this.result += escaped ? escape(lines[i]) : lines[i];

      if (i !== lines.length - 1) {
        this.result += '\n';
      }
    }
  }

  convertBlock(node: Node, parent: Node, index: number) {
    const type = node.type.name as WwNodeType;
    const convertor = this.nodeTypeConvertors[type];
    const nodeInfo = { node, parent, index };

    if (node.attrs.htmlBlock) {
      this.nodeTypeConvertors.html!(this, nodeInfo);
    } else if (convertor) {
      convertor(this, nodeInfo);
    }
  }

  convertInline(parent: Node) {
    const active: Mark[] = [];
    let trailing = '';

    const progress = (node: Node | null, _: number | null, index: number) => {
      let marks = node ? (node.marks as Mark[]) : [];
      let leading = trailing;

      trailing = '';

      // If whitespace has to be expelled from the node, adjust
      // leading and trailing accordingly.
      const removedWhitespace =
        node &&
        node.isText &&
        marks.some((mark: Mark) => {
          const markConvertor = this.getMarkConvertor(mark);
          const info = markConvertor && markConvertor();

          return info && info.removedEnclosingWhitespace;
        });

      if (removedWhitespace && node && node.text) {
        const [, lead, mark, trail] = /^(\s*)(.*?)(\s*)$/m.exec(node.text)!;

        leading += lead;
        trailing = trail;

        if (lead || trail) {
          // @ts-ignore
          // type is not defined for "withText" in prosemirror-model
          node = mark ? node.withText(mark) : null;

          if (!node) {
            marks = active;
          }
        }
      }

      const lastMark = marks.length && last(marks);
      const markConvertor = lastMark && this.getMarkConvertor(lastMark);
      const markType = markConvertor && markConvertor();

      const noEscape = markType && markType.escape === false;
      const len = marks.length - (noEscape ? 1 : 0);

      // Try to reorder 'mixable' marks, such as em and strong, which
      // in Markdown may be opened and closed in different order, so
      // that order of the marks for the token matches the order in
      // active.
      for (let i = 0; i < len; i += 1) {
        const mark = marks[i];

        if (markType && !markType.mixable) {
          break;
        }

        for (let j = 0; j < active.length; j += 1) {
          const other = active[j];

          if (markType && !markType.mixable) {
            break;
          }

          if (mark.eq(other)) {
            // eslint-disable-next-line max-depth
            if (i > j) {
              marks = marks
                .slice(0, j)
                .concat(mark)
                .concat(marks.slice(j, i))
                .concat(marks.slice(i + 1, len));
            } else if (j > i) {
              marks = marks
                .slice(0, i)
                .concat(marks.slice(i + 1, j))
                .concat(mark)
                .concat(marks.slice(j, len));
            }

            break;
          }
        }
      }

      // Find the prefix of the mark set that didn't change
      let keep = 0;

      while (keep < Math.min(active.length, len) && marks[keep].eq(active[keep])) {
        keep += 1;
      }

      // Close the marks that need to be closed
      while (keep < active.length) {
        const activedMark = active.pop();

        if (activedMark) {
          this.text(this.markText(activedMark, false, parent, index), false);
        }
      }

      // Output any previously expelled trailing whitespace outside the marks
      if (leading) {
        this.text(leading);
      }

      // Open the marks that need to be opened
      if (node) {
        while (active.length < len) {
          const mark = marks[active.length];

          active.push(mark);
          this.text(this.markText(mark, true, parent, index), false);
        }

        // Render the node. Special case code marks, since their content
        // may not be escaped.
        if (noEscape && node.isText) {
          this.text(
            this.markText(lastMark as Mark, true, parent, index) +
              node.text +
              this.markText(lastMark as Mark, false, parent, index + 1),
            false
          );
        } else {
          this.convertBlock(node, parent, index);
        }
      }
    };

    parent.forEach(progress);

    progress(null, null, parent.childCount);
  }

  // Render a node's content as a list. `delim` should be the extra
  // indentation added to all lines except the first in an item,
  // `firstDelimFn` is a function going from an item index to a
  // delimiter for the first line of the item.
  convertList(node: Node, delim: string, firstDelimFn: FirstDelimFn) {
    if (this.closed && (this.closed as Node).type === node.type) {
      this.flushClose(3);
    } else if (this.tightList) {
      this.flushClose(1);
    }

    const tight = node.attrs.tight ?? true;
    const prevTight = this.tightList;

    this.tightList = tight;

    node.forEach((child, _, index) => {
      if (index && tight) {
        this.flushClose(1);
      }

      this.wrapBlock(delim, firstDelimFn(index), node, () => this.convertBlock(child, node, index));
    });

    this.tightList = prevTight;
  }

  convertTableCell(node: Node) {
    this.stopNewline = true;
    this.inTable = true;

    node.forEach((child, _, index) => {
      if (includes(['bulletList', 'orderedList'], child.type.name)) {
        this.convertBlock(child, node, index);
        this.closed = false;
      } else {
        this.convertInline(child);

        if (index < node.childCount - 1) {
          const nextChild = node.child(index + 1);

          if (nextChild.type.name === 'paragraph') {
            this.write('<br>');
          }
        }
      }
    });

    this.stopNewline = false;
    this.inTable = false;
  }

  convertNode(parent: Node, infoForPosSync?: InfoForPosSync | null) {
    parent.forEach((node, _, index) => {
      this.convertBlock(node, parent, index);

      if (infoForPosSync?.node === node) {
        const lineTexts = this.result.split('\n');

        infoForPosSync.setMappedPos([lineTexts.length, last(lineTexts).length + 1]);
      }
    });

    return this.result;
  }
}
