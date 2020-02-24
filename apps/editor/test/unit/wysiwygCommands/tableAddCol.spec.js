/**
 * @fileoverview test wysiwyg table add column command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import AddCol from '@/wysiwygCommands/tableAddCol';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwTableManager from '@/wwTableManager';
import WwTableSelectionManager from '@/wwTableSelectionManager';

describe('Table - AddCol', () => {
  let wwe, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

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

  it('add col to current td cell right', () => {
    const sq = wwe.getEditor();
    const range = sq.getSelection().cloneRange();

    sq.setHTML(`
      <table>
        <thead>
          <tr><th>1</th><th>2</th></tr>
        </thead>
        <tbody>
          <tr><td>3</td><td>4</td></tr>
        </tbody>
      </table>
    `);

    range.setStartBefore(wwe.getBody().querySelectorAll('tbody td')[1].firstChild);
    range.collapse(true);

    sq.setSelection(range);
    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddCol.exec(wwe);

    expect(wwe.getBody().querySelectorAll('thead th').length).toBe(3);
    expect(wwe.getBody().querySelectorAll('tbody td').length).toBe(3);
    expect(sq.getSelection().startContainer).toBe(wwe.getBody().querySelectorAll('tbody td')[2]);
  });

  it('add multiple cols to current td cell right', () => {
    const sq = wwe.getEditor();
    const range = sq.getSelection().cloneRange();

    sq.setHTML(`
      <table>
        <thead>
          <tr><th>1</th><th>2</th></tr>
        </thead>
        <tbody>
          <tr><td class="te-cell-selected">3</td><td class="te-cell-selected">4</td></tr>
        </tbody>
      </table>
    `);

    range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
    range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[1].firstChild);
    sq.setSelection(range);

    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddCol.exec(wwe);

    expect(wwe.getBody().querySelectorAll('thead th').length).toBe(4);
    expect(wwe.getBody().querySelectorAll('tbody td').length).toBe(4);
  });

  it('add col to current th cell right', () => {
    const sq = wwe.getEditor();
    const range = sq.getSelection().cloneRange();

    sq.setHTML(`
        <table>
          <thead>
            <tr><th>1</th><th>2</th></tr>
          </thead>
          <tbody>
            <tr><td>3</td><td>4</td></tr>
          </tbody>
        </table>
      `);

    range.setStartBefore(wwe.getBody().querySelectorAll('thead th')[0].firstChild);
    range.collapse(true);

    sq.setSelection(range);
    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddCol.exec(wwe);

    expect(wwe.getBody().querySelectorAll('thead th').length).toBe(3);
    expect(wwe.getBody().querySelectorAll('tbody td').length).toBe(3);
    expect(sq.getSelection().startContainer).toBe(wwe.getBody().querySelectorAll('thead th')[1]);
  });
});
