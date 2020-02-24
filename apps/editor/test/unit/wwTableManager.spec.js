/**
 * @fileoverview test wysiwyg table manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import browser from 'tui-code-snippet/browser/browser';

import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwTableManager from '@/wwTableManager';
import WwTableSelectionManager from '@/wwTableSelectionManager';

describe('WwTableManager', () => {
  let container, em, wwe, mgr;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();

    wwe = new WysiwygEditor(container, em);

    wwe.init();

    mgr = new WwTableManager(wwe);
    wwe.componentManager.addManager('tableSelection', WwTableSelectionManager);
    wwe.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  describe('_appendBrIfTdOrThNotHaveAsLastChild()', () => {
    beforeEach(() => {
      wwe
        .getEditor()
        .setHTML(
          '<table><thead><tr><th>1234</th></tr></thead>' +
            '<tbody><tr><td>1123</td></tr></tbody></table>'
        );
      $(wwe.getBody())
        .find('br')
        .remove();
    });
    const expectation = browser.msie && (browser.version === 10 || browser.version === 11) ? 0 : 1;

    it('append br if td or th does not have br as lastchild, td case', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('td')[0].childNodes[0], 2);
      range.collapse(true);

      mgr._appendBrIfTdOrThNotHaveAsLastChild(range);

      expect(
        $(wwe.getBody())
          .find('td')
          .eq(0)
          .find('br').length
      ).toEqual(expectation);
    });

    it('append br if td or th does not have br as lastchild, th case', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('th')[0].childNodes[0], 2);
      range.collapse(true);

      mgr._appendBrIfTdOrThNotHaveAsLastChild(range);

      expect(
        $(wwe.getBody())
          .find('th')
          .eq(0)
          .find('br').length
      ).toEqual(expectation);
    });
  });

  describe('undo', () => {
    beforeEach(() => {
      wwe
        .getEditor()
        .setHTML(
          '<table><thead><tr><th>1234</th></tr></thead>' +
            '<tbody><tr><td>1123</td></tr></tbody></table>'
        );
    });

    it('_recordUndoStateIfNeed record undo state if range is in different cell', () => {
      wwe.getEditor().saveUndoState = jasmine.createSpy('saveUndoState');

      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('th')[0], 0);
      range.collapse(true);

      mgr._recordUndoStateIfNeed(range);
      mgr._recordUndoStateIfNeed(range);

      expect(wwe.getEditor().saveUndoState.calls.count()).toEqual(1);
    });

    it('_recordUndoStateAndResetCellNode record undo state and reset laste cell node info', () => {
      wwe.getEditor().saveUndoState = jasmine.createSpy('saveUndoState');

      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('th')[0], 0);
      range.collapse(true);

      mgr._recordUndoStateAndResetCellNode(range);

      expect(wwe.getEditor().saveUndoState).toHaveBeenCalled();
      expect(mgr._lastCellNode).toEqual(null);
    });
  });

  describe('Events', () => {
    it('remove last br in td or th when getValue', () => {
      wwe.setValue(
        '<table><thead><tr><th>wef<br>wef<br></th></tr></thead>' +
          '<tbody><tr><td>waf<br>waef<br></td></tr></tbody></table>'
      );
      expect(wwe.getValue().replace(/<br \/>/g, '<br>')).toEqual(
        '<table>' +
          '<thead><tr><th>wef<br>wef</th></tr></thead><tbody><tr><td>waf<br>waef</td></tr></tbody></table><br>'
      );
    });

    it("empty td or th won't be deleted by getValue", () => {
      wwe.setValue(
        '<table><thead><tr><th><br></th></tr></thead><tbody><tr><td><br></td></tr></tbody></table>'
      );
      expect(wwe.getValue()).toEqual(
        '<table><thead><tr><th></th></tr></thead>' +
          '<tbody><tr><td></td></tr></tbody></table><br />'
      );
    });
  });

  describe('paste', () => {
    it('_getTableDataFromTable should extract each TD text contents from TABLE', () => {
      const [table] = $(
        '<document-fragment><table>' +
          '<thead><tr><td>1</td><td>2</td></tr></thead>' +
          '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
          '</table></document-fragment>'
      );
      const data = mgr._getTableDataFromTable(table);

      expect(data.length).toEqual(3);
      expect(data[0].length).toEqual(2);
      expect(data[1].length).toEqual(2);
      expect(data[2].length).toEqual(2);
      expect(data[0][0]).toEqual('1');
      expect(data[0][1]).toEqual('2');
      expect(data[1][0]).toEqual('3');
      expect(data[1][1]).toEqual('4');
      expect(data[2][0]).toEqual('5');
      expect(data[2][1]).toEqual('6');
    });

    it('_pasteDataIntoTable should paste data with right position', () => {
      const table =
        '<table>' +
        '<thead><tr><th>1</th><th>2</th></tr></thead>' +
        '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
        '</table>';
      const [pastingTable] = $(
        '<table>' +
          '<thead><tr><th>a</th><th>b</th></tr></thead>' +
          '<tbody><tr><td>c</td><td>d</td></tr><tr><td>e</td><td>f</td></tr></tbody>' +
          '</table>'
      );

      wwe.getEditor().setHTML(table);
      const $body = $(wwe.getBody());

      const range = wwe
        .getEditor()
        .getSelection()
        .selectNode($body.find('th')[1]);

      wwe.getEditor().setSelection(range);

      mgr._pasteDataIntoTable(pastingTable);

      expect($body.find('table').text()).toEqual('abcdef');
    });

    it('_pasteDataIntoTable should paste data with right position', () => {
      const table =
        '<table>' +
        '<thead><tr><th>1</th><th>2</th></tr></thead>' +
        '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
        '</table>';
      const [pastingTable] = $(
        '<table>' +
          '<thead><tr><th>a</th><th>b</th></tr></thead>' +
          '<tbody><tr><td>c</td><td>d</td></tr><tr><td>e</td><td>f</td></tr></tbody>' +
          '</table>'
      );

      wwe.getEditor().setHTML(table);
      const $body = $(wwe.getBody());

      const range = wwe
        .getEditor()
        .getSelection()
        .selectNode($body.find('th')[1]);

      wwe.getEditor().setSelection(range);

      mgr._pasteDataIntoTable(pastingTable);

      expect($body.find('table').text()).toEqual('abcdef');
    });

    it('_pasteDataIntoTable should paste data into cell containing inline tags ex) a, code ...', () => {
      const table =
        '<table>' +
        '<thead><tr><th>1</th><th>2</th></tr></thead>' +
        '<tbody><tr><td><a href="">3</a></td><td>4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr></tbody>' +
        '</table>';
      const pastingTable = $('<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>').get(0);

      wwe.getEditor().setHTML(table);
      const $body = $(wwe.getBody());
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart($body.find('table td a').get(0).firstChild, 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._pasteDataIntoTable(pastingTable);

      expect($body.find('table').text()).toEqual('12ab56');
    });
  });

  describe('remove', () => {
    it('_removeTableContents should remove current selected table text contents', () => {
      const table =
        '<table>' +
        '<thead><tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr></thead>' +
        '<tbody><tr class="te-cell-selected"><td class="te-cell-selected">3</td><td>4</td></tr>' +
        '<tr><td class="te-cell-selected">5</td><td class="te-cell-selected">6</td></tr></tbody>' +
        '</table>';

      wwe.getEditor().setHTML(table);
      const $body = $(wwe.getBody());
      const range = wwe.getEditor().getSelection();

      range.setStart($body.find('th')[0], 0);
      range.setEnd($body.find('td')[3], 0);
      wwe.getEditor().setSelection(range);

      mgr._removeTableContents($('.te-cell-selected'));

      expect($body.find('table').text()).toEqual('');
    });

    it(
      '_removeTableContents should remove current selected table text contents start' +
        ' at textNode in table cell',
      () => {
        const table =
          '<table>' +
          '<thead><tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr></thead>' +
          '<tbody><tr class="te-cell-selected"><td class="te-cell-selected">3</td><td>4</td></tr>' +
          '<tr><td class="te-cell-selected">5</td><td class="te-cell-selected">6</td></tr></tbody>' +
          '</table>';

        wwe.getEditor().setHTML(table);
        const $body = $(wwe.getBody());
        const range = wwe.getEditor().getSelection();

        range.setStart($body.find('th')[0].firstChild, 0);
        range.setEnd($body.find('td')[3], 0);
        wwe.getEditor().setSelection(range);

        mgr._removeTableContents($('.te-cell-selected'));

        expect($body.find('table').text()).toEqual('');
      }
    );

    it('_removeTableContents ignore non table elements that selected with table', () => {
      const html =
        '<table>' +
        '<thead><tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr></thead>' +
        '<tbody><tr><td class="te-cell-selected">3</td><td class="te-cell-selected">4</td></tr>' +
        '<tr><td class="te-cell-selected">5</td><td class="te-cell-selected">6</td></tr></tbody>' +
        '</table>' +
        '<div>hi<br></div>';

      wwe.getEditor().setHTML(html);

      const $body = $(wwe.getBody());
      const range = wwe.getEditor().getSelection();

      range.setStart($body.find('th')[0], 0);
      range.setEnd($body.find('div')[0], 0);

      wwe.getEditor().setSelection(range);

      mgr._removeTableContents($('.te-cell-selected'));

      expect($body.find('table').text()).toEqual('');
      expect($body.find('div').text()).toEqual('hi');
    });
  });
  describe('wrap table', () => {
    it('wrapTrsIntoTbodyIfNeed', () => {
      const $tableContainer = $('<div />');
      const html =
        '<tr><td>3</td><td>4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '<tr><td>7</td><td>8</td></tr>' +
        '<tr><td>9</td><td>10</td></tr>';

      $tableContainer.html(html);

      const result = mgr.wrapTrsIntoTbodyIfNeed($tableContainer.get(0));
      const $result = $(result);

      expect(result.nodeName).toBe('TBODY');
      expect($result.find('tr').length).toBe(4);
      expect($result.text()).toBe('345678910');
    });

    it('wrapTrsIntoTbodyIfNeed', () => {
      const $tableContainer = $('<div />');
      const html = '<tr><th>3</th><th>4</th></tr>';

      $tableContainer.html(html);

      const result = mgr.wrapTrsIntoTbodyIfNeed($tableContainer.get(0));
      const $result = $(result);

      expect(result.nodeName).toBe('TBODY');
      expect($result.find('tr').length).toBe(1);
      expect($result.text()).toBe('34');
    });

    it('wrapDanglingTableCellsIntoTrIfNeed', () => {
      const $tableContainer = $('<div />');
      const html = '<td>3</td><td>4</td><td>5</td><td>6</td>';

      $tableContainer.html(html);

      const result = mgr.wrapDanglingTableCellsIntoTrIfNeed($tableContainer.get(0));
      const $result = $(result);

      expect(result.nodeName).toBe('TR');
      expect($result.text()).toBe('3456');
    });

    it('wrapTheadAndTbodyIntoTableIfNeed', () => {
      const $tableContainer = $('<div />');
      const html =
        '<thead>' +
        '<tr><th>1</th><th>2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>3</td><td>4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '</tbody>';

      $tableContainer.html(html);

      const result = mgr.wrapTheadAndTbodyIntoTableIfNeed($tableContainer.get(0));
      const $result = $(result);

      expect(result.nodeName).toBe('TABLE');
      expect($result.find('tbody').length).toBe(1);
      expect($result.find('tbody').text()).toBe('3456');
      expect($result.find('thead').length).toBe(1);
      expect($result.find('thead').text()).toBe('12');
    });
    it('wrapTheadAndTbodyIntoTableIfNeed when only tbody exist ', () => {
      const $tableContainer = $('<div />');
      const html = '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>';

      $tableContainer.html(html);

      const result = mgr.wrapTheadAndTbodyIntoTableIfNeed($tableContainer.get(0));
      const $result = $(result);

      expect(result.nodeName).toBe('TABLE');
      expect($result.find('tbody').length).toBe(1);
      expect($result.find('tbody').text()).toBe('3456');
      expect($result.find('thead').length).toBe(1);
      expect($result.find('thead').text()).toBe('');
    });
  });
  describe('_completeTableIfNeed', () => {
    it('should complete TR to TABLE', done => {
      const html = '<tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('tbody').text()).toEqual('3456');
        expect($body.find('table')[0]).toBeDefined();
        expect($body.find('tbody').text()).toEqual('3456');
        done();
      });
    });

    it('shuold complete TBODY to TABLE', done => {
      const html = '<tbody><tr><td>b</td><td>o</td></tr><tr><td>d</td><td>y</td></tr></tbody>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('th').length).toEqual(2);
        expect($body.find('tbody').text()).toEqual('body');
        done();
      });
    });

    it('shuold complete THEAD to TABLE', done => {
      const html = '<thead><tr><th>he</th><th>ad</th></tr></thead>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('tbody td').length).toEqual(2);
        done();
      });
    });

    it('shuold complete TR>TH to TABLE', done => {
      const html = '<tr><th>he</th><th>ad</th></tr>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('tbody td').length).toEqual(2);
        done();
      });
    });

    it('do nothing when current node is complete TABLE', done => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th>he</th><th>ad</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>a</td><td>b</td></tr>' +
        '</tbody>' +
        '</table>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('tbody td').length).toEqual(2);
        expect($body.find('tbody').text()).toEqual('ab');
        done();
      });
    });

    it('prepend table cells into first TR in TABLE', done => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th>head</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>b</td></tr>' +
        '<tr><td>c</td><td>d</td></tr>' +
        '</tbody>' +
        '</table>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('thead th').length).toEqual(2);
        expect($body.find('tbody td').length).toEqual(4);
        expect($body.find('tbody').text()).toEqual('bcd');
        done();
      });
    });
    it('append table cells into last TR in TABLE', done => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th>head</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>a</td><td>b</td></tr>' +
        '<tr><td>c</td></tr>' +
        '</tbody>' +
        '</table>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('thead th').length).toEqual(2);
        expect($body.find('tbody td').length).toEqual(4);
        expect($body.find('tbody').text()).toEqual('abc');
        done();
      });
    });
    it('remove textNode and BR in TR', done => {
      const html =
        '<div>123</div>' +
        '<table>' +
        '<thead>' +
        '<tr>a<br></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>a</td><td>b</td></tr>' +
        '<tr><td>c</td></tr>' +
        '</tbody>' +
        '</table>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('');
        expect($body.find('thead th').length).toEqual(2);
        expect($body.find('tbody td').length).toEqual(4);
        expect($body.find('tbody').text()).toEqual('abc');
        done();
      });
    });

    it('remove textNode and BR in TR', done => {
      const html =
        '<div>123</div>' +
        '<table>' +
        '<thead>' +
        '<tr><th>he</th><th>ad</th></tr>' +
        '</thead>' +
        '<tbody>a<br></tbody>' +
        '</table>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('thead th').length).toEqual(2);
        expect($body.find('tbody tr').length).toEqual(1);
        expect($body.find('tbody td').length).toEqual(2);
        expect($body.find('tbody').text()).toEqual('');
        done();
      });
    });

    it('do nothing and return inner loop when not table or sub table element', done => {
      const html =
        '<div>123</div>' +
        '<table>' +
        '<thead>' +
        '<tr><th>head</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>a</td><td>b</td></tr>' +
        '<tr><td>c</td></tr>' +
        '</tbody>' +
        '</table>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('thead th').length).toEqual(2);
        expect($body.find('tbody td').length).toEqual(4);
        expect($body.find('tbody').text()).toEqual('abc');
        done();
      });
    });
    it('remove blank table element', done => {
      const html = '<table></table>';

      const $body = $(wwe.getBody()).html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('table').length).toBe(0);
        done();
      });
    });
  });

  describe('_moveCursorTo', () => {
    let eventMock;

    function createSingleColumnTable(cellValues) {
      const { head = '', body = [] } = cellValues;
      let bodyRows = '';

      for (let i = 0, len = body.length; i < len; i += 1) {
        bodyRows += `<tr><td>${body[i]}</td></tr>`;
      }

      const html = [
        '<table>',
        `<thead><tr><th>${head}</th></tr></thead>`,
        `<tbody>${bodyRows}</tbody>`,
        '</table>'
      ].join('');

      return $(wwe.getBody()).html(html);
    }

    function setCursor(target, offset) {
      const range = wwe.getEditor().getSelection();

      range.setStart(target, offset);
      range.collapse(true);

      wwe.getEditor().setSelection(range);
    }

    beforeEach(() => {
      eventMock = jasmine.createSpyObj('e', ['preventDefault']);
    });

    it('should move to previous cell', () => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th>1</th><th>2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>3</td><td>4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '</tbody>' +
        '</table>';
      const $body = $(wwe.getBody()).html(html);

      setCursor($body.find('th')[1], 0);
      mgr._moveCursorTo('previous', 'cell', eventMock);

      expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('1');
    });

    it('should move to next cell', () => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th>1</th><th>2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>3</td><td>4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '</tbody>' +
        '</table>';
      const $body = $(wwe.getBody()).html(html);

      setCursor($body.find('th')[0], 0);
      mgr._moveCursorTo('next', 'cell', eventMock);

      expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('2');
    });

    it('should move to next row first cell when next row not exist', () => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th>1</th><th>2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>3</td><td>4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '</tbody>' +
        '</table>';
      const $body = $(wwe.getBody()).html(html);

      setCursor($body.find('td')[1], 0);
      mgr._moveCursorTo('next', 'cell', eventMock);

      expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('5');
    });

    it('should move to previous element of table when cursor in first th', () => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th>1</th><th>2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>3</td><td>4</td></tr>' +
        '<tr><td>5</td><td>6<br>7<br>8<br>9<br></td></tr>' +
        '</tbody>' +
        '</table>';
      const $body = $(wwe.getBody()).html(html);

      setCursor($body.find('th')[0].childNodes[0], 0);
      mgr._moveCursorTo('previous', 'row', eventMock);

      expect(wwe.getEditor().getSelection().startContainer).toEqual($(wwe.getBody())[0]);
    });

    it('should move to previous element of table when cursor in first th', () => {
      const html =
        '<div>12</div><table>' +
        '<thead>' +
        '<tr><th>1</th><th>2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>3</td><td>4</td></tr>' +
        '<tr><td>5</td><td>6<br>7<br>8<br>9<br></td></tr>' +
        '</tbody>' +
        '</table>';

      const $body = $(wwe.getBody()).html(html);

      setCursor($body.find('th')[0].childNodes[0], 0);
      mgr._moveCursorTo('previous', 'row', eventMock);

      expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('12');
    });

    it('should move to next element of table when cursor in last td', () => {
      const html =
        '<div>12</div><table>' +
        '<thead>' +
        '<tr><th>1</th><th>2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>3</td><td>4</td></tr>' +
        '<tr><td>5</td><td>6<br>7<br>8<br>9<br></td></tr>' +
        '</tbody>' +
        '</table><div>34</div>';
      const $body = $(wwe.getBody()).html(html);

      setCursor($body.find('td')[3].childNodes[7], 0);
      mgr._moveCursorTo('next', 'row', eventMock);

      expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('34');
    });

    describe(
      'should move to the end of the previous row ' +
        'when the cursor is in the first line of multi line text',
      () => {
        it(`from 'td' to 'td'`, () => {
          const $body = createSingleColumnTable({
            body: ['foo<br>bar', 'baz<br>qux']
          });

          setCursor($body.find('td:eq(1)')[0].firstChild, 2);
          mgr._moveCursorTo('previous', 'row', eventMock);

          expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('bar');
        });

        it(`from 'td' to 'th'`, () => {
          const $body = createSingleColumnTable({
            head: 'foo<br>bar',
            body: ['baz<br>qux']
          });

          setCursor($body.find('td:eq(0)')[0].firstChild, 0);
          mgr._moveCursorTo('previous', 'row', eventMock);

          expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('bar');
        });
      }
    );

    describe(
      'should move to the end of the previous row ' +
        'when the cursor is in the first item of list',
      () => {
        it('from the list to the text', () => {
          const $body = createSingleColumnTable({
            body: ['foo<br>bar', '<ul><li>bar</li></ul>']
          });

          setCursor($body.find('td:eq(1)').find('li:eq(0)')[0].firstChild, 2);
          mgr._moveCursorTo('previous', 'row', eventMock);

          expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('bar');
        });

        it('from the list to the list that the last item have value', () => {
          const $body = createSingleColumnTable({
            body: ['<ul><li>foo</li><li>bar</li></ul>', '<ol><li>baz</li></ol>']
          });

          setCursor($body.find('td:eq(1)').find('li:eq(0)')[0].firstChild, 2);
          mgr._moveCursorTo('previous', 'row', eventMock);

          expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('bar');
        });

        it('from the list to the list that the last item is empty', () => {
          const $body = createSingleColumnTable({
            head: '<ul><li>foo</li><li><br></li></ul>',
            body: ['<ol><li>bar</li></ol>']
          });

          setCursor($body.find('td:eq(0)').find('li:eq(0)')[0].firstChild, 2);
          mgr._moveCursorTo('previous', 'row', eventMock);

          expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('');
        });
      }
    );

    describe(
      'should move to the end of the previous row ' +
        'when the cursor is in the first of blank lines',
      () => {
        it(`from 'br' to text`, () => {
          const $body = createSingleColumnTable({
            body: ['foo<br>bar', '<br>']
          });

          setCursor($body.find('td:eq(1)')[0].firstChild, 0);
          mgr._moveCursorTo('previous', 'row', eventMock);

          expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('bar');
        });

        it(`from 'br' to the list that the last item have value`, () => {
          const $body = createSingleColumnTable({
            body: ['<ul><li>foo</li><li>bar</li></ul>', '<br>']
          });

          setCursor($body.find('td:eq(1)')[0].firstChild, 0);
          mgr._moveCursorTo('previous', 'row', eventMock);

          expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('bar');
        });

        it('from the list to the list that the last item is empty', () => {
          const $body = createSingleColumnTable({
            head: '<ul><li>foo</li><li><br></li></ul>',
            body: ['<br>']
          });

          setCursor($body.find('td:eq(0)')[0].firstChild, 0);
          mgr._moveCursorTo('previous', 'row', eventMock);

          expect(wwe.getEditor().getSelection().startContainer.textContent).toBe('');
        });
      }
    );

    describe('should move to the start of the next row when the cursor is in the last line of text', () => {
      it(`from 'td' to 'td'`, () => {
        const $body = createSingleColumnTable({
          body: ['foo<br>bar', 'baz<br>qux']
        });

        setCursor($body.find('td:eq(0)')[0].lastChild, 2);
        mgr._moveCursorTo('next', 'row', eventMock);

        const range = wwe.getEditor().getSelection();

        expect(range.startContainer.textContent).toBe('bazqux');
        expect(range.startOffset).toBe(0);
      });

      it(`from 'th' to 'td'`, () => {
        const $body = createSingleColumnTable({
          head: 'foo<br>bar',
          body: ['baz<br>qux']
        });

        setCursor($body.find('th:eq(0)')[0].lastChild, 0);
        mgr._moveCursorTo('next', 'row', eventMock);

        const range = wwe.getEditor().getSelection();

        expect(range.startContainer.textContent).toBe('bazqux');
        expect(range.startOffset).toBe(0);
      });
    });

    describe('should move to the start of the next row when the cursor is in the last item of list', () => {
      it('from the list to the text', () => {
        const $body = createSingleColumnTable({
          body: ['<ul><li>bar</li></ul>', 'foo<br>bar']
        });

        setCursor(
          $body
            .find('td:eq(0)')
            .find('li')
            .last()[0].firstChild,
          2
        );
        mgr._moveCursorTo('next', 'row', eventMock);

        const range = wwe.getEditor().getSelection();

        expect(range.startContainer.textContent).toBe('foobar');
        expect(range.startOffset).toBe(0);
      });

      it('from the list to the list that the first item have value', () => {
        const $body = createSingleColumnTable({
          body: ['<ul><li>foo</li><li>bar</li></ul>', '<ol><li>baz</li></ol>']
        });

        setCursor(
          $body
            .find('td:eq(0)')
            .find('li')
            .last()[0].firstChild,
          2
        );
        mgr._moveCursorTo('next', 'row', eventMock);

        const range = wwe.getEditor().getSelection();

        expect(range.startContainer.textContent).toBe('baz');
        expect(range.startOffset).toBe(0);
      });

      it('from the list to the list that the first item is empty', () => {
        const $body = createSingleColumnTable({
          head: '<ol><li>foo</li><li>bar</li></ol>',
          body: ['<ul><li><br></li></ul>']
        });

        setCursor(
          $body
            .find('th:eq(0)')
            .find('li')
            .last()[0].firstChild,
          2
        );
        mgr._moveCursorTo('next', 'row', eventMock);

        const range = wwe.getEditor().getSelection();

        expect(range.startContainer.textContent).toBe('');
        expect(range.startOffset).toBe(0);
      });
    });

    describe('should move to the first of the next row when the cursor is in the last of blank lines', () => {
      it(`from 'br' to text`, () => {
        const $body = createSingleColumnTable({
          body: ['<br>', 'foo<br>bar']
        });

        setCursor($body.find('td:eq(0)')[0].lastChild, 0);
        mgr._moveCursorTo('next', 'row', eventMock);

        const range = wwe.getEditor().getSelection();

        expect(range.startContainer.textContent).toBe('foobar');
        expect(range.startOffset).toBe(0);
      });

      it(`from 'br' to the list that the first item have value`, () => {
        const $body = createSingleColumnTable({
          body: ['<br>', '<ul><li>foo</li></ul>']
        });

        setCursor($body.find('td:eq(0)')[0].lastChild, 0);
        mgr._moveCursorTo('next', 'row', eventMock);

        const range = wwe.getEditor().getSelection();

        expect(range.startContainer.textContent).toBe('foo');
        expect(range.startOffset).toBe(0);
      });

      it(`from 'br' to the list that the first item is empty`, () => {
        const $body = createSingleColumnTable({
          head: '<br>',
          body: ['<ul><li><br></li></ul>']
        });

        setCursor($body.find('th:eq(0)')[0].lastChild, 0);
        mgr._moveCursorTo('next', 'row', eventMock);

        const range = wwe.getEditor().getSelection();

        expect(range.startContainer.textContent).toBe('');
        expect(range.startOffset).toBe(0);
      });
    });
  });

  describe('_removeContentsAndChangeSelectionIfNeed', () => {
    it('delete contents and collapse selection to startContainer', () => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td class="te-cell-selected">3<br>2<br>1</td><td class="te-cell-selected">4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '</tbody>' +
        '</table><div>2</div>';

      wwe.focus();
      $(wwe.getBody()).html(html);

      let range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('th')[0], 0);
      range.setEnd(wwe.getBody().querySelectorAll('td')[1], 1);
      wwe.getEditor().setSelection(range);

      mgr._removeContentsAndChangeSelectionIfNeed(range, 'DELETE', {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      });

      range = wwe.getEditor().getSelection();
      expect(range.startContainer).toBe(wwe.getBody().querySelectorAll('th')[0]);
      expect(range.startContainer.textContent).toBe('');
      expect(
        $(wwe.getBody())
          .find('th')
          .eq(1)
          .text()
      ).toBe('');
      expect(
        $(wwe.getBody())
          .find('td')
          .eq(0)
          .text()
      ).toBe('');
      expect(
        $(wwe.getBody())
          .find('td')
          .eq(1)
          .text()
      ).toBe('');
      expect(range.collapsed).toBe(true);
    });
    it('delete contents and collapse selection to startContainer', () => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td class="te-cell-selected">3<br>2<br>1</td><td class="te-cell-selected">4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '</tbody>' +
        '</table><div>2</div>';

      wwe.focus();
      $(wwe.getBody()).html(html);

      let range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('th')[0], 0);
      range.setEnd(wwe.getBody().querySelectorAll('td')[1], 1);
      wwe.getEditor().setSelection(range);

      mgr._removeContentsAndChangeSelectionIfNeed(range, 'BACK_SPACE', {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      });

      range = wwe.getEditor().getSelection();
      expect(range.startContainer).toBe(wwe.getBody().querySelectorAll('th')[0]);
      expect(range.startContainer.textContent).toBe('');
      expect(
        $(wwe.getBody())
          .find('th')
          .eq(1)
          .text()
      ).toBe('');
      expect(
        $(wwe.getBody())
          .find('td')
          .eq(0)
          .text()
      ).toBe('');
      expect(
        $(wwe.getBody())
          .find('td')
          .eq(1)
          .text()
      ).toBe('');
      expect(range.collapsed).toBe(true);
    });
    it('delete contents and collapse selection to startContainer', () => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td class="te-cell-selected">3<br>2<br>1</td><td class="te-cell-selected">4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '</tbody>' +
        '</table><div>2</div>';

      wwe.focus();
      $(wwe.getBody()).html(html);

      let range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('th')[0], 0);
      range.setEnd(wwe.getBody().querySelectorAll('td')[1], 1);
      wwe.getEditor().setSelection(range);

      mgr._removeContentsAndChangeSelectionIfNeed(range, 'A', {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      });

      range = wwe.getEditor().getSelection();
      expect(range.startContainer).toBe(wwe.getBody().querySelectorAll('th')[0]);
      expect(range.startContainer.textContent).toBe('');
      expect(
        $(wwe.getBody())
          .find('th')
          .eq(1)
          .text()
      ).toBe('');
      expect(
        $(wwe.getBody())
          .find('td')
          .eq(0)
          .text()
      ).toBe('');
      expect(
        $(wwe.getBody())
          .find('td')
          .eq(1)
          .text()
      ).toBe('');
      expect(range.collapsed).toBe(true);
    });

    it('delete contents and collapse selection to startContainer', () => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td class="te-cell-selected">3<br>2<br>1</td><td class="te-cell-selected">4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '</tbody>' +
        '</table><div>2</div>';

      wwe.focus();
      $(wwe.getBody()).html(html);

      let range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('th')[0], 0);
      range.setEnd(wwe.getBody().querySelectorAll('td')[1], 1);
      wwe.getEditor().setSelection(range);

      mgr._removeContentsAndChangeSelectionIfNeed(range, 'ESC', {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      });

      range = wwe.getEditor().getSelection();
      expect(range.startContainer).toBe(wwe.getBody().querySelectorAll('th')[0]);
      expect(range.startContainer.textContent).toBe('1');
      expect(
        $(wwe.getBody())
          .find('th')
          .eq(1)
          .text()
      ).toBe('2');
      expect(
        $(wwe.getBody())
          .find('td')
          .eq(0)
          .text()
      ).toBe('321');
      expect(
        $(wwe.getBody())
          .find('td')
          .eq(1)
          .text()
      ).toBe('4');
      expect(range.collapsed).toBe(false);
    });

    it('_removeContentsAndChangeSelectionIfNeed() should return false if nothing has been processed', () => {
      const result = mgr._removeContentsAndChangeSelectionIfNeed(null, 'SOMETHING_ELSE', null);

      expect(result).toEqual(false);
    });

    it('_handleBackspaceAndDeleteKeyEvent() should not delete if no cells are selected', () => {
      const html = `
                <table>
                    <thead>
                        <tr><th>1</th><th>2</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>3<br>2<br>1</td><td>4</td></tr>
                        <tr><td>5</td><td>6</td></tr>
                    </tbody>
                </table><div>2</div>`;
      const ev = {
        preventDefault: () => {}
      };

      spyOn(ev, 'preventDefault');

      wwe.focus();
      $(wwe.getBody()).html(html);

      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[0], 0);
      range.setEnd(wwe.getBody().querySelectorAll('td')[0], 1);
      wwe.getEditor().setSelection(range);

      const result = mgr._handleBackspaceAndDeleteKeyEvent(ev, range, 'BACK_SPACE');

      expect(result).toEqual(true);
      expect(ev.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('_isDeletingBR', () => {
    beforeEach(() => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th><br></th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td>1<br></td></tr>' +
        '<tr><td>1<br><br><br><br></td></tr>' +
        '<tr><td>123<br><br><br><br></td></tr>' +
        '</tbody>' +
        '</table>';

      $(wwe.getBody()).html(html);
    });

    it('should check the last br as false', () => {
      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[0], 1);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      expect(mgr._isDeletingBR(range)).toEqual(false);
    });

    it('should check the br between br is as true', () => {
      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[1], 2);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      expect(mgr._isDeletingBR(range)).toEqual(true);
    });

    it('should check the text as false', () => {
      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[2], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      expect(mgr._isDeletingBR(range)).toEqual(false);
    });
  });

  describe('undo/redo for each cell in the table', () => {
    let defaultKeyEventHandler, range;

    beforeEach(() => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>1234</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1123</td>
            </tr>
          </tbody>
        </table>
      `;

      wwe.getEditor().setHTML(html);

      mgr._recordUndoStateIfNeed = jasmine.createSpy('recordUndoStateIfNeed');
      defaultKeyEventHandler = mgr.keyEventHandlers.DEFAULT;

      range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();
      range.setStart(wwe.getBody().querySelectorAll('th')[0], 0);
      range.collapse(true);
    });

    it('when normal key is pressed, calls function to add undo state', () => {
      defaultKeyEventHandler({}, range, 'A');
      expect(mgr._recordUndoStateIfNeed).toHaveBeenCalled();
    });

    it('when key of undo action is pressed, not call function to add undo state', () => {
      defaultKeyEventHandler({}, range, 'META+Z');
      expect(mgr._recordUndoStateIfNeed).not.toHaveBeenCalled();
    });

    it('when key of redo action is pressed, not call function to add undo state', () => {
      defaultKeyEventHandler({}, range, 'META+SHIFT+Z');
      expect(mgr._recordUndoStateIfNeed).not.toHaveBeenCalled();
    });
  });
});
