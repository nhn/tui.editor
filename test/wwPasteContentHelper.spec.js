/**
 * @fileoverview test wysiwyg paste content helper
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import WysiwygEditor from '../src/js/wysiwygEditor';
import EventManager from '../src/js/eventManager';
import WwPasteContentHelper from '../src/js/wwPasteContentHelper';
import WwCodeBlockManager from '../src/js/wwCodeBlockManager';
import WwTableManager from '../src/js/wwTableManager';

describe('WwPasteContentHelper', () => {
  let wwe, pch;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();

    wwe.getEditor().focus();

    wwe.componentManager.addManager(WwCodeBlockManager);
    wwe.componentManager.addManager(WwTableManager);

    pch = new WwPasteContentHelper(wwe);
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('paste data first aid', () => {
    const blockTags = 'div, section, article, aside, nav, menus, p';

    it('_removeStyles should remove styles of node', () => {
      const $node = $('<div style="border: 1px solid #f00">TEST</div>');
      pch._removeStyles($node);

      expect($node.attr('style')).not.toBeDefined();
    });

    it('_removeStyles should not remove color style of span', () => {
      const $node = $('<span style="color:#f00;border: 1px solid #f00">TEST</span>');
      pch._removeStyles($node);

      expect($node.attr('style')).toBeDefined();
      expect($node.css('border')).toBeFalsy();
      expect($node.css('color')).toBeTruthy();
    });

    it('_removeStyles should unwrap span without color style', () => {
      const $node = $('<div><span>TEST</span></div>');

      pch._removeStyles($node.find('span'));

      expect($node.find('span').length).toEqual(0);
    });

    it('_removeUnnecessaryBlocks should unwrap unnecessary blocks', () => {
      const $node = $('<div><div><span>TEST</span></div></div>');

      pch._removeUnnecessaryBlocks($node, blockTags);

      expect($node.find('div').length).toEqual(1);
    });

    it('_removeUnnecessaryBlocks should not unwrap block in LI', () => {
      const $node = $('<ul><li><div>TEST</div></li></ul>');

      pch._removeUnnecessaryBlocks($node, blockTags);

      expect($node.find('li').length).toEqual(1);
      expect($node.find('div').length).toEqual(1);
    });

    it('_removeUnnecessaryBlocks should not unwrap block in Task', () => {
      const $node = $('<ul><li class="task-list-item"><div>TEST</div></li></ul>');

      pch._removeUnnecessaryBlocks($node, blockTags);

      expect($node.find('li').length).toEqual(1);
      expect($node.find('div').length).toEqual(1);
    });

    it('_removeUnnecessaryBlocks should unwrap block in Task', () => {
      const $node = $('<ul><li><section>TEST</section></li></ul>');

      pch._removeUnnecessaryBlocks($node, blockTags);

      expect($node.find('li').length).toEqual(1);
      expect($node.find('section').length).toEqual(0);
    });
    it('_removeUnnecessaryBlocks should not unwrap div in blockquote', () => {
      const $node = $('<blockquote><div>hello<br></div><div>-simon<br></div></li></blockquote>');

      pch._removeUnnecessaryBlocks($node, blockTags);

      const divs = $node.find('div');

      expect(divs.length).toEqual(2);
      expect(divs.eq(0).text()).toEqual('hello');
      expect(divs.eq(1).text()).toEqual('-simon');
    });
    it('_removeUnnecessaryBlocks should unwrap p', () => {
      const $container = $('<div />');
      const $node = $('<p><span>hello</span><span>-simon</span></p>');

      $container.append($node);

      pch._removeUnnecessaryBlocks($container, blockTags);

      const spans = $container.find('span');
      expect(spans.length).toEqual(2);
      expect($node.find('p').length).toEqual(0);
      expect(spans.eq(0).text()).toEqual('hello');
      expect(spans.eq(1).text()).toEqual('-simon');
    });
    it('_removeUnnecessaryBlocks should not unwrap div without block element child', () => {
      const $container = $('<div />');
      const $node = $('<div>asdasd<br /></div><div><nav>asd</nav></div>');

      $container.append($node);

      pch._removeUnnecessaryBlocks($container, blockTags);

      expect($container.children().length).toEqual(2);
      expect($container.find('div').length).toEqual(1);
      expect($container.find('div').text()).toEqual('asdasd');
    });
    it('_unwrapNestedBlocks should unwrap nested blockTags', () => {
      const $container = $('<div />');
      const $node = $('<article></article>');

      $node.append('<div>hello<br /></div>');
      $node.append('<nav>simon</nav>');

      $container.append($node);

      pch._unwrapNestedBlocks($container, blockTags);

      expect($container.find('article').length).toEqual(0);
      expect($container.find('div').length).toEqual(1);
      expect($container.find('div').text()).toEqual('hello');
      expect($container.find('nav').length).toEqual(1);
      expect($container.find('nav').text()).toEqual('simon');
    });
    it('_preElementAid should make pre tag content that has element to useful', () => {
      const $container = $('<div />');
      const $node = $('<pre><div><span>TEST</span></div></pre>');

      $container.append($node);

      pch._preElementAid($container);

      expect($node.find('code').length).toEqual(0);
      expect($node.find('span').length).toEqual(0);
      expect($node.find('div').length).toEqual(1);
      expect($node.find('div').eq(0).text()).toEqual('TEST');
    });
    it('_preElementAid should make pre tag content that has only text to useful', () => {
      const $container = $('<div />');
      const $node = $('<pre>TEST\nTEST2</pre>');

      $container.append($node);

      pch._preElementAid($container);

      expect($node.find('div').length).toEqual(2);
      expect($node.find('div').eq(0).text()).toEqual('TEST');
      expect($node.find('div').eq(1).text()).toEqual('TEST2');
    });

    it('_wrapOrphanNodeWithDiv should wrap orphan nodes with div element', () => {
      const $container = $('<div />');

      $container.append($('<span>text1</span>text2<br>text3<code>text4</code>'));

      $container.html(pch._wrapOrphanNodeWithDiv($container));

      expect($container.find('div').length).toEqual(2);
    });
    it('_wrapOrphanNodeWithDiv should wrap orphan nodes with div element', () => {
      const $container = $('<div />');

      $container.append(document.createTextNode('ip lorem sit amet'));
      $container.append(document.createElement('br'));
      $container.append(document.createTextNode('and so on'));
      $container.append(document.createElement('br'));

      $container.html(pch._wrapOrphanNodeWithDiv($container));

      expect($container.find('div').length).toEqual(2);
      expect($container.find('br').length).toEqual(4);
      expect($container.find('div')[0].innerHTML).toEqual('ip lorem sit amet<br>');
      expect($container.find('div')[1].innerHTML).toEqual('and so on<br>');
    });
    it('_wrapOrphanNodeWithDiv should not wrap block element nodes', () => {
      const $container = $('<div />');

      $container.html('<p>ip lorem sit amet</p><br><span>and so on</span>');

      $container.html(pch._wrapOrphanNodeWithDiv($container));

      expect($container.find('div').length).toEqual(1);
      expect($container.find('p').length).toEqual(1);
      expect($container.find('span').length).toEqual(1);
      expect($container.find('br').length).toEqual(1);
      expect($container.find('p').text()).toEqual('ip lorem sit amet');
      expect($container.find('span').text()).toEqual('and so on');
    });
    it('_unwrapIfNonBlockElementHasBr should unwrap span element with br', () => {
      const $container = $('<div />');

      $container.html('<span>ip lorem sit amet<br /></span><span>and so on</span>');

      pch._unwrapIfNonBlockElementHasBr($container);

      expect($container.find('span').length).toEqual(1);
      expect($container.find('br').length).toEqual(1);
      expect($container.text()).toEqual('ip lorem sit ametand so on');
      expect($container.find('span').eq(0).text()).toEqual('and so on');
    });
    it('_unwrapIfNonBlockElementHasBr should unwrap b, i, em, s element with br', () => {
      const $container = $('<div />');

      $container.html('<b>ip lorem sit amet<br /></b><i>and so on<br /></i>' +
                '<s>la vita dolce<br /></s><em>carpe diem<br /></em>');

      pch._unwrapIfNonBlockElementHasBr($container);

      expect($container.find('i').length).toEqual(0);
      expect($container.find('b').length).toEqual(0);
      expect($container.find('s').length).toEqual(0);
      expect($container.find('em').length).toEqual(0);
      expect($container.find('br').length).toEqual(4);
      expect($container.text()).toEqual('ip lorem sit ametand so onla vita dolcecarpe diem');
    });
    it('_tableElementAid should wrap TRs with TBODY', () => {
      const $container = $('<div />');

      $container.html('<tr><td>1</td><td>2</td></tr>');

      pch._tableElementAid($container);

      expect($container.find('tbody').length).toEqual(1);
      expect($container.find('tbody').text()).toEqual('12');
      expect($container.find('table')[0].className).toEqual('te-content-table-0');
    });
    it('_tableElementAid should wrap TDs with TR', () => {
      const $container = $('<div />');

      $container.html('<td>1</td><td>2</td><td>3</td><td>4</td>');

      pch._tableElementAid($container);

      expect($container.find('thead').length).toEqual(1);
      expect($container.find('tbody').length).toEqual(1);
      expect($container.find('tr').length).toEqual(2);
      expect($container.find('tr').text()).toEqual('1234');
      expect($container.find('table')[0].className).toEqual('te-content-table-0');
    });
    it('_tableElementAid should wrap THEAD and TBODY with TABLE', () => {
      const $container = $('<div />');

      $container.html('<thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody>');

      pch._tableElementAid($container);

      expect($container.find('table').length).toEqual(1);
      expect($container.find('thead').length).toEqual(1);
      expect($container.find('tbody').length).toEqual(1);
      expect($container.find('thead').text()).toEqual('12');
      expect($container.find('tbody').text()).toEqual('ab');
      expect($container.find('table')[0].className).toEqual('te-content-table-0');
    });
    it('_tableElementAid should remove colgroup', () => {
      const $container = $('<div />');

      $container.html('<table><thead><tr><th>1</th><th>2</th></tr></thead><colgroup></colgroup><tbody><tr><td>a</td><td>b</td></tr></tbody></table>');

      pch._tableElementAid($container);

      expect($container.find('table').length).toEqual(1);
      expect($container.find('colgroup').length).toEqual(0);
    });
    it('_tableElementAid should update table ID class name', () => {
      const $container = $('<div />');

      $container.html('<table><thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody></table>');

      pch._tableElementAid($container);

      expect($container.find('table').length).toEqual(1);
      expect($container.find('table')[0].className).toEqual('te-content-table-0');

      pch._tableElementAid($container);

      expect($container.find('table')[0].className).toEqual('te-content-table-1');
    });
    it('_tableElementAid should update all table ID class name in container', () => {
      const $container = $('<div />');
      const html = '<table><thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody></table>' +
                  '<table><thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody></table>';

      $container.html(html);

      pch._tableElementAid($container);

      expect($container.find('table').length).toEqual(2);
      expect($container.find('table')[0].className).toEqual('te-content-table-0');
      expect($container.find('table')[1].className).toEqual('te-content-table-1');

      pch._tableElementAid($container);

      expect($container.find('table')[0].className).toEqual('te-content-table-2');
      expect($container.find('table')[1].className).toEqual('te-content-table-3');
    });
  });

  describe('get html string of range content', () => {
    it('unrwap first child for paste as inline', () => {
      const $container = $('<div />');

      $container.html('<div>text<b>text2</b><br></div>');

      pch.preparePaste($container);

      expect($container[0].childNodes.length).toEqual(2);
      expect($container[0].childNodes[0].nodeType).toEqual(Node.TEXT_NODE);
      expect($container[0].childNodes[1].tagName).toEqual('B');
    });

    describe('List', () => {
      beforeEach(() => {
        wwe.getEditor().focus();
      });

      it('if content have orphan list and has format li then make depth based on current selection', () => {
        const $container = $('<div />');

        $container.html('<li><div>text<br></div></li><li><div>text2<br></div></li>');

        wwe.getEditor().setHTML('<ul><li><div>list1</div></li><li>list2</li></ul>');

        const range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[0].childNodes[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste($container);

        expect($container[0].childNodes.length).toEqual(1);
        expect($container[0].childNodes[0].tagName).toEqual('UL');
        expect($container[0].childNodes[0].childNodes.length).toEqual(2);
      });

      it('if content have complete list and has format li then make depth based on current selection', () => {
        const $container = $('<div />');

        $container.html('<ul><li><div>text<br></div></li><li><div>text2<br></div></li></ul>');

        wwe.getEditor().setHTML('<ul><li><div>text0<br/></div>' +
                    '<ul><li><div>list1</div></li><li>list2</li></ul></li>' +
                    '</ul>');

        const range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('ul li ul li div')[0].childNodes[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste($container);

        expect($container[0].childNodes.length).toEqual(1);
        expect($container[0].childNodes[0].tagName).toEqual('UL');
        expect($($container[0].childNodes[0]).find('li > ul > li > ul > li').length).toEqual(2);
      });

      it('if content have orphan list and hasnt format li then wrap list parent based on rangeInfo', () => {
        const $container = $('<div />');

        $container.html('<li><div>text<br></div></li><li><div>text2<br></div></li>');

        wwe.getEditor().setHTML('<div><br></div>');

        const range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste($container);

        expect($container[0].childNodes.length).toEqual(1);
        expect($container[0].childNodes[0].tagName).toEqual('UL');
        expect($container[0].childNodes[0].childNodes.length).toEqual(2);
      });

      it('if content have complete list and hasnt format li then do nothing', () => {
        const $container = $('<div />');

        $container.html('<ul><li><div>text<br></div></li><li><div>text2<br></div></li></ul>');

        wwe.getEditor().setHTML('<div><br></div>');

        const range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste($container);

        expect($container[0].childNodes.length).toEqual(1);
        expect($container[0].childNodes[0].tagName).toEqual('UL');
        expect($container[0].childNodes[0].childNodes.length).toEqual(2);
      });

      it('paste data have backward depth list then limit list depth level', () => {
        const $container = $('<div />');
        $container.html('<ul><li><div>text<br></div></li><li>' +
                                '<div>text2<br></div></li></ul><li><div>myText<br></div></li>');

        wwe.getEditor().setHTML('<ul><li><div>list1</div></li><li>list2</li></ul>');

        const range = wwe.getEditor().getSelection().cloneRange();

        range.setStart(wwe.get$Body().find('div')[0].childNodes[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste($container);

        expect($container[0].childNodes.length).toEqual(1);
        expect($container[0].childNodes[0].tagName).toEqual('UL');
        expect($($container[0].childNodes[0]).find('li > ul > li').length).toEqual(2);
      });
    });
  });
});
