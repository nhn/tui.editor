/**
 * @fileoverview test wysiwyg table manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';
import WwTableManager from '../../src/js/wwTableManager';
import WwTableSelectionManager from '../../src/js/wwTableSelectionManager';

describe('WwTableManager', () => {
  let $container, em, wwe, mgr;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    em = new EventManager();

    wwe = new WysiwygEditor($container, em);

    wwe.init();

    mgr = new WwTableManager(wwe);
    wwe.componentManager.addManager('tableSelection', WwTableSelectionManager);
    wwe.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('isInTable() check if passed range is in table', () => {
    const range = wwe.getEditor().getSelection().cloneRange();
    wwe.getEditor().setHTML('<table><thead><tr><th><br></th><th><br></th></tr></thead>' +
            '<tbody><tr><td><br></td><td><br></td></tr></tbody></table>');
    range.setStart(wwe.get$Body().find('td')[0], 0);
    range.collapse(true);

    expect(mgr.isInTable(range)).toEqual(true);
  });

  describe('_appendBrIfTdOrThNotHaveAsLastChild()', () => {
    beforeEach(() => {
      wwe.getEditor().setHTML('<table><thead><tr><th>1234</th></tr></thead>' +
                '<tbody><tr><td>1123</td></tr></tbody></table>');
      wwe.get$Body().find('br').remove();
    });
    const expectation =
            util.browser.msie && (util.browser.version === 10 || util.browser.version === 11) ? 0 : 1;

    it('append br if td or th does not have br as lastchild, td case', () => {
      const range = wwe.getEditor().getSelection().cloneRange();
      range.setStart(wwe.get$Body().find('td')[0].childNodes[0], 2);
      range.collapse(true);

      mgr._appendBrIfTdOrThNotHaveAsLastChild(range);

      expect(wwe.get$Body().find('td').eq(0).find('br').length).toEqual(expectation);
    });

    it('append br if td or th does not have br as lastchild, th case', () => {
      const range = wwe.getEditor().getSelection().cloneRange();
      range.setStart(wwe.get$Body().find('th')[0].childNodes[0], 2);
      range.collapse(true);

      mgr._appendBrIfTdOrThNotHaveAsLastChild(range);

      expect(wwe.get$Body().find('th').eq(0).find('br').length).toEqual(expectation);
    });
  });

  describe('undo', () => {
    beforeEach(() => {
      wwe.getEditor().setHTML('<table><thead><tr><th>1234</th></tr></thead>' +
                '<tbody><tr><td>1123</td></tr></tbody></table>');
    });

    it('_recordUndoStateIfNeed record undo state if range is in different cell', () => {
      wwe.getEditor().saveUndoState = jasmine.createSpy('saveUndoState');

      const range = wwe.getEditor().getSelection().cloneRange();

      range.setStart(wwe.get$Body().find('th')[0], 0);
      range.collapse(true);

      mgr._recordUndoStateIfNeed(range);
      mgr._recordUndoStateIfNeed(range);

      expect(wwe.getEditor().saveUndoState.calls.count()).toEqual(1);
    });

    it('_recordUndoStateAndResetCellNode record undo state and reset laste cell node info', () => {
      wwe.getEditor().saveUndoState = jasmine.createSpy('saveUndoState');

      const range = wwe.getEditor().getSelection().cloneRange();

      range.setStart(wwe.get$Body().find('th')[0], 0);
      range.collapse(true);

      mgr._recordUndoStateAndResetCellNode(range);

      expect(wwe.getEditor().saveUndoState).toHaveBeenCalled();
      expect(mgr._lastCellNode).toEqual(null);
    });
  });

  describe('Events', () => {
    it('remove last br in td or th when getValue', () => {
      wwe.setValue('<table><thead><tr><th>wef<br>wef<br></th></tr></thead>' +
                '<tbody><tr><td>waf<br>waef<br></td></tr></tbody></table>');
      expect(wwe.getValue().replace(/<br \/>/g, '<br>')).toEqual('<table>' +
                '<thead><tr><th>wef<br>wef</th></tr></thead><tbody><tr><td>waf<br>waef</td></tr></tbody></table><br>');
    });

    it('empty td or th won\'t be deleted by getValue', () => {
      wwe.setValue('<table><thead><tr><th><br></th></tr></thead><tbody><tr><td><br></td></tr></tbody></table>');
      expect(wwe.getValue()).toEqual('<table><thead><tr><th></th></tr></thead>' +
                '<tbody><tr><td></td></tr></tbody></table><br />');
    });
  });

  describe('paste', () => {
    it('_getTableDataFromTable should extract each TD text contents from TABLE', () => {
      const table = $('<document-fragment><table>' +
                '<thead><tr><td>1</td><td>2</td></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table></document-fragment>')[0];
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
      const table = '<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>';
      const pastingTable = $('<table>' +
                '<thead><tr><th>a</th><th>b</th></tr></thead>' +
                '<tbody><tr><td>c</td><td>d</td></tr><tr><td>e</td><td>f</td></tr></tbody>' +
                '</table>')[0];

      wwe.getEditor().setHTML(table);
      const $body = wwe.get$Body();

      const range = wwe.getEditor().getSelection().selectNode($body.find('th')[1]);
      wwe.getEditor().setSelection(range);

      mgr._pasteDataIntoTable(pastingTable);

      expect($body.find('table').text()).toEqual('abcdef');
    });

    it('_pasteDataIntoTable should paste data with right position', () => {
      const table = '<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>';
      const pastingTable = $('<table>' +
                '<thead><tr><th>a</th><th>b</th></tr></thead>' +
                '<tbody><tr><td>c</td><td>d</td></tr><tr><td>e</td><td>f</td></tr></tbody>' +
                '</table>')[0];

      wwe.getEditor().setHTML(table);
      const $body = wwe.get$Body();

      const range = wwe.getEditor().getSelection().selectNode($body.find('th')[1]);
      wwe.getEditor().setSelection(range);

      mgr._pasteDataIntoTable(pastingTable);

      expect($body.find('table').text()).toEqual('abcdef');
    });
  });
  describe('remove', () => {
    it('_removeTableContents should remove current selected table text contents', () => {
      const table = '<table>' +
                '<thead><tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr></thead>' +
                '<tbody><tr class="te-cell-selected"><td class="te-cell-selected">3</td><td>4</td></tr>' +
                '<tr><td class="te-cell-selected">5</td><td class="te-cell-selected">6</td></tr></tbody>' +
                '</table>';

      wwe.getEditor().setHTML(table);
      const $body = wwe.get$Body();
      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('th')[0], 0);
      range.setEnd($body.find('td')[3], 0);
      wwe.getEditor().setSelection(range);

      mgr._removeTableContents($('.te-cell-selected'));

      expect($body.find('table').text()).toEqual('');
    });

    it('_removeTableContents should remove current selected table text contents start' +
            ' at textNode in table cell', () => {
      const table = '<table>' +
                '<thead><tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr></thead>' +
                '<tbody><tr class="te-cell-selected"><td class="te-cell-selected">3</td><td>4</td></tr>' +
                '<tr><td class="te-cell-selected">5</td><td class="te-cell-selected">6</td></tr></tbody>' +
                '</table>';

      wwe.getEditor().setHTML(table);
      const $body = wwe.get$Body();
      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('th')[0].firstChild, 0);
      range.setEnd($body.find('td')[3], 0);
      wwe.getEditor().setSelection(range);

      mgr._removeTableContents($('.te-cell-selected'));

      expect($body.find('table').text()).toEqual('');
    });

    it('_removeTableContents ignore non table elements that selected with table', () => {
      const html = '<table>' +
                '<thead><tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr></thead>' +
                '<tbody><tr><td class="te-cell-selected">3</td><td class="te-cell-selected">4</td></tr>' +
                '<tr><td class="te-cell-selected">5</td><td class="te-cell-selected">6</td></tr></tbody>' +
                '</table>' +
                '<div>hi<br></div>';

      wwe.getEditor().setHTML(html);

      const $body = wwe.get$Body();
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
      const html = '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '<tr><td>7</td><td>8</td></tr>' +
                '<tr><td>9</td><td>10</td></tr>';
      $tableContainer.html(html);

      const result = mgr.wrapTrsIntoTbodyIfNeed($tableContainer);
      const $result = $(result);

      expect(result.nodeName).toBe('TBODY');
      expect($result.find('tr').length).toBe(4);
      expect($result.text()).toBe('345678910');
    });

    it('wrapTrsIntoTbodyIfNeed', () => {
      const $tableContainer = $('<div />');
      const html = '<tr><th>3</th><th>4</th></tr>';
      $tableContainer.html(html);

      const result = mgr.wrapTrsIntoTbodyIfNeed($tableContainer);
      const $result = $(result);

      expect(result.nodeName).toBe('TBODY');
      expect($result.find('tr').length).toBe(1);
      expect($result.text()).toBe('34');
    });

    it('wrapDanglingTableCellsIntoTrIfNeed', () => {
      const $tableContainer = $('<div />');
      const html = '<td>3</td><td>4</td><td>5</td><td>6</td>';
      $tableContainer.html(html);

      const result = mgr.wrapDanglingTableCellsIntoTrIfNeed($tableContainer);
      const $result = $(result);

      expect(result.nodeName).toBe('TR');
      expect($result.text()).toBe('3456');
    });

    it('wrapTheadAndTbodyIntoTableIfNeed', () => {
      const $tableContainer = $('<div />');
      const html = '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>';
      $tableContainer.html(html);

      const result = mgr.wrapTheadAndTbodyIntoTableIfNeed($tableContainer);
      const $result = $(result);

      expect(result.nodeName).toBe('TABLE');
      expect($result.find('tbody').length).toBe(1);
      expect($result.find('tbody').text()).toBe('3456');
      expect($result.find('thead').length).toBe(1);
      expect($result.find('thead').text()).toBe('12');
    });
    it('wrapTheadAndTbodyIntoTableIfNeed when only tbody exist ', () => {
      const $tableContainer = $('<div />');
      const html = '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>';
      $tableContainer.html(html);

      const result = mgr.wrapTheadAndTbodyIntoTableIfNeed($tableContainer);
      const $result = $(result);

      expect(result.nodeName).toBe('TABLE');
      expect($result.find('tbody').length).toBe(1);
      expect($result.find('tbody').text()).toBe('3456');
      expect($result.find('thead').length).toBe(1);
      expect($result.find('thead').text()).toBe('');
    });
  });
  describe('_completeTableIfNeed', () => {
    it('shuold complete TR to TABLE', done => {
      const html = '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>';

      const $body = wwe.get$Body().html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('tbody').text()).toEqual('3456');
        expect($body.find('table')[0]).toBeDefined();
        expect($body.find('tbody').text()).toEqual('3456');
        done();
      });
    });

    it('shuold complete TBODY to TABLE', done => {
      const html = '<tbody>' +
                '<tr><td>b</td><td>o</td></tr>' +
                '<tr><td>d</td><td>y</td></tr>' +
                '</tbody>';

      const $body = wwe.get$Body().html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('th').length).toEqual(2);
        expect($body.find('tbody').text()).toEqual('body');
        done();
      });
    });

    it('shuold complete THEAD to TABLE', done => {
      const html = '<thead><tr><th>he</th><th>ad</th></tr></thead>';

      const $body = wwe.get$Body().html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('tbody td').length).toEqual(2);
        done();
      });
    });

    it('shuold complete TR>TH to TABLE', done => {
      const html = '<tr><th>he</th><th>ad</th></tr>';

      const $body = wwe.get$Body().html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('tbody td').length).toEqual(2);
        done();
      });
    });

    it('do nothing when current node is complete TABLE', done => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>he</th><th>ad</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>a</td><td>b</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('thead').text()).toEqual('head');
        expect($body.find('tbody td').length).toEqual(2);
        expect($body.find('tbody').text()).toEqual('ab');
        done();
      });
    });

    it('prepend table cells into first TR in TABLE', done => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>head</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>b</td></tr>' +
                '<tr><td>c</td><td>d</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

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
      const html = '<table>' +
                '<thead>' +
                '<tr><th>head</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>a</td><td>b</td></tr>' +
                '<tr><td>c</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

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
      const html = '<div>123</div>' +
                '<table>' +
                '<thead>' +
                '<tr>a<br></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>a</td><td>b</td></tr>' +
                '<tr><td>c</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

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
      const html = '<div>123</div>' +
                '<table>' +
                '<thead>' +
                '<tr><th>he</th><th>ad</th></tr>' +
                '</thead>' +
                '<tbody>a<br></tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

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
      const html = '<div>123</div>' +
                '<table>' +
                '<thead>' +
                '<tr><th>head</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>a</td><td>b</td></tr>' +
                '<tr><td>c</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

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

      const $body = wwe.get$Body().html(html);

      mgr._completeTableIfNeed();

      setTimeout(() => {
        expect($body.find('table').length).toBe(0);
        done();
      });
    });
  });
  describe('_moveCursorTo', () => {
    it('should move to previous cell', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('th')[1], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('previous', 'cell', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('1');
    });

    it('should move to next cell', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('th')[0], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('next', 'cell', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('2');
    });
    it('should move to next row first cell when next row not exist', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('td')[1], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('next', 'cell', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('5');
    });

    it('should move to next row', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('th')[0], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('next', 'row', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('3');
    });

    it('should move to previous row', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('td')[3], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('previous', 'row', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('4');
    });

    it('should move to previous row on textNode', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6<br>7<br>8<br>9<br></td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('td')[3].firstChild, 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('previous', 'row', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('4');
    });
    it('should move to previous row on textNode', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6<br>7<br>8<br>9<br></td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('td')[3].childNodes[2], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('previous', 'row', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.nodeValue).toEqual('6');
    });
    it('should move to next row on textNode', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6<br>7<br>8<br>9<br></td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('td')[3].childNodes[2], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('next', 'row', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.nodeValue).toEqual('8');
    });
    it('should move to previous element of table when cursor in first th', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6<br>7<br>8<br>9<br></td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('th')[0].childNodes[0], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('previous', 'row', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer).toEqual(wwe.get$Body()[0]);
    });
    it('should move to previous element of table when cursor in first th', () => {
      const html = '<div>12</div><table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6<br>7<br>8<br>9<br></td></tr>' +
                '</tbody>' +
                '</table>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('th')[0].childNodes[0], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('previous', 'row', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('12');
    });
    it('should move to next element of table when cursor in last td', () => {
      const html = '<div>12</div><table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6<br>7<br>8<br>9<br></td></tr>' +
                '</tbody>' +
                '</table><div>34</div>';

      const $body = wwe.get$Body().html(html);

      const range = wwe.getEditor().getSelection();
      range.setStart($body.find('td')[3].childNodes[6], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr._moveCursorTo('next', 'row', {
        preventDefault: () => {
        }
      });

      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('34');
    });
  });
  describe('_getSiblingTextNodeByDirection', () => {
    it('should get next sibling text node', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3<br>2<br>1</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>';
      const $body = wwe.get$Body().html(html);

      const target = mgr._getSiblingTextNodeByDirection($body.find('td')[0].firstChild, true);

      expect(target.nodeValue).toEqual('2');
    });
    it('should return undefined when previous sibling text node not exists', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3<br>2<br>1</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>';
      const $body = wwe.get$Body().html(html);

      const target = mgr._getSiblingTextNodeByDirection($body.find('td')[0].firstChild, false);

      expect(target).toBeUndefined();
    });
    it('should get previous sibling text node', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3<br>2<br>1</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>';
      const $body = wwe.get$Body().html(html);

      const target = mgr._getSiblingTextNodeByDirection($body.find('td')[0].childNodes[2], false);

      expect(target.nodeValue).toEqual('3');
    });
    it('should return undefined when next sibling text node not exists', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3<br>2<br>1</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>';
      const $body = wwe.get$Body().html(html);

      const target = mgr._getSiblingTextNodeByDirection($body.find('td')[0].childNodes[4], true);

      expect(target).toBeUndefined();
    });
  });

  describe('_removeContentsAndChangeSelectionIfNeed', () => {
    it('delete contents and collapse selection to startContainer', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td class="te-cell-selected">3<br>2<br>1</td><td class="te-cell-selected">4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table><div>2</div>';

      wwe.focus();
      wwe.get$Body().html(html);

      let range = wwe.getEditor().getSelection();
      range.setStart(wwe.get$Body().find('th')[0], 0);
      range.setEnd(wwe.get$Body().find('td')[1], 1);
      wwe.getEditor().setSelection(range);

      mgr._removeContentsAndChangeSelectionIfNeed(range, 'DELETE', {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      });

      range = wwe.getEditor().getSelection();
      expect(range.startContainer).toBe(wwe.get$Body().find('th')[0]);
      expect(range.startContainer.textContent).toBe('');
      expect(wwe.get$Body().find('th').eq(1).text()).toBe('');
      expect(wwe.get$Body().find('td').eq(0).text()).toBe('');
      expect(wwe.get$Body().find('td').eq(1).text()).toBe('');
      expect(range.collapsed).toBe(true);
    });
    it('delete contents and collapse selection to startContainer', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td class="te-cell-selected">3<br>2<br>1</td><td class="te-cell-selected">4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table><div>2</div>';

      wwe.focus();
      wwe.get$Body().html(html);

      let range = wwe.getEditor().getSelection();
      range.setStart(wwe.get$Body().find('th')[0], 0);
      range.setEnd(wwe.get$Body().find('td')[1], 1);
      wwe.getEditor().setSelection(range);

      mgr._removeContentsAndChangeSelectionIfNeed(range, 'BACK_SPACE', {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      });

      range = wwe.getEditor().getSelection();
      expect(range.startContainer).toBe(wwe.get$Body().find('th')[0]);
      expect(range.startContainer.textContent).toBe('');
      expect(wwe.get$Body().find('th').eq(1).text()).toBe('');
      expect(wwe.get$Body().find('td').eq(0).text()).toBe('');
      expect(wwe.get$Body().find('td').eq(1).text()).toBe('');
      expect(range.collapsed).toBe(true);
    });
    it('delete contents and collapse selection to startContainer', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td class="te-cell-selected">3<br>2<br>1</td><td class="te-cell-selected">4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table><div>2</div>';

      wwe.focus();
      wwe.get$Body().html(html);

      let range = wwe.getEditor().getSelection();
      range.setStart(wwe.get$Body().find('th')[0], 0);
      range.setEnd(wwe.get$Body().find('td')[1], 1);
      wwe.getEditor().setSelection(range);

      mgr._removeContentsAndChangeSelectionIfNeed(range, 'A', {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      });

      range = wwe.getEditor().getSelection();
      expect(range.startContainer).toBe(wwe.get$Body().find('th')[0]);
      expect(range.startContainer.textContent).toBe('');
      expect(wwe.get$Body().find('th').eq(1).text()).toBe('');
      expect(wwe.get$Body().find('td').eq(0).text()).toBe('');
      expect(wwe.get$Body().find('td').eq(1).text()).toBe('');
      expect(range.collapsed).toBe(true);
    });

    it('delete contents and collapse selection to startContainer', () => {
      const html = '<table>' +
                '<thead>' +
                '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td class="te-cell-selected">3<br>2<br>1</td><td class="te-cell-selected">4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table><div>2</div>';

      wwe.focus();
      wwe.get$Body().html(html);

      let range = wwe.getEditor().getSelection();
      range.setStart(wwe.get$Body().find('th')[0], 0);
      range.setEnd(wwe.get$Body().find('td')[1], 1);
      wwe.getEditor().setSelection(range);

      mgr._removeContentsAndChangeSelectionIfNeed(range, 'ESC', {
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      });

      range = wwe.getEditor().getSelection();
      expect(range.startContainer).toBe(wwe.get$Body().find('th')[0]);
      expect(range.startContainer.textContent).toBe('1');
      expect(wwe.get$Body().find('th').eq(1).text()).toBe('2');
      expect(wwe.get$Body().find('td').eq(0).text()).toBe('321');
      expect(wwe.get$Body().find('td').eq(1).text()).toBe('4');
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
      wwe.get$Body().html(html);

      let range = wwe.getEditor().getSelection();
      range.setStart(wwe.get$Body().find('td')[0], 0);
      range.setEnd(wwe.get$Body().find('td')[0], 1);
      wwe.getEditor().setSelection(range);

      const result = mgr._handleBackspaceAndDeleteKeyEvent(ev, range, 'BACK_SPACE');
      expect(result).toEqual(true);
      expect(ev.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('_removeBRIfNeed', () => {
    beforeEach(() => {
      wwe.getEditor().setHTML('<table><thead><tr><th>1</th></tr></thead>' +
                '<tbody><tr><td>1<br></td></tr></tbody></table>');
    });

    it('should remove BR when one character inputted', () => {
      const range = wwe.getEditor().getSelection().cloneRange();
      range.setStart(wwe.get$Body().find('td')[0].childNodes[0], 0);
      range.collapse(true);

      mgr._removeBRIfNeed(range);

      expect(wwe.get$Body().find('td').eq(0).find('br').length).toEqual(0);
      expect(wwe.get$Body().find('td').eq(0).find('br').length).toEqual(0);
    });
  });

  describe('_insertBRIfNeed', () => {
    beforeEach(() => {
      wwe.getEditor().setHTML('<table><thead><tr><th>1234</th></tr></thead>' +
                '<tbody><tr><td></td></tr></tbody></table>');
      wwe.get$Body().find('br').remove();
    });
    const expectation =
            util.browser.msie && (util.browser.version === 10 || util.browser.version === 11) ? 0 : 1;

    it('should insert BR when text content length is 0', () => {
      const range = wwe.getEditor().getSelection().cloneRange();
      range.setStart(wwe.get$Body().find('td')[0], 0);
      range.collapse(true);

      mgr._insertBRIfNeed(range);

      expect(wwe.get$Body().find('td').eq(0).find('br').length).toEqual(expectation);
    });
  });
});
