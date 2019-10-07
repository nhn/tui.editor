/**
 * @fileoverview test squire extension
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import SquireExt from '@/squireExt';
import {isMac} from '@/util';

describe('SquireExt', () => {
  let sqe;

  beforeEach(() => {
    const $container = $('<div />');

    $container.css({
      'overflow': 'auto',
      'height': 30
    });

    $('body').append($container);

    sqe = new SquireExt($container[0], {
      blockTag: 'DIV'
    });
    sqe.focus();
  });

  afterEach(() => {
    $('body').empty();
    sqe = null;
  });

  describe('initialize', () => {
    it('squireExt instance defined', () => {
      expect(sqe).toBeDefined();
    });

    it('has squire prototype method', () => {
      expect(sqe.modifyBlocks).toBeDefined();
    });
  });

  describe('changeBlockFormat', () => {
    it('change block format', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.get$Body().html('<h1><div>test<br></div></h1>');

      range.selectNode(sqe.get$Body().find('div')[0].firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormat('H1', 'P');

      expect(sqe.get$Body().find('p').length).toEqual(1);
      expect(sqe.get$Body().find('h1').length).toEqual(0);
    });

    it('unwrap block format', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.get$Body().html('<h1><div>test<br></div></h1>');

      range.selectNode(sqe.get$Body().find('div')[0].firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormat('H1');

      expect(sqe.get$Body().find('H1').length).toEqual(0);
    });

    it('unwrap block format list', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.get$Body().html('<ul><li><div>test<br></div></li></ul>');

      range.selectNode(sqe.get$Body().find('div')[0].firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormat('UL', 'OL');

      expect(sqe.get$Body().find('ul').length).toEqual(0);
      expect(sqe.get$Body().find('ol').length).toEqual(1);
    });

    it('if not mached any condition, wrap targetTagName node to first div node', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.get$Body().html('<div>test<br></div>');

      range.selectNode(sqe.get$Body().find('div')[0].firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormat('UL', 'P');

      expect(sqe.get$Body().find('ul').length).toEqual(0);
      expect(sqe.get$Body().find('p').length).toEqual(1);
    });
  });

  describe('changeBlockFormatTo()', () => {
    it('change any block for to passed tagName', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.get$Body().html('<h1><div>test<br></div></h1>');

      range.selectNode(sqe.get$Body().find('div')[0].firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormatTo('P');

      expect(sqe.get$Body().find('h1').length).toEqual(0);
      expect(sqe.get$Body().find('p').length).toEqual(1);
    });

    it('remove unused inputbox when change from task to another', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.get$Body().html('<ul><li><div><input type="checkbox" />test<br></div></li></ul>');

      range.selectNode(sqe.get$Body().find('div')[0].firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormatTo('H1');

      expect(sqe.get$Body().find('ul').length).toEqual(0);
      expect(sqe.get$Body().find('h1').length).toEqual(1);
    });
  });

  describe('replaceSelection()', () => {
    it('replace selection content with passed content', () => {
      const selection = sqe.getSelection();
      sqe.replaceSelection('test', selection);
      expect(sqe.getDocument().body.textContent).toEqual('test');
    });

    it('if replace selection without selection, use current selection', () => {
      sqe.replaceSelection('test');
      expect(sqe.getDocument().body.textContent).toEqual('test');
    });
  });

  describe('replaceRelativeOffset', () => {
    it('replace with current cursor\'s containers offset', () => {
      sqe.setHTML('test');

      const selection = sqe.getSelection().cloneRange();
      selection.setStart(sqe.get$Body().find('div')[0].firstChild, 4);
      selection.collapse(true);
      sqe.setSelection(selection);

      sqe.replaceRelativeOffset('123', -2, 1);

      expect(sqe.get$Body()[0].textContent).toEqual('te123t');
    });

    it('replace html with current cursor\'s containers offset', () => {
      sqe.setHTML('test');

      const selection = sqe.getSelection().cloneRange();
      selection.setStart(sqe.get$Body().find('div')[0].firstChild, 4);
      selection.collapse(true);
      sqe.setSelection(selection);

      sqe.replaceRelativeOffset('<b>123</b>', -2, 1);

      expect(sqe.get$Body()[0].textContent).toEqual('te123t');
      expect(sqe.get$Body().find('b').text()).toEqual('123');
    });

    it('if current selection is not text than use previousSibling', () => {
      sqe.setHTML('<div>test<i>one</i><br></div>');

      const selection = sqe.getSelection().cloneRange();
      selection.selectNode(sqe.get$Body().find('i')[0]);
      selection.collapse(true);
      sqe.setSelection(selection);

      sqe.replaceRelativeOffset('<b>123</b>', -2, 1);

      expect(sqe.get$Body()[0].textContent).toEqual('te123tone');
      expect(sqe.get$Body().find('b').text()).toEqual('123');
    });

    it('if current selection has not address offset with passed relative offset then' +
            ' insert current position', () => {
      sqe.setHTML('<div><i> </i><br></div>');

      const selection = sqe.getSelection().cloneRange();
      selection.selectNode(sqe.get$Body().find('i')[0]);
      selection.collapse(true);
      sqe.setSelection(selection);

      sqe.replaceRelativeOffset('123', -2, 1);

      expect(sqe.get$Body()[0].textContent).toEqual('123');
    });
  });

  describe('getSelectionInfoByOffset() find next element and next offset by passed element' +
        ' and replative offset of splited text node', () => {
    let firstBlock, secBlock;

    beforeEach(() => {
      sqe.setHTML('<div>text1</div><div>text2</div>');
      firstBlock = sqe.get$Body()[0].childNodes[0];
      secBlock = sqe.get$Body()[0].childNodes[1];
    });

    it('offset is lower than passed element\'s length', () => {
      expect(sqe.getSelectionInfoByOffset(firstBlock, 3)).toEqual({
        element: firstBlock,
        offset: 3
      });
    });

    it('offset is higher than passed element\'s length', () => {
      expect(sqe.getSelectionInfoByOffset(firstBlock, 7)).toEqual({
        element: firstBlock.nextSibling,
        offset: 2
      });
    });

    it('offset is higher than exist content length', () => {
      expect(sqe.getSelectionInfoByOffset(firstBlock, 11)).toEqual({
        element: firstBlock.nextSibling,
        offset: 5
      });
    });

    it('if offset is minus, find element toward to previous', () => {
      expect(sqe.getSelectionInfoByOffset(secBlock, -3)).toEqual({
        element: firstBlock,
        offset: 2
      });
    });
  });

  describe('replaceParent()', () => {
    it('replace li\'s parent ul to ol', () => {
      sqe.setHTML('<ul><li>test</li></ul>');

      sqe.replaceParent(sqe.get$Body().find('li'), 'UL', 'OL');

      expect(sqe.get$Body().find('ul').length).toEqual(0);
      expect(sqe.get$Body().find('ol').length).toEqual(1);
      expect(sqe.get$Body().find('li').text()).toEqual('test');
    });
  });

  describe('preserveLastLine()', () => {
    it('insert new emtpy line if dont have any default line in bottom', () => {
      sqe.setHTML('<h1>HELLO WORLD</h1>');
      sqe.preserveLastLine();
      expect(sqe.get$Body().find('div').length).toEqual(1);
    });

    it('dont insert new emtpy line if have default line in bottom', () => {
      sqe.setHTML('<h1>HELLO WORLD</h1><div>test<br></div>');
      sqe.preserveLastLine();
      expect(sqe.get$Body().find('div').length).toEqual(1);
    });
  });

  describe('scrollTop', () => {
    it('move scroll or get scrollTop value', () => {
      sqe.setHTML('a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>');
      sqe.scrollTop(50);
      expect(sqe.scrollTop()).not.toEqual(0);
    });
  });

  describe('focus', () => {
    it('should preserve scrollTop especially in webket', () => {
      sqe.setHTML('a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>');
      sqe.moveCursorToEnd();

      $('body').append('<input type="text" id="myInput" />');

      const scrollTop = sqe.scrollTop();

      $('#myInput').focus();
      sqe.focus();

      expect(sqe.scrollTop()).toEqual(scrollTop);
    });
  });

  describe('blockCommandShortcut()', () => {
    it('blocks key handlers', () => {
      const meta = isMac ? 'meta' : 'ctrl';
      const spyOriginal = jasmine.createSpy('original');
      const spy = jasmine.createSpy('replace');
      const keyEvent = {
        keyCode: 66,
        preventDefault: spy
      };
      keyEvent[`${meta}Key`] = true;

      Object.getPrototypeOf(sqe._keyHandlers)[`${meta}-b`] = spyOriginal;
      sqe.blockCommandShortcuts();
      sqe.fireEvent('keydown', keyEvent);

      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        expect(spyOriginal).not.toHaveBeenCalled();
      }, 1);
    });
  });
});
