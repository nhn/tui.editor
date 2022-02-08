import { source } from 'common-tags';
import Editor from '@toast-ui/editor';
import mergedTableCellPlugin from '@/index';

describe('markdown merged table plugin', () => {
  let container: HTMLElement, editor: Editor;

  function removeDataAttr(html: string) {
    return html
      .replace(/\sdata-nodeid="\d{1,}"/g, '')
      .replace(/\sclass="toastui-editor-md-preview-highlight"/g, '')
      .trim();
  }

  function assertMdPreviewHTML(html: string) {
    const mdPreviewContentEl = editor.getEditorElements().mdPreview.firstChild as HTMLElement;

    expect(removeDataAttr(mdPreviewContentEl.innerHTML)).toContain(html);
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    editor = new Editor({
      el: container,
      previewStyle: 'vertical',
      plugins: [mergedTableCellPlugin],
    });
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should render basic table properly', () => {
    const content = source`
      | head1 | head2 |
      | --- | --- |
      | cell1 | cell2 |
    `;
    const result = source`
      <table>
      <thead>
      <tr>
      <th>head1</th>
      <th>head2</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td>cell1</td>
      <td>cell2</td>
      </tr>
      </tbody>
      </table>
    `;

    editor.setMarkdown(content);

    assertMdPreviewHTML(result);
  });

  it('should render merged cell with colspan header properly', () => {
    const content = source`
      | @cols=2:mergedHead1 | @cols=2:mergedHead2 |
      | --- | --- | --- | --- |
      | cell1 | cell2 | cell3 | cell4 |
    `;
    const result = source`
      <table>
      <thead>
      <tr>
      <th colspan="2">mergedHead1</th>
      <th colspan="2">mergedHead2</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td>cell1</td>
      <td>cell2</td>
      <td>cell3</td>
      <td>cell4</td>
      </tr>
      </tbody>
      </table>
    `;

    editor.setMarkdown(content);

    assertMdPreviewHTML(result);
  });

  it('should render merged cell with colspan header, body properly', () => {
    const content = source`
      | @cols=2:mergedHead1 | @cols=2:mergedHead2 |
      | --- | --- | --- | --- |
      | @cols=2:mergedCell1 | cell2 | cell3 |
    `;
    const result = source`
      <table>
      <thead>
      <tr>
      <th colspan="2">mergedHead1</th>
      <th colspan="2">mergedHead2</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td colspan="2">mergedCell1</td>
      <td>cell2</td>
      <td>cell3</td>
      </tr>
      </tbody>
      </table>
    `;

    editor.setMarkdown(content);

    assertMdPreviewHTML(result);
  });

  it('should render merged cell with rowspan body properly', () => {
    const content = source`
      | head1 | head2 |
      | --- | --- |
      | cell1-1 | @rows=2:cell1-2  |
      | cell2-1 | cell2-2  |
    `;
    const result = source`
      <table>
      <thead>
      <tr>
      <th>head1</th>
      <th>head2</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td>cell1-1</td>
      <td rowspan="2">cell1-2</td>
      </tr>
      <tr>
      <td>cell2-1</td>
      </tr>
      </tbody>
      </table>
    `;

    editor.setMarkdown(content);

    assertMdPreviewHTML(result);
  });

  describe('should render merged cell with rowspan, colspan properly', () => {
    const examples = [
      {
        no: 1,
        content: source`
        | @cols=2:mergedHead1 | @cols=2:mergedHead2 |
        | --- | --- | --- | --- |
        | @cols=2:mergedCell1-1 | cell1-2 | cell1-3 |
        | @rows=3:mergedCell2-1 | cell2-2 | cell2-3 | cell2-4 |
        | cell3-1 | cell3-2 | cell3-3 | cell3-4 |
        | cell4-1 | cell4-2 | cell4-3 | cell4-4 |
        | cell5-1 | cell5-2 | cell5-3 | cell5-4 |
      `,
        result: source`
        <table>
        <thead>
        <tr>
        <th colspan="2">mergedHead1</th>
        <th colspan="2">mergedHead2</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td colspan="2">mergedCell1-1</td>
        <td>cell1-2</td>
        <td>cell1-3</td>
        </tr>
        <tr>
        <td rowspan="3">mergedCell2-1</td>
        <td>cell2-2</td>
        <td>cell2-3</td>
        <td>cell2-4</td>
        </tr>
        <tr>
        <td>cell3-1</td>
        <td>cell3-2</td>
        <td>cell3-3</td>
        </tr>
        <tr>
        <td>cell4-1</td>
        <td>cell4-2</td>
        <td>cell4-3</td>
        </tr>
        <tr>
        <td>cell5-1</td>
        <td>cell5-2</td>
        <td>cell5-3</td>
        <td>cell5-4</td>
        </tr>
        </tbody>
        </table>
      `,
      },
      {
        no: 2,
        content: source`
        | @cols=2:mergedHead1 | @cols=2:mergedHead2 |
        | --- | --- | --- | --- |
        | @cols=2:mergedCell1-1 | cell1-2 | cell1-3 |
        | @rows=2:mergedCell2-1 | cell2-2 | cell2-3 | cell2-4 |
        | cell3-1 | cell3-2 | cell3-3 | cell3-4 |
        | @cols=3:@rows=2:cell4-1 | cell4-2 | cell4-3 | cell4-4 |
        | cell5-1 | cell5-2 | cell5-3 | cell5-4 |
      `,
        result: source`
        <table>
        <thead>
        <tr>
        <th colspan="2">mergedHead1</th>
        <th colspan="2">mergedHead2</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td colspan="2">mergedCell1-1</td>
        <td>cell1-2</td>
        <td>cell1-3</td>
        </tr>
        <tr>
        <td rowspan="2">mergedCell2-1</td>
        <td>cell2-2</td>
        <td>cell2-3</td>
        <td>cell2-4</td>
        </tr>
        <tr>
        <td>cell3-1</td>
        <td>cell3-2</td>
        <td>cell3-3</td>
        </tr>
        <tr>
        <td rowspan="2" colspan="3">cell4-1</td>
        <td>cell4-2</td>
        </tr>
        <tr>
        <td>cell5-1</td>
        </tr>
        </tbody>
        </table>
      `,
      },
      {
        no: 3,
        content: source`
        | @cols=2:mergedHead1 | @cols=2:mergedHead2 |
        | --- | --- | --- | --- |
        | @cols=2:mergedCell1-1 | cell1-2 | cell1-3 |
        | @rows=2:mergedCell2-1 | cell2-2 | cell2-3 | cell2-4 |
        | cell3-1 | cell3-2 | cell3-3 | cell3-4 |
        | @cols=3:@rows=2:cell4-1 | cell4-2 | cell4-3 | cell4-4 |
        | @rows=2:cell5-1 | cell5-2 | cell5-3 | cell5-4 |
        | cell6-1 | cell6-2 | cell6-3 | cell6-4 |
      `,
        result: source`
        <table>
        <thead>
        <tr>
        <th colspan="2">mergedHead1</th>
        <th colspan="2">mergedHead2</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td colspan="2">mergedCell1-1</td>
        <td>cell1-2</td>
        <td>cell1-3</td>
        </tr>
        <tr>
        <td rowspan="2">mergedCell2-1</td>
        <td>cell2-2</td>
        <td>cell2-3</td>
        <td>cell2-4</td>
        </tr>
        <tr>
        <td>cell3-1</td>
        <td>cell3-2</td>
        <td>cell3-3</td>
        </tr>
        <tr>
        <td rowspan="2" colspan="3">cell4-1</td>
        <td>cell4-2</td>
        </tr>
        <tr>
        <td rowspan="2">cell5-1</td>
        </tr>
        <tr>
        <td>cell6-1</td>
        <td>cell6-2</td>
        <td>cell6-3</td>
        </tr>
        </tbody>
        </table>
      `,
      },
      {
        no: 4,
        content: source`
        | @cols=2:mergedHead1 | @cols=5:mergedHead2 |
        | --- | --- | --- | --- | --- | --- | --- |
        | @cols=2:mergedCell1-1 | cell1-2 | cell1-3 | cell1-4 | cell1-5 | cell1-6 |
        | @rows=2:mergedCell2-1 | @rows=2:mergedCell2-2 | cell2-3 | cell2-4 | cell2-5 | cell2-6 |
        | cell3-1 | cell3-2 | cell3-3 | cell3-4 | cell3-5 | cell3-6 |
        | @cols=3:@rows=2:mergedCell4-1 | cell4-2 | cell4-3 | cell4-4 |
        | @rows=2:mergedCell5-1 | cell5-2 | cell5-3 | cell5-4 | cell5-5 |
        | cell6-1 | cell6-2 | cell6-3 | cell6-4 | cell6-5 |
      `,
        result: source`
        <table>
        <thead>
        <tr>
        <th colspan="2">mergedHead1</th>
        <th colspan="5">mergedHead2</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td colspan="2">mergedCell1-1</td>
        <td>cell1-2</td>
        <td>cell1-3</td>
        <td>cell1-4</td>
        <td>cell1-5</td>
        <td>cell1-6</td>
        </tr>
        <tr>
        <td rowspan="2">mergedCell2-1</td>
        <td rowspan="2">mergedCell2-2</td>
        <td>cell2-3</td>
        <td>cell2-4</td>
        <td>cell2-5</td>
        <td>cell2-6</td>
        <td></td>
        </tr>
        <tr>
        <td>cell3-1</td>
        <td>cell3-2</td>
        <td>cell3-3</td>
        <td>cell3-4</td>
        <td>cell3-5</td>
        </tr>
        <tr>
        <td rowspan="2" colspan="3">mergedCell4-1</td>
        <td>cell4-2</td>
        <td>cell4-3</td>
        <td>cell4-4</td>
        <td></td>
        </tr>
        <tr>
        <td rowspan="2">mergedCell5-1</td>
        <td>cell5-2</td>
        <td>cell5-3</td>
        <td>cell5-4</td>
        </tr>
        <tr>
        <td>cell6-1</td>
        <td>cell6-2</td>
        <td>cell6-3</td>
        <td>cell6-4</td>
        <td>cell6-5</td>
        <td></td>
        </tr>
        </tbody>
        </table>
      `,
      },
      {
        no: 5,
        content: source`
        | @cols=2:mergedHead1 | @cols=5:mergedHead2 |
        | --- | --- | --- | --- | --- | --- | --- |
        | @cols=2:mergedCell1-1 | cell1-2 | @cols=2:@rows=5:mergedCell1-3 | cell1-4 | cell1-5 | cell1-6 |
        | @rows=2:mergedCell2-1 | @rows=2:mergedCell2-2 | cell2-3 | cell2-4 | cell2-5 | cell2-6 |
        | cell3-1 | cell3-2 |
        | @cols=3:@rows=2:mergedCell4-1 | cell4-2 |
        | cell5-1 | cell5-2 |
      `,
        result: source`
        <table>
        <thead>
        <tr>
        <th colspan="2">mergedHead1</th>
        <th colspan="5">mergedHead2</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td colspan="2">mergedCell1-1</td>
        <td>cell1-2</td>
        <td rowspan="5" colspan="2">mergedCell1-3</td>
        <td>cell1-4</td>
        <td>cell1-5</td>
        </tr>
        <tr>
        <td rowspan="2">mergedCell2-1</td>
        <td rowspan="2">mergedCell2-2</td>
        <td>cell2-3</td>
        <td>cell2-4</td>
        <td>cell2-5</td>
        </tr>
        <tr>
        <td>cell3-1</td>
        <td>cell3-2</td>
        <td></td>
        </tr>
        <tr>
        <td rowspan="2" colspan="3">mergedCell4-1</td>
        <td>cell4-2</td>
        <td></td>
        </tr>
        <tr>
        <td>cell5-1</td>
        <td>cell5-2</td>
        </tr>
        </tbody>
        </table>
      `,
      },
      {
        no: 6,
        content: source`
        | @cols=2:mergedHead1 | @cols=3:mergedHead2 |
        | --- | --- | --- | --- | --- |
        | @cols=2:mergedCell1-1 | cell1-2 | @cols=2:@rows=5:mergedCell1-3 |
        | @rows=2:mergedCell2-1 | @rows=2:mergedCell2-2 | cell2-3 | cell2-4 | cell2-5 | cell2-6 |
        | cell3-1 |
        | cell4-1 | cell4-2 |
        | cell5-1 | cell5-2 | cell5-3 | cell5-4 |
      `,
        result: source`
        <table>
        <thead>
        <tr>
        <th colspan="2">mergedHead1</th>
        <th colspan="3">mergedHead2</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td colspan="2">mergedCell1-1</td>
        <td>cell1-2</td>
        <td rowspan="5" colspan="2">mergedCell1-3</td>
        </tr>
        <tr>
        <td rowspan="2">mergedCell2-1</td>
        <td rowspan="2">mergedCell2-2</td>
        <td>cell2-3</td>
        </tr>
        <tr>
        <td>cell3-1</td>
        </tr>
        <tr>
        <td>cell4-1</td>
        <td>cell4-2</td>
        <td></td>
        </tr>
        <tr>
        <td>cell5-1</td>
        <td>cell5-2</td>
        <td>cell5-3</td>
        </tr>
        </tbody>
        </table>
      `,
      },
      {
        no: 7,
        content: source`
        | @cols=2:mergedHead1 | @cols=3:mergedHead2 |
        | --- | --- | --- | --- | --- |
        | @cols=2:mergedCell1-1 | @rows=3:mergedCell1-2 | @cols=2:@rows=5:mergedCell1-3 |
        | @rows=2:mergedCell2-1 | @rows=2:mergedCell2-2 |
        |
        | cell4-1 | cell4-2 |  |
        | cell5-1 | cell5-2 | cell5-3 |
      `,
        result: source`
        <table>
        <thead>
        <tr>
        <th colspan="2">mergedHead1</th>
        <th colspan="3">mergedHead2</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td colspan="2">mergedCell1-1</td>
        <td rowspan="3">mergedCell1-2</td>
        <td rowspan="5" colspan="2">mergedCell1-3</td>
        </tr>
        <tr>
        <td rowspan="2">mergedCell2-1</td>
        <td rowspan="2">mergedCell2-2</td>
        </tr>
        <tr></tr>
        <tr>
        <td>cell4-1</td>
        <td>cell4-2</td>
        <td></td>
        </tr>
        <tr>
        <td>cell5-1</td>
        <td>cell5-2</td>
        <td>cell5-3</td>
        </tr>
        </tbody>
        </table>
      `,
      },
      {
        no: 8,
        content: source`
        | @cols=2:foo"bar" | @cols=2:<span style="color: red;">baz</span> |
        | --- | --- | --- | --- |
        | @cols=2:foo"bar" | cell1-2 | cell1-3 |
        | @rows=2:<span style="color: red;">baz</span> | cell2-2 | cell2-3 | cell2-4 |
        | cell3-1 | cell3-2 | cell3-3 | cell3-4 |
        | @cols=3:@rows=2:foo"bar"<span style="color: red;">baz</span> | cell4-2 | cell4-3 | cell4-4 |
        | cell5-1 | cell5-2 | cell5-3 | cell5-4 |
      `,
        result: source`
        <table>
        <thead>
        <tr>
        <th colspan="2">foo"bar"</th>
        <th colspan="2"><span style="color: red;">baz</span></th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td colspan="2">foo"bar"</td>
        <td>cell1-2</td>
        <td>cell1-3</td>
        </tr>
        <tr>
        <td rowspan="2"><span style="color: red;">baz</span></td>
        <td>cell2-2</td>
        <td>cell2-3</td>
        <td>cell2-4</td>
        </tr>
        <tr>
        <td>cell3-1</td>
        <td>cell3-2</td>
        <td>cell3-3</td>
        </tr>
        <tr>
        <td rowspan="2" colspan="3">foo"bar"<span style="color: red;">baz</span></td>
        <td>cell4-2</td>
        </tr>
        <tr>
        <td>cell5-1</td>
        </tr>
        </tbody>
        </table>
      `,
      },
    ];

    examples.forEach(({ no, content, result }) => {
      it(` - example${no}`, () => {
        editor.setMarkdown(content);

        assertMdPreviewHTML(result);
      });
    });
  });
});
