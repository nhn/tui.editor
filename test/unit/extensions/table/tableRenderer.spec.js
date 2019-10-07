/**
 * @fileoverview test table renderer function
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import tableDataHandler from '@/extensions/table/tableDataHandler';
import tableRenderer from '@/extensions/table/tableRenderer';

describe('tableRenderer', () => {
  describe('createTableHtml()', () => {
    it('when correct contents in table tag.', () => {
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
      const renderData = tableDataHandler.createTableData($table);
      const result = tableRenderer.createTableHtml(renderData);

      expect(result.toLowerCase()).toBe(tableHtml);
    });

    it('when wrong contents in table tag, returns only table tag.', () => {
      const tableHtml = [
        '<table>',
        '<!-- header>',
        '</table>'
      ].join('');
      const $table = $(tableHtml);
      const renderData = tableDataHandler.createTableData($table);
      const result = tableRenderer.createTableHtml(renderData);

      expect(result).toBe('<table></table>');
    });
  });
});
