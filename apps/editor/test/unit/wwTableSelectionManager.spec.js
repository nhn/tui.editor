/**
 * @fileoverview test wysiwyg table selection manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwTableSelectionManager from '@/wwTableSelectionManager';
import WwTableManager from '@/wwTableManager';

describe('WwTableSelectionManager', () => {
  let container, em, wwe, mgr;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();

    wwe = new WysiwygEditor(container, em);

    wwe.init();

    mgr = new WwTableSelectionManager(wwe);
    wwe.focus();
    wwe.componentManager.addManager(WwTableManager);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  describe('_reArrangeSelectionIfneed', () => {
    it('should return range that startContainer is first th when startContainer is out of table', () => {
      const sq = wwe.getEditor();

      sq.setHTML(
        '<div>div element</div>' +
          '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      const $tds = $('td');
      const reArrangedSelection = mgr._reArrangeSelectionIfneed(
        sq.getBody().querySelector('div'),
        $tds[1]
      );

      expect(reArrangedSelection.startContainer).toBe($('th')[0]);
      expect(reArrangedSelection.endContainer).toBe($tds[1]);
    });
    it('should return range that endContainer is last td when endContainer is out of table', () => {
      const sq = wwe.getEditor();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>' +
          '<div>div element</div>'
      );

      const $tds = $('td');
      const reArrangedSelection = mgr._reArrangeSelectionIfneed(
        $tds[1],
        sq.getBody().querySelector('div')
      );

      expect(reArrangedSelection.startContainer).toBe($tds[1]);
      expect(reArrangedSelection.endContainer).toBe($tds[3]);
    });
  });
  describe('_applySelectionDirection', () => {
    it('should return range naturally at same row', () => {
      const sq = wwe.getEditor();
      const range = sq.getSelection();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      const $tds = $('td');
      const newRange = mgr._applySelectionDirection(
        {
          startContainer: $tds[0],
          endContainer: $tds[1]
        },
        range
      );

      expect(newRange.startContainer).toBe($tds[0]);
      expect(newRange.endContainer).toBe($tds[1]);
    });
    it('should return range reversed at same row', () => {
      const sq = wwe.getEditor();
      const range = sq.getSelection();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      const $tds = $('td');
      const newRange = mgr._applySelectionDirection(
        {
          startContainer: $tds[1],
          endContainer: $tds[0]
        },
        range
      );

      expect(newRange.startContainer).toBe($tds[0]);
      expect(newRange.endContainer).toBe($tds[1]);
    });
    it('should return range naturally row index increases', () => {
      const sq = wwe.getEditor();
      const range = sq.getSelection();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      const $ths = $('th');
      const $tds = $('td');
      const newRange = mgr._applySelectionDirection(
        {
          startContainer: $ths[0],
          endContainer: $tds[2]
        },
        range
      );

      expect(newRange.startContainer).toBe($ths[0]);
      expect(newRange.endContainer).toBe($tds[2]);
    });
    it('should return range naturally row index decreases', () => {
      const sq = wwe.getEditor();
      const range = sq.getSelection();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      const $tds = $('td');
      const $ths = $('th');
      const newRange = mgr._applySelectionDirection(
        {
          startContainer: $tds[2],
          endContainer: $ths[0]
        },
        range
      );

      expect(newRange.startContainer).toBe($ths[0]);
      expect(newRange.endContainer).toBe($tds[2]);
    });
  });
  describe('getSelectionRangeFromTable', () => {
    it('should increase endRowOffset by 1 when thead and tbody selected', () => {
      const sq = wwe.getEditor();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      const selectionInformation = mgr.getSelectionRangeFromTable($('th')[0], $('td')[3]);

      expect(selectionInformation.to.row).toBe(2);
    });
    it('should increase both startRowOffset and endRowOffset by 1 when only tbody selected', () => {
      const sq = wwe.getEditor();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      const $tds = $('td');

      const selectionInformation = mgr.getSelectionRangeFromTable($tds[0], $tds[3]);

      expect(selectionInformation.from.row).toBe(1);
      expect(selectionInformation.to.row).toBe(2);
    });
    it('should return startRowOffset and endRowOffset zero when only thead selected', () => {
      const sq = wwe.getEditor();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      const $ths = $('th');

      const selectionInformation = mgr.getSelectionRangeFromTable($ths[0], $ths[1]);

      expect(selectionInformation.from.row).toBe(0);
      expect(selectionInformation.to.row).toBe(0);
    });
  });

  describe('_removeCellSelectedClassFromAllCells', () => {
    it("should remove '.te-cell-selected' class from all table cells", () => {
      const sq = wwe.getEditor();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      mgr.removeClassAttrbuteFromAllCellsIfNeed();

      expect($('.te-cell-selected').length).toBe(0);
      expect($('td,th').length).toBe(6);
    });
  });

  describe('highlightTableCellsBy', () => {
    it("should add '.te-cell-selected' class to selected cells", () => {
      const sq = wwe.getEditor();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      mgr.highlightTableCellsBy($('th')[0], $('td')[3]);

      const selectedCells = $('.te-cell-selected');

      expect(selectedCells.length).toBe(6);
      expect(selectedCells.eq(0).text()).toBe('1');
      expect(selectedCells.eq(1).text()).toBe('2');
      expect(selectedCells.eq(2).text()).toBe('3');
      expect(selectedCells.eq(3).text()).toBe('4');
      expect(selectedCells.eq(4).text()).toBe('5');
      expect(selectedCells.eq(5).text()).toBe('6');
    });

    it("should add '.te-cell-selected' class to selected TDs", () => {
      const sq = wwe.getEditor();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );
      const $tds = $('td');

      mgr.highlightTableCellsBy($tds[0], $tds[3]);

      const selectedCells = $('.te-cell-selected');

      expect(selectedCells.length).toBe(4);
      expect(selectedCells.eq(0).text()).toBe('3');
      expect(selectedCells.eq(1).text()).toBe('4');
      expect(selectedCells.eq(2).text()).toBe('5');
      expect(selectedCells.eq(3).text()).toBe('6');
    });

    it("should add '.te-cell-selected' class to selected TDs abnormally", () => {
      const sq = wwe.getEditor();

      sq.setHTML(
        '<table>' +
          '<thead>' +
          '<tr><th>1</th><th>2</th></tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr><td>3</td><td>4</td></tr>' +
          '<tr><td>5</td><td>6</td></tr>' +
          '</tbody>' +
          '</table>'
      );

      mgr.highlightTableCellsBy($('th')[1], $('td')[2]);

      const selectedCells = $('.te-cell-selected');

      expect(selectedCells.length).toBe(4);
      expect(selectedCells.eq(0).text()).toBe('2');
      expect(selectedCells.eq(1).text()).toBe('3');
      expect(selectedCells.eq(2).text()).toBe('4');
      expect(selectedCells.eq(3).text()).toBe('5');
    });
  });

  describe('_createRangeBySelectedCells', () => {
    it('should create selection by selected cells and current selection is in table', () => {
      const html =
        '<table>' +
        '<thead>' +
        '<tr><th class="te-cell-selected">1</th><th class="te-cell-selected">2</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td class="te-cell-selected">3<br>2<br>1</td><td class="te-cell-selected">4</td></tr>' +
        '<tr><td>5</td><td>6</td></tr>' +
        '</tbody>' +
        '</table>';

      wwe.focus();
      $(wwe.getBody()).html(html);

      let range = wwe.getEditor().getSelection();

      range.setStart($(wwe.getBody()).find('th')[0], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr.createRangeBySelectedCells();
      range = wwe.getEditor().getSelection();

      expect(range.startContainer).toBe($(wwe.getBody()).find('th')[0]);
      expect(range.endContainer).toBe($(wwe.getBody()).find('td')[1]);
    });
    it('do not selection on table when current selection is not in table', () => {
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

      range.setStart($(wwe.getBody()).find('div')[0], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      mgr.createRangeBySelectedCells();
      range = wwe.getEditor().getSelection();

      expect(range.startContainer).toBe($(wwe.getBody()).find('div')[0]);
    });
  });
});
