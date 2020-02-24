/**
 * @fileoverview test wysiwyg table remove column command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import RemoveCol from '@/wysiwygCommands/tableRemoveCol';
import WwTableManager from '@/wwTableManager';
import WwTableSelectionManager from '@/wwTableSelectionManager';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Table - RemoveCol', () => {
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

  it('remove col that have selected cell', () => {
    const sq = wwe.getEditor(),
      range = sq.getSelection().cloneRange();

    sq.setHTML(
      `<table>
                <thead>
                    <tr><th>1</th><th>2</th></tr>
                </thead>
                <tbody>
                    <tr><td>3</td><td>4</td></tr>
                    <tr><td>5</td><td>6</td></tr>
                </tbody>
            </table>`
    );

    range.setStartBefore(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
    range.collapse(true);

    sq.setSelection(range);

    RemoveCol.exec(wwe);

    expect(wwe.getBody().querySelectorAll('thead th').length).toBe(1);
    expect(wwe.getBody().querySelectorAll('tbody td').length).toBe(2);
  });

  it('dont remove col if there have only one col', () => {
    const sq = wwe.getEditor(),
      range = sq.getSelection().cloneRange();

    sq.setHTML(
      `<table>
                <thead>
                    <tr><th>1</th></tr>
                </thead>
                <tbody>
                    <tr><td>3</td></tr>
                    <tr><td>5</td></tr>
                </tbody>
            </table>`
    );

    range.setStartBefore(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
    range.collapse(true);

    sq.setSelection(range);

    RemoveCol.exec(wwe);

    expect(wwe.getBody().querySelectorAll('thead th').length).toBe(1);
    expect(wwe.getBody().querySelectorAll('tbody td').length).toBe(2);
  });

  it('should not remove cols if selected all col', () => {
    const sq = wwe.getEditor();
    const range = sq.getSelection().cloneRange();

    sq.setHTML(
      `<table>
          <thead>
              <tr><th>1</th><th>2</th></tr>
          </thead>
          <tbody>
              <tr><td class="te-cell-selected">3</td><td class="te-cell-selected">4</td></tr>
              <tr><td>5</td><td>6</td></tr>
          </tbody>
      </table>`
    );

    range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
    range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[1].firstChild);
    sq.setSelection(range);

    RemoveCol.exec(wwe);

    expect(wwe.getBody().querySelectorAll('thead th').length).toBe(2);
    expect(wwe.getBody().querySelectorAll('tbody td').length).toBe(4);
  });

  it('should remove all columns if there are multiple tds in range', () => {
    const sq = wwe.getEditor();
    const range = sq.getSelection().cloneRange();

    sq.setHTML(
      `<table>
                <thead>
                    <tr><th>1</th><th>2</th><th>3</th></tr>
                </thead>
                <tbody>
                    <tr><td class="te-cell-selected">4</td><td class="te-cell-selected">5</td><td>6</td></tr>
                    <tr><td>7</td><td>8</td><td>9</td></tr>
                </tbody>
            </table>`
    );

    range.setStartAfter(wwe.getBody().querySelectorAll('tbody td')[0].firstChild);
    range.setEndAfter(wwe.getBody().querySelectorAll('tbody td')[1].firstChild);
    sq.setSelection(range);

    RemoveCol.exec(wwe);

    expect(wwe.getBody().querySelectorAll('thead th').length).toBe(1);
    expect(wwe.getBody().querySelectorAll('tbody td').length).toBe(2);
  });
});
