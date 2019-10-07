/**
 * @fileoverview test wysiwyg table add row command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import AddRow from '@/wysiwygCommands/tableAddRow';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwTableManager from '@/wwTableManager';
import WwTableSelectionManager from '@/wwTableSelectionManager';

describe('Table - AddRow', () => {
  let wwe, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor($(container), new EventManager());

    wwe.init();
    wwe.componentManager.addManager(WwTableManager);
    wwe.componentManager.addManager(WwTableSelectionManager);

    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      container.parentNode.removeChild(container);
      done();
    });
  });

  it('add row to current td cell below', () => {
    const sq = wwe.getEditor(),
      range = sq.getSelection().cloneRange();

    sq.setHTML(
      `<table>
                <thead>
                    <tr><th>1</th><th>2</th></tr>
                </thead>
                <tbody>
                    <tr><td>3</td><td>4</td></tr>
                </tbody>
            </table>`
    );

    range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
    range.collapse(true);

    sq.setSelection(range);
    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddRow.exec(wwe);

    expect(wwe.get$Body().find('tbody tr').length).toBe(2);
    expect(wwe.get$Body().find('tbody td').length).toBe(4);
  });

  it('should add multiple row to current td cell below', () => {
    const sq = wwe.getEditor(),
      range = sq.getSelection().cloneRange();

    sq.setHTML(
      `<table>
                <thead>
                    <tr><th>1</th><th>2</th></tr>
                </thead>
                <tbody>
                    <tr><td>3</td><td class="te-cell-selected">4</td></tr>
                    <tr><td class="te-cell-selected">5</td><td class="te-cell-selected">6</td></tr>
                </tbody>
            </table>`
    );

    range.setStartAfter(wwe.get$Body().find('tbody td')[1].firstChild);
    range.setStartAfter(wwe.get$Body().find('tbody td')[3].firstChild);

    sq.setSelection(range);
    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddRow.exec(wwe);

    expect(wwe.get$Body().find('tbody tr').length).toBe(4);
    expect(wwe.get$Body().find('tbody td').length).toBe(8);
  });

  it('add row to tbody`s first index', () => {
    const sq = wwe.getEditor(),
      range = sq.getSelection().cloneRange();

    sq.setHTML(
      `<table>
                <thead>
                    <tr><th>1</th><th>2</th></tr>
                </thead>
                <tbody>
                    <tr><td>3</td><td>4</td></tr>
                </tbody>
            </table>`
    );

    range.setStartAfter(wwe.get$Body().find('thead th')[0].firstChild);
    range.collapse(true);

    sq.setSelection(range);
    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddRow.exec(wwe);

    expect(wwe.get$Body().find('tbody tr').length).toBe(2);
    expect(wwe.get$Body().find('tbody tr').eq(0).text()).toBe('');
    expect(wwe.get$Body().find('tbody tr').eq(1).text()).toBe('34');
    expect(wwe.get$Body().find('tbody td').length).toBe(4);
  });

  it('focus to new row\'s first td', () => {
    const sq = wwe.getEditor(),
      range = sq.getSelection().cloneRange();

    sq.setHTML(
      `<table>
                <thead>
                    <tr><th>1</th><th>2</th></tr>
                </thead>
                <tbody>
                    <tr><td>3</td><td>4</td></tr>
                </tbody>
            </table>`
    );

    range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
    range.collapse(true);

    sq.setSelection(range);
    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddRow.exec(wwe);

    expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('tbody td')[2]);
  });
});
