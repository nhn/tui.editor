import { Node, Mark } from 'prosemirror-model';

import { WwNodeType, WwMarkType } from '@t/wysiwyg';
import { ToMdNodeConvertorMap, ToMdMarkConvertorMap, FirstDelimFn } from '@t/convertor';

export default class ToMdConvertorState {
  private readonly nodes: ToMdNodeConvertorMap;

  private readonly marks: ToMdMarkConvertorMap;

  private delim: string;

  private result: string;

  private closed: boolean | Node;

  private tightList: boolean;

  constructor(nodes: ToMdNodeConvertorMap, marks: ToMdMarkConvertorMap) {
    this.nodes = nodes;
    this.marks = marks;
    this.delim = '';
    this.result = '';
    this.closed = false;
    this.tightList = false;
  }

  private isInBlank() {
    return /(^|\n)$/.test(this.result);
  }

  private markText(mark: Mark, open: boolean, parent: Node, index: number) {
    const info = this.marks[mark.type.name as WwMarkType];

    if (info) {
      const value = open ? info.open : info.close;

      return typeof value === 'string' ? value : value(this, mark, parent, index);
    }

    return '';
  }

  flushClose(size?: number) {
    if (this.closed) {
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
    const old = this.delim;

    this.write(firstDelim || delim);
    this.delim += delim;
    fn();
    this.delim = old;
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

  text(text: string, escape?: boolean) {
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      const startOfLine = this.isInBlank() || !!this.closed;

      this.write();
      this.result += escape !== false ? this.escape(lines[i], startOfLine) : lines[i];

      if (i !== lines.length - 1) {
        this.result += '\n';
      }
    }
  }

  convertBlock(node: Node, parent: Node, index: number) {
    const nodeType = this.nodes[node.type.name as WwNodeType];

    if (nodeType) {
      nodeType(this, node, parent, index);
    }
  }

  convertInline(parent: Node) {
    const active: Mark[] = [];
    let trailing = '';

    const progress = (node: Node | null, _: number | null, index: number) => {
      let marks = node ? node.marks : [];

      // Remove marks from `hard_break` that are the last node inside
      // that mark to prevent parser edge cases with new lines just
      // before closing marks.
      // (FIXME it'd be nice if we had a schema-agnostic way to
      // identify nodes that serialize as hard breaks)
      if (node && node.type.name === 'hardBreak')
        marks = marks.filter((mark: Mark) => {
          if (index + 1 === parent.childCount) {
            return false;
          }

          const next = parent.child(index + 1);

          return mark.isInSet(next.marks) && (!next.isText || /\S/.test(next.text || ''));
        });

      let leading = trailing;

      trailing = '';

      // If whitespace has to be expelled from the node, adjust
      // leading and trailing accordingly.
      const removedWhitespace =
        node &&
        node.isText &&
        marks.some((mark: Mark) => {
          const info = this.marks[mark.type.name as WwMarkType];

          return info && info.removedEnclosingWhitespace;
        });

      if (removedWhitespace && node && node.text) {
        const [, lead, inner, trail] = /^(\s*)(.*?)(\s*)$/m.exec(node.text)!;

        leading += lead;
        trailing = trail;

        if (lead || trail) {
          // @ts-ignore
          // type is not defined for "withText" in prosemirror-model
          node = inner ? node.withText(inner) : null;

          if (!node) {
            marks = active;
          }
        }
      }

      const inner = marks.length && marks[marks.length - 1];
      const markType = inner && this.marks[inner.type.name as WwMarkType];
      const noEsc = markType && markType.escape === false;
      const len = marks.length - (noEsc ? 1 : 0);

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
        if (noEsc && node.isText) {
          this.text(
            this.markText(inner as Mark, true, parent, index) +
              node.text +
              this.markText(inner as Mark, false, parent, index + 1),
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

  convertNode(parent: Node) {
    parent.forEach((node, _, index) => this.convertBlock(node, parent, index));

    return this.result;
  }

  escape(text: string, startOfLine?: boolean) {
    text = text.replace(/[`*\\~[\]]/g, '\\$&');

    if (startOfLine) {
      return text.replace(/^[:#\-*+]/, '\\$&').replace(/^(\d+)\./, '$1\\.');
    }

    return text;
  }

  quote(text: string) {
    let wrap;

    if (text.indexOf('"') === -1) {
      wrap = '""';
    } else {
      wrap = text.indexOf("'") === -1 ? "''" : '()';
    }

    return wrap[0] + text + wrap[1];
  }

  repeat(text: string, count: number) {
    let result = '';

    for (let i = 0; i < count; i += 1) {
      result += text;
    }

    return result;
  }

  getEnclosingWhitespace(text: string) {
    return {
      leading: (text.match(/^(\s+)/) || [])[0],
      trailing: (text.match(/(\s+)$/) || [])[0]
    };
  }
}
