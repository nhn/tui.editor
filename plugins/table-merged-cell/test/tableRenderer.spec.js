/**
 * @fileoverview Test table renderer function
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import { source } from 'common-tags';

import tableDataHandler from '@/tableDataHandler';
import tableRenderer from '@/tableRenderer';

function createElement(html) {
  const container = document.createElement('div');

  container.innerHTML = html;

  return container;
}

describe('tableRenderer', () => {
  describe('createTableHtml()', () => {
    it('when correct contents in table tag', () => {
      const tableHtml = [
        '<table>',
        '<thead>',
        '<tr><th>foo</th></tr>',
        '</thead>',
        '<tbody>',
        '<tr><td>bar</td></tr>',
        '</tbody>',
        '</table>'
      ].join('');
      const $table = $(tableHtml);
      const renderData = tableDataHandler.createTableData($table.get(0));
      const result = tableRenderer.createTableHtml(renderData);

      expect(result.toLowerCase()).toBe(tableHtml);
    });

    it('when wrong contents in table tag, returns only table tag', () => {
      const tableHtml = ['<table>', '<!-- header>', '</table>'].join('');
      const $table = $(tableHtml);
      const renderData = tableDataHandler.createTableData($table.get(0));
      const result = tableRenderer.createTableHtml(renderData);

      expect(result).toBe('<table></table>');
    });

    it('if the html entities (", <, >) are included in the cell data, the table is created correctly', () => {
      const tableHtml = source`
        <table>
        <thead>
        <tr><th colspan="2">foo"bar"</th></tr>
        </thead>
        <tbody>
        <tr><td colspan="2"><span style="color: red;">baz</span></td></tr>
        </tbody>
        </table>
      `;
      const renderData = tableDataHandler.createTableData(createElement(tableHtml));
      const result = tableRenderer.createTableHtml(renderData);
      const tableElement = createElement(result);

      expect(tableElement.querySelector('th').getAttribute('data-org-content')).toBe(
        '@cols=2:foo"bar"'
      );
      expect(tableElement.querySelector('td').getAttribute('data-org-content')).toBe(
        '@cols=2:<span style="color: red;">baz</span>'
      );
    });
  });
});
