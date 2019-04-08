/**
 * @fileoverview test wysiwyg table command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Table from '../../../src/js/wysiwygCommands/table';
import tableManager from '../../../src/js/wwTableManager';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import EventManager from '../../../src/js/eventManager';

describe('Table', () => {
  let wwe;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();
    wwe.componentManager.addManager('table', tableManager);
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('add Table 2x2', () => {
    Table.exec(wwe, 2, 2);

    expect(wwe.get$Body().find('thead tr th').length).toEqual(2);
    expect(wwe.get$Body().find('tbody tr').eq(0).find('td').length).toEqual(2);
  });

  it('add Table 4x3', () => {
    Table.exec(wwe, 4, 3);

    expect(wwe.get$Body().find('thead tr th').length).toEqual(4);
    expect(wwe.get$Body().find('tbody tr').eq(0).find('td').length).toEqual(4);
    expect(wwe.get$Body().find('tbody tr').eq(1).find('td').length).toEqual(4);
  });

  it('table have class', () => {
    Table.exec(wwe, 4, 3);

    expect(wwe.get$Body().find('table').attr('class')).toBeDefined();
  });

  it('first th in table have focus', () => {
    Table.exec(wwe, 4, 3);

    expect(wwe.getEditor().getSelection().startContainer).toBe(wwe.get$Body().find('th')[0]);
  });

  it('add initial data', () => {
    Table.exec(wwe, 2, 3, ['a', 'b', 'c', 'd', 'e', 'f']);
    expect(wwe.get$Body().find('thead tr').eq(0).find('th').eq(0).text()).toEqual('a');
    expect(wwe.get$Body().find('thead tr').eq(0).find('th').eq(1).text()).toEqual('b');
    expect(wwe.get$Body().find('tbody tr').eq(0).find('td').eq(0).text()).toEqual('c');
    expect(wwe.get$Body().find('tbody tr').eq(0).find('td').eq(1).text()).toEqual('d');
    expect(wwe.get$Body().find('tbody tr').eq(1).find('td').eq(0).text()).toEqual('e');
    expect(wwe.get$Body().find('tbody tr').eq(1).find('td').eq(1).text()).toEqual('f');
    expect(wwe.getEditor().getSelection().startContainer).not.toBe(wwe.get$Body().find('th')[0]);
  });
});
