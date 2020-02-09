import { HtmlRenderer, AttrPairs } from '../html';
import { Node, ListNode, TableNode, TableCellNode } from '../../node';
import { taskListItemRender } from '../../gfm/taskListItem';

export class GfmHtmlRenderer extends HtmlRenderer {
  item(node: ListNode, entering: boolean) {
    const attrs = this.attrs(node);
    if (entering) {
      this.tag('li', attrs);
      taskListItemRender(this, node);
    } else {
      this.tag('/li');
      this.cr();
    }
  }

  strike(_: Node, entering: boolean) {
    this.tag(entering ? 'del' : '/del');
  }

  table(_: Node, entering: boolean) {
    this.cr();
    this.tag(`${entering ? '' : '/'}table`);
    this.cr();
  }

  tableHead(_: Node, entering: boolean) {
    this.tag(`${entering ? '' : '/'}thead`);
    this.cr();
  }

  tableBody(_: Node, entering: boolean) {
    this.tag(`${entering ? '' : '/'}tbody`);
    this.cr();
  }

  tableRow(node: Node, entering: boolean) {
    if (entering) {
      this.tag('tr');
    } else {
      const table = node.parent!.parent as TableNode;
      const lastCell = node.lastChild as TableCellNode;
      for (let i = lastCell.columnIdx + 1; i < table.columns.length; i += 1) {
        this.tag('td');
        this.tag('/td');
        this.cr();
      }
      this.tag('/tr');
    }
    this.cr();
  }

  tableCell(node: TableCellNode, entering: boolean) {
    if (node.ignored) {
      return;
    }
    const tablePart = node.parent!.parent!;
    const tagName = tablePart.type === 'tableHead' ? 'th' : 'td';
    const table = tablePart.parent as TableNode;
    const attrs: AttrPairs = [];
    const { align } = table.columns[node.columnIdx];
    if (align !== 'left') {
      attrs.push(['align', align]);
    }

    if (entering) {
      this.tag(tagName, attrs);
    } else {
      this.tag(`/${tagName}`);
      this.cr();
    }
  }
}
