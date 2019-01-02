/**
 * @fileoverview test wysiwyg table add column command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import AddCol from '../../../src/js/wysiwygCommands/tableAddCol';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import EventManager from '../../../src/js/eventManager';
import WwTableManager from '../../../src/js/wwTableManager';
import WwTableSelectionManager from '../../../src/js/wwTableSelectionManager';

describe('Table - AddCol', () => {
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

    range.setStartBefore(wwe.get$Body().find('tbody td')[1].firstChild);
    range.collapse(true);

    sq.setSelection(range);
    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddCol.exec(wwe);

    expect(wwe.get$Body().find('thead th').length).toBe(3);
    expect(wwe.get$Body().find('tbody td').length).toBe(3);
    expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('tbody td')[2]);
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

    range.setStartAfter(wwe.get$Body().find('tbody td')[0].firstChild);
    range.setEndAfter(wwe.get$Body().find('tbody td')[1].firstChild);
    sq.setSelection(range);

    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddCol.exec(wwe);

    expect(wwe.get$Body().find('thead th').length).toBe(4);
    expect(wwe.get$Body().find('tbody td').length).toBe(4);
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

    range.setStartBefore(wwe.get$Body().find('thead th')[0].firstChild);
    range.collapse(true);

    sq.setSelection(range);
    sq._updatePathOnEvent(); // squire need update path for hasFormatWithRx

    AddCol.exec(wwe);

    expect(wwe.get$Body().find('thead th').length).toBe(3);
    expect(wwe.get$Body().find('tbody td').length).toBe(3);
    expect(sq.getSelection().startContainer).toBe(wwe.get$Body().find('thead th')[1]);
  });
});
