/**
 * @fileoverview test wysiwyg table align column command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import AlignCol from '@/wysiwygCommands/tableAlignCol';
import WwTableSelectionManager from '@/wwTableSelectionManager';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Table - AlignCol', () => {
  let container, wwe;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();
    wwe.componentManager.addManager(WwTableSelectionManager);
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  describe('set align center to current column', () => {
    it('at TD', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td class="te-cell-selected">3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
      range.collapse(true);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'center');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
    });

    it('at TH', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th class="te-cell-selected">1</th><th>2</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('thead th')[0].firstChild);
      range.collapse(true);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'center');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
    });

    it('on multi cell selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th><th class="te-cell-selected">3</th><th>4</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td>4</td><td>3</td><td>4</td></tr>',
          '<tr><td>3</td><td>4</td><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[2].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'center');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(2)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(2)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();
    });

    it('on multi cell selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th><th>3</th><th>4</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td class="te-cell-selected">4</td><td class="te-cell-selected">3</td><td>4</td></tr>',
          '<tr><td>3</td><td>4</td><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[1].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[2].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'center');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(2)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(2)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();
    });

    it('on multi line selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th><th>3</th><th>4</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td>4</td><td>3</td><td class="te-cell-selected">4</td></tr>',
          '<tr><td class="te-cell-selected">3</td><td>4</td><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[3].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[4].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'center');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(2)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(3)
          .attr('align')
      ).toEqual('center');

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('center');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(2)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(3)
          .attr('align')
      ).toEqual('center');
    });
  });

  describe('set align left to current column', () => {
    it('at TD', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td class="te-cell-selected">3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
      range.collapse(true);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'left');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
    });

    it('at TH', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th class="te-cell-selected">1</th><th>2</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('thead th')[0].firstChild);
      range.collapse(true);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'left');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
    });

    it('on multiline selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th class="te-cell-selected">1</th><th>2</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td class="te-cell-selected">4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('thead th')[0].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[1].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'left');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).toEqual('left');

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).toEqual('left');
    });

    it('on multi cell selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th><th>3</th><th>4</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td class="te-cell-selected">3</td><td class="te-cell-selected">4</td><td class="te-cell-selected">3</td><td>4</td></tr>',
          '<tr><td>3</td><td>4</td><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[2].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'left');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(2)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(2)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();
    });

    it('on multi cell selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th><th>3</th><th>4</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td class="te-cell-selected">4</td><td class="te-cell-selected">3</td><td>4</td></tr>',
          '<tr><td>3</td><td>4</td><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[1].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[2].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'left');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(2)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(2)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();
    });

    it('on multi line selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th><th>3</th><th>4</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td>4</td><td>3</td><td class="te-cell-selected">4</td></tr>',
          '<tr><td class="te-cell-selected">3</td><td>4</td><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[3].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[4].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'left');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(2)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(3)
          .attr('align')
      ).toEqual('left');

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('left');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(2)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(3)
          .attr('align')
      ).toEqual('left');
    });
  });

  describe('set align right to current column', () => {
    it('at TD', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td class="te-cell-selected">3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
      range.collapse(true);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'right');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
    });

    it('at TH', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th class="te-cell-selected">1</th><th>2</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('thead th')[0].firstChild);
      range.collapse(true);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'right');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
    });

    it('on multi cell selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th><th>3</th><th>4</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td class="te-cell-selected">3</td><td class="te-cell-selected">4</td><td class="te-cell-selected">3</td><td>4</td></tr>',
          '<tr><td>3</td><td>4</td><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[2].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'right');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(2)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(2)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();
    });

    it('on multi cell selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th><th>3</th><th>4</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td class="te-cell-selected">4</td><td class="te-cell-selected">3</td><td>4</td></tr>',
          '<tr><td>3</td><td>4</td><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[1].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[2].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'right');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(2)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(2)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(3)
          .attr('align')
      ).not.toBeDefined();
    });

    it('on multi line selection', () => {
      const sq = wwe.getEditor(),
        range = sq.getSelection().cloneRange();

      sq.setHTML(
        [
          '<table>',
          '<thead>',
          '<tr><th>1</th><th>2</th><th>3</th><th>4</th></tr>',
          '</thead>',
          '<tbody>',
          '<tr><td>3</td><td>4</td><td>3</td><td class="te-cell-selected">4</td></tr>',
          '<tr><td class="te-cell-selected">3</td><td>4</td><td>3</td><td>4</td></tr>',
          '</tbody>',
          '</table>'
        ].join('\n')
      );

      range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[3].firstChild);
      range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[4].firstChild);

      sq.setSelection(range);
      sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

      AlignCol.exec(wwe, 'right');

      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(0)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(2)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('thead th')
          .eq(3)
          .attr('align')
      ).toEqual('right');

      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(0)
          .attr('align')
      ).toEqual('right');
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(1)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(2)
          .attr('align')
      ).not.toBeDefined();
      expect(
        $(wwe.getBody())
          .find('tbody td')
          .eq(3)
          .attr('align')
      ).toEqual('right');
    });
  });
});
