/**
 * @fileoverview test wysiwyg list manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwListManager from '@/wwListManager';
import WwTaskManager from '@/wwTaskManager';
import WwTableSelectionManager from '@/wwTableSelectionManager';

describe('WwListManager', () => {
  let container, em, wwe, mgr;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();

    wwe = new WysiwygEditor(container, em);

    wwe.init();

    wwe.componentManager.addManager(WwTaskManager);
    wwe.componentManager.addManager(WwTableSelectionManager);
    mgr = new WwListManager(wwe);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  describe('_findAndRemoveEmptyList()', () => {
    it('remove ul that without li element within.', () => {
      wwe.setValue(['<ul>this will deleted</ul>', '<ol>and this too</ol>'].join(''));

      expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
      expect(wwe.getBody().querySelectorAll('ol').length).toEqual(1);

      mgr._findAndRemoveEmptyList();

      expect(wwe.getBody().querySelectorAll('ul').length).toEqual(0);
      expect(wwe.getBody().querySelectorAll('ol').length).toEqual(0);
    });
    it('do not remove when ul have li element within.', () => {
      wwe.setValue(
        [
          '<ul>',
          '<li><div>survived!</div></li>',
          '</ul>',
          '<ol>',
          '<li><div>me too!</div></li>',
          '</ol>'
        ].join('')
      );

      expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
      expect(wwe.getBody().querySelectorAll('ol').length).toEqual(1);

      mgr._findAndRemoveEmptyList();

      expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
      expect(wwe.getBody().querySelector('ul li').textContent).toEqual('survived!');
      expect(wwe.getBody().querySelector('ol li').textContent).toEqual('me too!');
    });
  });

  describe('convert from/to arbitrary nesting list', () => {
    it('_convertToArbitraryNestingList should convert nested ul to arbitrary nested ul', () => {
      expect(
        mgr._convertToArbitraryNestingList('<ul><li>text<ul><li>text2</li></ul></li></ul>')
      ).toBe('<ul><li>text</li><ul><li>text2</li></ul></ul>');
    });

    it('_convertFromArbitraryNestingList should convert nested ul to arbitrary nested ul', () => {
      expect(
        mgr._convertFromArbitraryNestingList('<ul><li>text</li><ul><li>text2</li></ul></ul>')
      ).toBe('<ul><li>text<ul><li>text2</li></ul></li></ul>');
    });

    it('should be called _convertToArbitraryNestingList on wysiwygSetValueBefore', () => {
      const standardList = '<ul><li>text<ul><li>text2</li></ul></li></ul>';

      const arbitraryList = em.emitReduce('wysiwygSetValueBefore', standardList);

      expect(arbitraryList).toBe('<ul><li>text</li><ul><li>text2</li></ul></ul>');
    });

    it('should be called _convertFromArbitraryNestingList on wysiwygProcessHTMLText', () => {
      const standardList = '<ul><li>text</li><ul><li>text2</li></ul></ul>';

      const arbitraryList = em.emitReduce('wysiwygProcessHTMLText', standardList);

      expect(arbitraryList).toBe('<ul><li>text<ul><li>text2</li></ul></li></ul>');
    });
  });

  describe('_removeBranchListAll', () => {
    it('Remove all branch list', () => {
      wwe
        .getEditor()
        .setHTML(
          [
            '<ul>',
            '<li>',
            '<div>t1<br></div>',
            '<ul>',
            '<li>',
            '<ul>',
            '<li>',
            '<div>t2<br></div>',
            '<ul>',
            '<li><div>t3<br></div></li>',
            '<li><div>t4<br></div></li>',
            '</ul>',
            '</li>',
            '</ul>',
            '</li>',
            '<li><div>t5</div></li>',
            '</ul>',
            '</li>',
            '</ul>'
          ].join('')
        );
      mgr._removeBranchListAll();

      expect(wwe.getBody().querySelectorAll('ul').length).toEqual(3);
      expect(
        $(wwe.getBody())
          .find('ul li ul')
          .eq(0)
          .children('li').length
      ).toEqual(2);
      expect(
        $(wwe.getBody())
          .find('ul li ul')
          .eq(0)
          .children('li')
          .eq(0)
          .children('div')
          .text()
      ).toEqual('t2');
      expect(
        $(wwe.getBody())
          .find('ul li ul')
          .eq(0)
          .children('li')
          .eq(1)
          .text()
      ).toEqual('t5');
    });

    it('Dont break to contentEditable root body', () => {
      wwe
        .getEditor()
        .setHTML(
          [
            '<div>',
            '<ul>',
            '<li>',
            '<ul class="first">',
            '<li><div>t1<br></div></li>',
            '<li><div>t2<br></div></li>',
            '<li><div>t3<br></div></li>',
            '</ul>',
            '</li>',
            '<li><div>t4</div></li>',
            '</ul>',
            '</div>'
          ].join('')
        );

      mgr._removeBranchListAll();

      expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
      expect(
        $(wwe.getBody())
          .find('ul li ul')
          .eq(0)
          .children('li').length
      ).toEqual(0);
      expect($(wwe.getBody()).children('div').length).toEqual(1);
    });

    it('Dont remove correct list with text node', () => {
      wwe
        .getEditor()
        .setHTML(
          [
            '<ul>',
            '<li>',
            't1',
            '<ul>',
            '<li><div>t3<br></div></li>',
            '<li><div>t4<br></div></li>',
            '</ul>',
            '</li>',
            '</ul>'
          ].join('')
        );
      mgr._removeBranchListAll();

      expect(wwe.getBody().querySelectorAll('ul').length).toEqual(2);
      expect(
        $(wwe.getBody())
          .find('ul li ul')
          .eq(0)
          .children('li').length
      ).toEqual(2);
      expect(
        $(wwe.getBody())
          .find('ul li ul')
          .eq(0)
          .children('li')
          .eq(0)
          .children('div')
          .text()
      ).toEqual('t3');
      expect(
        $(wwe.getBody())
          .find('ul li ul')
          .eq(0)
          .children('li')
          .eq(1)
          .text()
      ).toEqual('t4');
    });
  });

  describe('_unwrap', () => {
    it('should unwrap itself and preserve the children', () => {
      const arbitraryNestingList = $(`
        <ul id="first">
          <ul id="second">
            <li>arbitrary nesting list item</li>
            <li>arbitrary nesting list item</li>
          </ul>
        </ul>`).get(0);

      mgr._unwrap(arbitraryNestingList.querySelector('ul ul'));

      // <ul id="first">
      //   <li>arbitrary nesting list item</li>
      //   <li>arbitrary nesting list item</li>
      // </ul>
      expect(arbitraryNestingList.querySelector('ul ul')).toBeFalsy();
    });
  });

  describe('mergeList', () => {
    it('should merge list to previous list', () => {
      const [list] = $(`
                <ol>
                    <li>1</li>
                    <ul>
                        <li>2</li>
                    </ul>
                    <ol>
                        <li id="target">3</li>
                        <li>4</li>
                    </ol>
                </ol>
            `);

      mgr.mergeList(list.querySelector('#target'));

      // <ol>
      //   <li>1</li>
      //   <ul>
      //     <li>2</li>
      //     <li id="target">3</li>
      //     <li>4</li>
      //   </ul>
      // </ol>
      expect(list.querySelectorAll('ol > ul > li').length).toBe(3);
      expect(list.querySelectorAll('ol > ol').length).toBe(0);
    });

    it('should not merge list to previous list if target is not the first list item', () => {
      const [list] = $(`
                <ol>
                    <li>1</li>
                    <ul>
                        <li>2</li>
                    </ul>
                    <ol>
                        <li>3</li>
                        <li id="target">4</li>
                    </ol>
                </ol>
            `);

      mgr.mergeList(list.querySelector('#target'));

      // <ol>
      //   <li>1</li>
      //   <ul>
      //     <li>2</li>
      //   </ul>
      //   <ol>
      //     <li>3</li>
      //     <li id="target">4</li>
      //   </ol>
      // </ol>
      expect(list.querySelectorAll('ol > ul > li').length).toBe(1);
      expect(list.querySelectorAll('ol > ol > li').length).toBe(2);
    });

    it('should merge next list', () => {
      // merge rule: merge to previous list
      const [list] = $(`
                <ol>
                    <li>1</li>
                    <ol>
                        <li id="target">2</li>
                    </ol>
                    <ul>
                        <li>3</li>
                        <li>4</li>
                    </ul>
                </ol>
            `);

      mgr.mergeList(list.querySelector('#target'));

      // <ol>
      //   <li>1</li>
      //   <ol>
      //     <li id="target">2</li>
      //     <li>3</li>
      //     <li>4</li>
      //   </ol>
      // </ol>
      expect(list.querySelectorAll('ol > ol > li').length).toBe(3);
      expect(list.querySelectorAll('ol > ul').length).toBe(0);
    });

    it('should merge prev/next list', () => {
      // merge rule: merge to previous list
      const [list] = $(`
                <ol>
                    <li>1</li>
                    <ul>
                        <li>2</li>
                        <li>3</li>
                    </ul>
                    <ol>
                        <li id="target">4</li>
                    </ol>
                    <ul>
                        <li>5</li>
                        <li>6</li>
                    </ul>
                </ol>
            `);

      mgr.mergeList(list.querySelector('#target'));

      // <ol>
      //   <li>1</li>
      //   <ul>
      //     <li>2</li>
      //     <li>3</li>
      //     <li id="target">4</li>
      //     <li>5</li>
      //     <li>6</li>
      //   </ul>
      // </ol>
      expect(list.querySelectorAll('ol > ul > li').length).toBe(5);
      expect(list.querySelectorAll('ol > ul').length).toBe(1);
      expect(list.querySelectorAll('ol > ol').length).toBe(0);
    });
  });

  describe('_insertDataToMarkPassForListInTable', () => {
    it('should insert data-tomark-pass attribute in list that is located inside table', () => {
      const html = [
        '<table><thead><tr><th>',
        '<ul><li>123<br></li></ul>',
        '456<br>',
        '<ol><li>789<br></li></ol>',
        '</th></tr></thead>',
        '<tbody><tr><td>',
        '<ul><li>123<br></li></ul>',
        '456<br>',
        '<ol><li>789<br></li></ol>',
        '</td></tr></tbody></table>'
      ].join('');

      const result = mgr._insertDataToMarkPassForListInTable(html);

      const expectedHtml = [
        '<table><thead><tr><th>',
        '<ul data-tomark-pass="" ><li data-tomark-pass="" >123<br></li></ul>',
        '456<br>',
        '<ol data-tomark-pass="" ><li data-tomark-pass="" >789<br></li></ol>',
        '</th></tr></thead>',
        '<tbody><tr><td>',
        '<ul data-tomark-pass="" ><li data-tomark-pass="" >123<br></li></ul>',
        '456<br>',
        '<ol data-tomark-pass="" ><li data-tomark-pass="" >789<br></li></ol>',
        '</td></tr></tbody></table>'
      ].join('');

      expect(result).toEqual(expectedHtml);
    });
  });

  describe('createListInTable', () => {
    it('make UL in empty td', () => {
      const html =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td><br></td></tr></tbody></table>';

      $(wwe.getBody()).html(html);

      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[0], 0);
      range.collapse(true);

      mgr.createListInTable(range, 'UL');

      const expectedHtml =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ul><li><br></li></ul>' +
        '</td></tr></tbody></table>';

      expect($(wwe.getBody()).html()).toEqual(expectedHtml);
    });

    it('make TASK in empty td', () => {
      const html =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td><br></td></tr></tbody></table>';

      $(wwe.getBody()).html(html);

      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[0], 0);
      range.collapse(true);

      mgr.createListInTable(range, 'TASK');

      const expectedHtml =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ul><li class="task-list-item" data-te-task=""><br></li></ul>' +
        '</td></tr></tbody></table>';

      expect($(wwe.getBody()).html()).toEqual(expectedHtml);
    });

    it('make UL in td when select multi lines', () => {
      const html =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '123<br>345' +
        '</td></tr></tbody></table>';

      $(wwe.getBody()).html(html);

      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[0].childNodes[0], 1);
      range.setEnd(wwe.getBody().querySelectorAll('td')[0].childNodes[2], 2);

      mgr.createListInTable(range, 'UL');

      const expectedHtml =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ul><li>123<br></li><li>345</li></ul>' +
        '</td></tr></tbody></table>';

      expect($(wwe.getBody()).html()).toEqual(expectedHtml);
    });

    it('make UL in td when select just text line before OL', () => {
      const html =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ol><li>123<br></li></ol>' +
        '345</td></tr></tbody></table>';

      $(wwe.getBody()).html(html);

      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[0].childNodes[1], 2);
      range.collapse(true);

      mgr.createListInTable(range, 'UL');

      const expectedHtml =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ol><li>123<br></li></ol>' +
        '<ul><li>345</li></ul>' +
        '</td></tr></tbody></table>';

      expect($(wwe.getBody()).html()).toEqual(expectedHtml);
    });

    it('merge UL in td when select just text line', () => {
      const html =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ul><li>123<br></li></ul>' +
        '345' +
        '</td></tr></tbody></table>';

      $(wwe.getBody()).html(html);

      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[0].childNodes[1], 2);
      range.collapse(true);

      mgr.createListInTable(range, 'UL');

      const expectedHtml =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ul><li>123<br></li><li>345</li></ul>' +
        '</td></tr></tbody></table>';

      expect($(wwe.getBody()).html()).toEqual(expectedHtml);
    });

    it('merge UL in td when select multi lines with UL', () => {
      const html =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ul><li>123<br></li></ul>' +
        '345' +
        '</td></tr></tbody></table>';

      $(wwe.getBody()).html(html);

      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('li')[0].childNodes[0], 1);
      range.setEnd(wwe.getBody().querySelectorAll('td')[0].childNodes[1], 2);

      mgr.createListInTable(range, 'UL');

      const expectedHtml =
        '<table><thead><tr><th><br></th></tr></thead><tbody><tr><td>' +
        '<ul><li>123<br></li><li>345</li></ul>' +
        '</td></tr></tbody></table>';

      expect($(wwe.getBody()).html()).toEqual(expectedHtml);
    });

    it('make OL in td when select multi lines with UL', () => {
      const html =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ul><li>123<br></li><li>345</li></ul>' +
        '789' +
        '</td></tr></tbody></table>';

      $(wwe.getBody()).html(html);

      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('li')[1].childNodes[0], 1);
      range.setEnd(wwe.getBody().querySelectorAll('td')[0].childNodes[1], 2);

      mgr.createListInTable(range, 'OL');

      const expectedHtml =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ol><li>123<br></li><li>345</li><li>789</li></ol>' +
        '</td></tr></tbody></table>';

      expect($(wwe.getBody()).html()).toEqual(expectedHtml);
    });

    it('make UL in td when select one line that is loacated between two list ', () => {
      const html =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ul><li>123<br></li></ul>' +
        '456<br>' +
        '<ul><li>789<br></li></ul>' +
        '</td></tr></tbody></table>';

      $(wwe.getBody()).html(html);

      const range = wwe.getEditor().getSelection();

      range.setStart(wwe.getBody().querySelectorAll('td')[0].childNodes[1], 1);
      range.collapse(true);

      mgr.createListInTable(range, 'UL');

      const expectedHtml =
        '<table><thead><tr><th><br></th></tr></thead>' +
        '<tbody><tr><td>' +
        '<ul><li>123<br></li><li>456<br></li><li>789<br></li></ul>' +
        '</td></tr></tbody></table>';

      expect($(wwe.getBody()).html()).toEqual(expectedHtml);
    });
  });
});
