/**
 * @fileoverview test wysiwyg table remove command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import RemoveTable from '@/wysiwygCommands/tableRemove';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Table - Remove', () => {
  let container, wwe;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('remove table that have selected', () => {
    const sq = wwe.getEditor(),
      range = sq.getSelection().cloneRange();

    sq.setHTML(
      [
        '<table>',
        '<thead>',
        '<tr><th>1</th><th>2</th></tr>',
        '</thead>',
        '<tbody>',
        '<tr><td>3</td><td>4</td></tr>',
        '<tr><td>5</td><td>6</td></tr>',
        '</tbody>',
        '</table>'
      ].join('\n')
    );

    range.setStartAfter(wwe.getBody().querySelector('tbody td').firstChild);
    range.collapse(true);

    sq.setSelection(range);

    RemoveTable.exec(wwe);

    expect(wwe.getBody().querySelectorAll('table').length).toEqual(0);
  });
});
