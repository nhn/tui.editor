/**
 * @fileoverview test wysiwyg list manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';
import WwListManager from '../../src/js/wwListManager';

describe('WwListManager', () => {
  let container, em, wwe, mgr;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();

    wwe = new WysiwygEditor($(container), em);

    wwe.init();

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
      wwe.setValue(['<ul>this will deleted</ul>',
        '<ol>and this too</ol>'].join(''));

      expect(wwe.get$Body().find('ul').length).toEqual(1);
      expect(wwe.get$Body().find('ol').length).toEqual(1);

      mgr._findAndRemoveEmptyList();

      expect(wwe.get$Body().find('ul').length).toEqual(0);
      expect(wwe.get$Body().find('ol').length).toEqual(0);
    });
    it('do not remove when ul have li element within.', () => {
      wwe.setValue([
        '<ul>',
        '<li><div>survived!</div></li>',
        '</ul>',
        '<ol>',
        '<li><div>me too!</div></li>',
        '</ol>'].join(''));

      expect(wwe.get$Body().find('ul').length).toEqual(1);
      expect(wwe.get$Body().find('ol').length).toEqual(1);

      mgr._findAndRemoveEmptyList();

      expect(wwe.get$Body().find('ul').length).toEqual(1);
      expect(wwe.get$Body().find('ul li').text()).toEqual('survived!');
      expect(wwe.get$Body().find('ol li').text()).toEqual('me too!');
    });
  });

  describe('convert from/to arbitrary nesting list', () => {
    it('_convertToArbitraryNestingList should convert nested ul to arbitrary nested ul', () => {
      expect(mgr._convertToArbitraryNestingList('<ul><li>text<ul><li>text2</li></ul></li></ul>'))
        .toBe('<ul><li>text</li><ul><li>text2</li></ul></ul>');
    });

    it('_convertFromArbitraryNestingList should convert nested ul to arbitrary nested ul', () => {
      expect(mgr._convertFromArbitraryNestingList('<ul><li>text</li><ul><li>text2</li></ul></ul>'))
        .toBe('<ul><li>text<ul><li>text2</li></ul></li></ul>');
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
      wwe.getEditor().setHTML([
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
        '</ul>'].join(''));
      mgr._removeBranchListAll();

      expect(wwe.get$Body().find('ul').length).toEqual(3);
      expect(wwe.get$Body().find('ul li ul').eq(0).children('li').length).toEqual(2);
      expect(wwe.get$Body().find('ul li ul').eq(0).children('li').eq(0).children('div').text()).toEqual('t2');
      expect(wwe.get$Body().find('ul li ul').eq(0).children('li').eq(1).text()).toEqual('t5');
    });

    it('Dont break to contentEditable root body', () => {
      wwe.getEditor().setHTML([
        '<div>',
        '<ul>',
        '<li>',
        '<ul>',
        '<li><div>t1<br></div></li>',
        '<li><div>t1<br></div></li>',
        '<li><div>t1<br></div></li>',
        '</ul>',
        '</li>',
        '<li><div>t2</div></li>',
        '</ul>',
        '</div>'].join(''));

      mgr._removeBranchListAll();

      expect(wwe.get$Body().find('ul').length).toEqual(1);
      expect(wwe.get$Body().find('ul li ul').eq(0).children('li').length).toEqual(0);
      expect(wwe.get$Body().children('div').length).toEqual(1);
    });

    it('Dont remove correct list with text node', () => {
      wwe.getEditor().setHTML([
        '<ul>',
        '<li>',
        't1',
        '<ul>',
        '<li><div>t3<br></div></li>',
        '<li><div>t4<br></div></li>',
        '</ul>',
        '</li>',
        '</ul>'].join(''));
      mgr._removeBranchListAll();

      expect(wwe.get$Body().find('ul').length).toEqual(2);
      expect(wwe.get$Body().find('ul li ul').eq(0).children('li').length).toEqual(2);
      expect(wwe.get$Body().find('ul li ul').eq(0).children('li').eq(0).children('div').text()).toEqual('t3');
      expect(wwe.get$Body().find('ul li ul').eq(0).children('li').eq(1).text()).toEqual('t4');
    });
  });

  describe('Control list blank line', () => {
    it('ul - br - ul', () => {
      const html = [
        '<ul>',
        '<li><div>1</div></li>',
        '</ul>',
        '<br />',
        '<ul>',
        '<li><div>2</div></li>',
        '</ul>'
      ].join('');

      const result = mgr._insertBlankToBetweenSameList(html);

      expect(result.indexOf(':BLANK_LINE:')).not.toBe(-1);
      expect(result.indexOf('<br />')).toBe(-1);
    });

    it('ul - br - br - ul', () => {
      const html = [
        '<ul>',
        '<li><div>1</div></li>',
        '</ul>',
        '<br />',
        '<br />',
        '<ul>',
        '<li><div>2</div></li>',
        '</ul>'
      ].join('');

      const result = mgr._insertBlankToBetweenSameList(html);

      expect(result.indexOf(':BLANK_LINE:')).not.toBe(-1);
      expect(result.indexOf('<br />')).toBe(-1);
    });

    it('ul - ul', () => {
      const html = [
        '<ul>',
        '<li><div>1</div></li>',
        '</ul>',
        '<ul>',
        '<li><div>2</div></li>',
        '</ul>'
      ].join('');

      const result = mgr._insertBlankToBetweenSameList(html);

      expect(result.indexOf(':BLANK_LINE:')).not.toBe(-1);
      expect(result.indexOf('<br />')).toBe(-1);
    });
  });

  describe('mergeList', () => {
    it('should merge list to previous list', () => {
      const list = $(`
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
            `)[0];

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
      const list = $(`
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
            `)[0];

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
      const list = $(`
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
            `)[0];

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
      const list = $(`
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
            `)[0];

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
});
