/**
 * @fileoverview test wysiwyg paste content helper
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwPasteContentHelper from '@/wwPasteContentHelper';
import WwCodeBlockManager from '@/wwCodeBlockManager';
import WwTableManager from '@/wwTableManager';
import htmlSanitizer from '@/htmlSanitizer';

describe('WwPasteContentHelper', () => {
  let container, wwe, pch, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('sanitizer');
    const sanitizer = content => {
      spy();
      return htmlSanitizer(content, true);
    };

    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager(), { sanitizer });

    wwe.init();

    wwe.getEditor().focus();

    wwe.componentManager.addManager(WwCodeBlockManager);
    wwe.componentManager.addManager(WwTableManager);

    pch = new WwPasteContentHelper(wwe);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('paste data first aid', () => {
    const blockTags = 'div, section, article, aside, nav, menus, p';

    it('_removeStyles should remove styles of node', () => {
      const $node = $('<div style="border: 1px solid #f00">TEST</div>');

      pch._removeStyles($node.get(0));

      expect($node.attr('style')).not.toBeDefined();
    });

    it('_removeStyles should not remove color style of span', () => {
      const $node = $('<span style="color:#f00;border: 1px solid #f00">TEST</span>');

      pch._removeStyles($node.get(0));

      expect($node.attr('style')).toBeDefined();
      expect($node.css('border')).toBeFalsy();
      expect($node.css('color')).toBeTruthy();
    });

    it('_removeStyles should unwrap span without color style', () => {
      const $node = $('<div><span>TEST</span></div>');

      pch._removeStyles($node.find('span').get(0));

      expect($node.find('span').length).toEqual(0);
    });

    it('_removeStyles should unwrap span with default color (#222) style', () => {
      const $node = $(
        '<div><span style="color:#222;"><span style="color:red;">TEST</span></span></div>'
      );

      pch._removeStyles($node.find('span').get(0));

      expect($node.find('span').length).toEqual(1);
    });

    it('_removeUnnecessaryBlocks should unwrap unnecessary blocks', () => {
      const $node = $('<div><div><span>TEST</span></div></div>');

      pch._removeUnnecessaryBlocks($node.get(0), blockTags);

      expect($node.find('div').length).toEqual(1);
    });

    it('_removeUnnecessaryBlocks should not unwrap block in LI', () => {
      const $node = $('<ul><li><div>TEST</div></li></ul>');

      pch._removeUnnecessaryBlocks($node.get(0), blockTags);

      expect($node.find('li').length).toEqual(1);
      expect($node.find('div').length).toEqual(1);
    });

    it('_removeUnnecessaryBlocks should not unwrap block in Task', () => {
      const $node = $('<ul><li class="task-list-item"><div>TEST</div></li></ul>');

      pch._removeUnnecessaryBlocks($node.get(0), blockTags);

      expect($node.find('li').length).toEqual(1);
      expect($node.find('div').length).toEqual(1);
    });

    it('_removeUnnecessaryBlocks should unwrap block in Task', () => {
      const $node = $('<ul><li><section>TEST</section></li></ul>');

      pch._removeUnnecessaryBlocks($node.get(0), blockTags);

      expect($node.find('li').length).toEqual(1);
      expect($node.find('section').length).toEqual(0);
    });
    it('_removeUnnecessaryBlocks should not unwrap div in blockquote', () => {
      const $node = $('<blockquote><div>hello<br></div><div>-simon<br></div></li></blockquote>');

      pch._removeUnnecessaryBlocks($node.get(0), blockTags);

      const divs = $node.find('div');

      expect(divs.length).toEqual(2);
      expect(divs.eq(0).text()).toEqual('hello');
      expect(divs.eq(1).text()).toEqual('-simon');
    });
    it('_removeUnnecessaryBlocks should unwrap p', () => {
      const element = $('<div />');
      const $node = $('<p><span>hello</span><span>-simon</span></p>');

      element.append($node);

      pch._removeUnnecessaryBlocks(element.get(0), blockTags);

      const spans = element.find('span');

      expect(spans.length).toEqual(2);
      expect($node.find('p').length).toEqual(0);
      expect(spans.eq(0).text()).toEqual('hello');
      expect(spans.eq(1).text()).toEqual('-simon');
    });

    it('_removeUnnecessaryBlocks should insert br when unwraped block have not br at the last', () => {
      const element = $('<div />');
      const $node = $('<article><span>hello</sapn></article>');

      element.append($node);

      pch._removeUnnecessaryBlocks(element.get(0), blockTags);

      const expctedHtml = '<span>hello</span><br>';

      expect(element.html()).toEqual(expctedHtml);
    });

    it('_removeUnnecessaryBlocks should not unwrap div without block element child', () => {
      const element = $('<div />');
      const $node = $('<div>asdasd<br></div><div><nav>asd</nav></div>');

      element.append($node);

      pch._removeUnnecessaryBlocks(element.get(0), blockTags);

      const expectedHtml = '<div>asdasd<br></div><nav>asd</nav><br>';

      expect(element.html()).toEqual(expectedHtml);
    });
    it('_unwrapNestedBlocks should unwrap nested blockTags', () => {
      const element = $('<div />');
      const $node = $('<article></article>');

      $node.append('<div>hello<br /></div>');
      $node.append('<nav>simon</nav>');

      element.append($node.get(0));

      pch._unwrapNestedBlocks(element.get(0), blockTags);

      expect(element.find('article').length).toEqual(0);
      expect(element.find('div').length).toEqual(1);
      expect(element.find('div').text()).toEqual('hello');
      expect(element.find('nav').length).toEqual(1);
      expect(element.find('nav').text()).toEqual('simon');
    });

    it('_wrapOrphanNodeWithDiv should wrap orphan nodes with div element', () => {
      const element = $('<div />');

      element.append($('<span>text1</span>text2<br>text3<code>text4</code>'));

      element.html(pch._wrapOrphanNodeWithDiv(element.get(0)));

      expect(element.find('div').length).toEqual(2);
    });
    it('_wrapOrphanNodeWithDiv should wrap orphan nodes with div element', () => {
      const element = $('<div />');

      element.append(document.createTextNode('ip lorem sit amet'));
      element.append(document.createElement('br'));
      element.append(document.createTextNode('and so on'));
      element.append(document.createElement('br'));

      element.html(pch._wrapOrphanNodeWithDiv(element.get(0)));

      expect(element.find('div').length).toEqual(2);
      expect(element.find('br').length).toEqual(2);
      expect(element.find('div')[0].innerHTML).toEqual('ip lorem sit amet<br>');
      expect(element.find('div')[1].innerHTML).toEqual('and so on<br>');
    });

    it('_wrapOrphanNodeWithDiv should wrap br node with div element', () => {
      const element = $('<div />');

      element.append(document.createTextNode('text1'));
      element.append(document.createElement('br'));
      element.append(document.createElement('br'));
      element.append(document.createTextNode('text2'));
      element.append(document.createElement('br'));

      element.html(pch._wrapOrphanNodeWithDiv(element.get(0)));

      const expectedHtml = '<div>text1<br></div><div><br></div><div>text2<br></div>';

      expect(element.html()).toEqual(expectedHtml);
    });

    it('_wrapOrphanNodeWithDiv should not wrap block element nodes', () => {
      const element = $('<div />');

      element.html('<p>ip lorem sit amet</p><br><span>and so on</span>');

      element.html(pch._wrapOrphanNodeWithDiv(element.get(0)));

      expect(element.find('div').length).toEqual(2);
      expect(element.find('p').length).toEqual(1);
      expect(element.find('span').length).toEqual(1);
      expect(element.find('br').length).toEqual(1);
      expect(element.find('p').text()).toEqual('ip lorem sit amet');
      expect(element.find('span').text()).toEqual('and so on');
    });
    it('_unwrapIfNonBlockElementHasBr should unwrap span element with br', () => {
      const element = $('<div />');

      element.html('<span>ip lorem sit amet<br /></span><span>and so on</span>');

      pch._unwrapIfNonBlockElementHasBr(element.get(0));

      expect(element.find('span').length).toEqual(1);
      expect(element.find('br').length).toEqual(1);
      expect(element.text()).toEqual('ip lorem sit ametand so on');
      expect(
        element
          .find('span')
          .eq(0)
          .text()
      ).toEqual('and so on');
    });
    it('_unwrapIfNonBlockElementHasBr should unwrap b, i, em, s element with br', () => {
      const element = $('<div />');

      element.html(
        '<b>ip lorem sit amet<br /></b><i>and so on<br /></i>' +
          '<s>la vita dolce<br /></s><em>carpe diem<br /></em>'
      );

      pch._unwrapIfNonBlockElementHasBr(element.get(0));

      expect(element.find('i').length).toEqual(0);
      expect(element.find('b').length).toEqual(0);
      expect(element.find('s').length).toEqual(0);
      expect(element.find('em').length).toEqual(0);
      expect(element.find('br').length).toEqual(4);
      expect(element.text()).toEqual('ip lorem sit ametand so onla vita dolcecarpe diem');
    });
    it('_tableElementAid should wrap TRs with TBODY', () => {
      const element = $('<div />');

      element.html('<tr><td>1</td><td>2</td></tr>');

      pch._tableElementAid(element.get(0));

      expect(element.find('tbody').length).toEqual(1);
      expect(element.find('tbody').text()).toEqual('12');
      expect(element.find('table')[0].className).toEqual('te-content-table-0');
    });
    it('_tableElementAid should wrap TDs with TR', () => {
      const element = $('<div />');

      element.html('<td>1</td><td>2</td><td>3</td><td>4</td>');

      pch._tableElementAid(element.get(0));

      expect(element.find('thead').length).toEqual(1);
      expect(element.find('tbody').length).toEqual(1);
      expect(element.find('tr').length).toEqual(2);
      expect(element.find('tr').text()).toEqual('1234');
      expect(element.find('table')[0].className).toEqual('te-content-table-0');
    });
    it('_tableElementAid should wrap THEAD and TBODY with TABLE', () => {
      const element = $('<div />');

      element.html(
        '<thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody>'
      );

      pch._tableElementAid(element.get(0));

      expect(element.find('table').length).toEqual(1);
      expect(element.find('thead').length).toEqual(1);
      expect(element.find('tbody').length).toEqual(1);
      expect(element.find('thead').text()).toEqual('12');
      expect(element.find('tbody').text()).toEqual('ab');
      expect(element.find('table')[0].className).toEqual('te-content-table-0');
    });
    it('_tableElementAid should remove colgroup', () => {
      const element = $('<div />');

      element.html(
        '<table><thead><tr><th>1</th><th>2</th></tr></thead><colgroup></colgroup><tbody><tr><td>a</td><td>b</td></tr></tbody></table>'
      );

      pch._tableElementAid(element.get(0));

      expect(element.find('table').length).toEqual(1);
      expect(element.find('colgroup').length).toEqual(0);
    });
    it('_tableElementAid should update table ID class name', () => {
      const element = $('<div />');

      element.html(
        '<table><thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody></table>'
      );

      pch._tableElementAid(element.get(0));

      expect(element.find('table').length).toEqual(1);
      expect(element.find('table')[0].className).toEqual('te-content-table-0');

      pch._tableElementAid(element.get(0));

      expect(element.find('table')[0].className).toEqual('te-content-table-1');
    });
    it('_tableElementAid should update all table ID class name in element', () => {
      const element = $('<div />');
      const html =
        '<table><thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody></table>' +
        '<table><thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody></table>';

      element.html(html);

      pch._tableElementAid(element.get(0));

      expect(element.find('table').length).toEqual(2);
      expect(element.find('table')[0].className).toEqual('te-content-table-0');
      expect(element.find('table')[1].className).toEqual('te-content-table-1');

      pch._tableElementAid(element.get(0));

      expect(element.find('table')[0].className).toEqual('te-content-table-2');
      expect(element.find('table')[1].className).toEqual('te-content-table-3');
    });
  });

  describe('get html string of range content', () => {
    describe('List', () => {
      beforeEach(() => {
        wwe.getEditor().focus();
      });

      it('if content have orphan list and has format li then make depth based on current selection', () => {
        const element = $('<div />').get(0);

        element.innerHTML = '<li><div>text<br></div></li><li><div>text2<br></div></li>';

        wwe.getEditor().setHTML('<ul><li><div>list1</div></li><li>list2</li></ul>');

        const range = wwe
          .getEditor()
          .getSelection()
          .cloneRange();

        range.setStart(wwe.getBody().querySelectorAll('div')[0].childNodes[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste(element);

        expect(element.childNodes.length).toEqual(1);
        expect(element.childNodes[0].tagName).toEqual('UL');
        expect(element.childNodes[0].childNodes.length).toEqual(2);
      });

      it('if content have complete list and has format li then make depth based on current selection', () => {
        const element = $('<div />').get(0);

        element.innerHTML = '<ul><li><div>text<br></div></li><li><div>text2<br></div></li></ul>';

        wwe
          .getEditor()
          .setHTML(
            '<ul><li><div>text0<br/></div>' +
              '<ul><li><div>list1</div></li><li>list2</li></ul></li>' +
              '</ul>'
          );

        const range = wwe
          .getEditor()
          .getSelection()
          .cloneRange();

        range.setStart(wwe.getBody().querySelectorAll('ul li ul li div')[0].childNodes[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste(element);

        expect(element.childNodes.length).toEqual(1);
        expect(element.childNodes[0].tagName).toEqual('UL');
        expect($(element.childNodes[0]).find('li > ul > li > ul > li').length).toEqual(2);
      });

      it('if content have orphan list and hasnt format li then wrap list parent based on rangeInfo', () => {
        const element = $('<div />').get(0);

        element.innerHTML = '<li><div>text<br></div></li><li><div>text2<br></div></li>';

        wwe.getEditor().setHTML('<div><br></div>');

        const range = wwe
          .getEditor()
          .getSelection()
          .cloneRange();

        range.setStart(wwe.getBody().querySelectorAll('div')[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste(element);

        expect(element.childNodes.length).toEqual(1);
        expect(element.childNodes[0].tagName).toEqual('UL');
        expect(element.childNodes[0].childNodes.length).toEqual(2);
      });

      it('if content have complete list and has not format li then do nothing', () => {
        const element = $('<div />').get(0);

        element.innerHTML = '<ul><li><div>text<br></div></li><li><div>text2<br></div></li></ul>';

        wwe.getEditor().setHTML('<div><br></div>');

        const range = wwe
          .getEditor()
          .getSelection()
          .cloneRange();

        range.setStart(wwe.getBody().querySelectorAll('div')[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste(element);

        expect(element.childNodes.length).toEqual(1);
        expect(element.childNodes[0].tagName).toEqual('UL');
        expect(element.childNodes[0].childNodes.length).toEqual(2);
      });

      it('paste data have backward depth list then limit list depth level', () => {
        const element = $('<div />').get(0);

        element.innerHTML =
          '<ul><li><div>text<br></div></li><li>' +
          '<div>t<b>ex</b>t2<br></div></li></ul><li><div>myText<br></div></li>';

        wwe.getEditor().setHTML('<ul><li><div>list1</div></li><li>list2</li></ul>');

        const range = wwe
          .getEditor()
          .getSelection()
          .cloneRange();

        range.setStart(wwe.getBody().querySelectorAll('div')[0].childNodes[0], 1);
        range.collapse(true);

        wwe.getEditor().setSelection(range);

        pch.preparePaste(element);

        expect(element.childNodes.length).toEqual(1);
        expect(element.childNodes[0].tagName).toEqual('UL');
        expect($(element.childNodes[0]).find('li > ul > li').length).toEqual(2);
      });
    });
  });

  it('should use sanitizer passed by wysiwyg editor', () => {
    const element = document.createElement('div');

    pch.preparePaste(element);

    expect(spy).toHaveBeenCalled();
  });

  describe('_sanitizeHtml() sanitizes content of container', () => {
    function createPasteContentHelper(sanitizer) {
      container = document.createElement('div');
      document.body.appendChild(container);

      wwe = new WysiwygEditor(container, new EventManager(), { sanitizer });
      pch = new WwPasteContentHelper(wwe);
    }

    let customSanitizer;

    beforeEach(() => {
      customSanitizer = html => {
        spy();
        return html.replace('<br>', '');
      };
    });

    it('to run only default sanitizer', () => {
      createPasteContentHelper();

      container.innerHTML = '<meta><div>foo</div>';
      pch._sanitizeHtml(container);

      expect(spy).not.toHaveBeenCalled();
      expect(container.innerHTML).toBe('<div>foo</div>');
    });

    it('to run custom sanitizer', () => {
      createPasteContentHelper(customSanitizer);

      container.innerHTML = '<br><meta><div>foo</div>';
      pch._sanitizeHtml(container);

      expect(spy).toHaveBeenCalled();
      expect(container.innerHTML).toBe('<div>foo</div>');
    });
  });
});
