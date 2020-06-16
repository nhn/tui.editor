/**
 * @fileoverview test squire extension
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import SquireExt from '@/squireExt';
import { isMac } from '@/utils/common';
import domUtil from '@/utils/dom';

describe('SquireExt', () => {
  let sqe;

  beforeEach(() => {
    const container = document.createElement('div');

    css(container, {
      overflow: 'auto',
      height: '30px'
    });

    document.body.appendChild(container);

    sqe = new SquireExt(container, {
      blockTag: 'DIV'
    });
    sqe.focus();
  });

  afterEach(() => {
    document.body.innerHTML = '';
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

      sqe.getBody().innerHTML = '<h1><div>test<br></div></h1>';

      range.selectNode(sqe.getBody().querySelector('div').firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormat('H1', 'P');

      expect(sqe.getBody().querySelectorAll('p').length).toEqual(1);
      expect(sqe.getBody().querySelectorAll('h1').length).toEqual(0);
    });

    it('unwrap block format', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.getBody().innerHTML = '<h1><div>test<br></div></h1>';

      range.selectNode(sqe.getBody().querySelector('div').firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormat('H1');

      expect(sqe.getBody().querySelectorAll('H1').length).toEqual(0);
    });

    it('unwrap block format list', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.getBody().innerHTML = '<ul><li><div>test<br></div></li></ul>';

      range.selectNode(sqe.getBody().querySelector('div').firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormat('UL', 'OL');

      expect(sqe.getBody().querySelectorAll('ul').length).toEqual(0);
      expect(sqe.getBody().querySelectorAll('ol').length).toEqual(1);
    });

    it('if not mached any condition, wrap targetTagName node to first div node', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.getBody().innerHTML = '<div>test<br></div>';

      range.selectNode(sqe.getBody().querySelector('div').firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormat('UL', 'P');

      expect(sqe.getBody().querySelectorAll('ul').length).toEqual(0);
      expect(sqe.getBody().querySelectorAll('p').length).toEqual(1);
    });
  });

  describe('changeBlockFormatTo()', () => {
    it('change any block for to passed tagName', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.getBody().innerHTML = '<h1><div>test<br></div></h1>';

      range.selectNode(sqe.getBody().querySelector('div').firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormatTo('P');

      expect(sqe.getBody().querySelectorAll('h1').length).toEqual(0);
      expect(sqe.getBody().querySelectorAll('p').length).toEqual(1);
    });

    it('remove unused inputbox when change from task to another', () => {
      const range = sqe.getSelection().cloneRange();

      sqe.getBody().innerHTML = '<ul><li><div><input type="checkbox" />test<br></div></li></ul>';

      range.selectNode(sqe.getBody().querySelector('div').firstChild);
      range.collapse(true);
      sqe.setSelection(range);

      sqe.changeBlockFormatTo('H1');

      expect(sqe.getBody().querySelectorAll('ul').length).toEqual(0);
      expect(sqe.getBody().querySelectorAll('h1').length).toEqual(1);
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
    it("replace with current cursor's containers offset", () => {
      sqe.setHTML('test');

      const selection = sqe.getSelection().cloneRange();

      selection.setStart(sqe.getBody().querySelector('div').firstChild, 4);
      selection.collapse(true);
      sqe.setSelection(selection);

      sqe.replaceRelativeOffset('123', -2, 1);

      expect(sqe.getBody().textContent).toEqual('te123t');
    });

    it("replace html with current cursor's containers offset", () => {
      sqe.setHTML('test');

      const selection = sqe.getSelection().cloneRange();

      selection.setStart(sqe.getBody().querySelector('div').firstChild, 4);
      selection.collapse(true);
      sqe.setSelection(selection);

      sqe.replaceRelativeOffset('<b>123</b>', -2, 1);

      expect(sqe.getBody().textContent).toEqual('te123t');
      expect(sqe.getBody().querySelector('b').textContent).toEqual('123');
    });

    it('if current selection is not text than use previousSibling', () => {
      sqe.setHTML('<div>test<i>one</i><br></div>');

      const selection = sqe.getSelection().cloneRange();

      selection.selectNode(sqe.getBody().querySelector('i'));
      selection.collapse(true);
      sqe.setSelection(selection);

      sqe.replaceRelativeOffset('<b>123</b>', -2, 1);

      expect(sqe.getBody().textContent).toEqual('te123tone');
      expect(sqe.getBody().querySelector('b').textContent).toEqual('123');
    });

    it(
      'if current selection has not address offset with passed relative offset then' +
        ' insert current position',
      () => {
        sqe.setHTML('<div><i> </i><br></div>');

        const selection = sqe.getSelection().cloneRange();

        selection.selectNode(sqe.getBody().querySelector('i'));
        selection.collapse(true);
        sqe.setSelection(selection);

        sqe.replaceRelativeOffset('123', -2, 1);

        expect(sqe.getBody().textContent).toEqual('123');
      }
    );
  });

  describe(
    'getSelectionInfoByOffset() find next element and next offset by passed element' +
      ' and replative offset of splited text node',
    () => {
      let firstBlock, secBlock;

      beforeEach(() => {
        sqe.setHTML('<div>text1</div><div>text2</div>');
        firstBlock = sqe.getBody().childNodes[0];
        secBlock = sqe.getBody().childNodes[1];
      });

      it("offset is lower than passed element's length", () => {
        expect(sqe.getSelectionInfoByOffset(firstBlock, 3)).toEqual({
          element: firstBlock,
          offset: 3
        });
      });

      it("offset is higher than passed element's length", () => {
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
    }
  );

  describe('replaceParent()', () => {
    it("replace li's parent ul to ol", () => {
      sqe.setHTML('<ul><li>test</li></ul>');

      sqe.replaceParent(sqe.getBody().querySelector('li'), 'UL', 'OL');

      expect(sqe.getBody().querySelectorAll('ul').length).toEqual(0);
      expect(sqe.getBody().querySelectorAll('ol').length).toEqual(1);
      expect(sqe.getBody().querySelector('li').textContent).toEqual('test');
    });
  });

  describe('preserveLastLine()', () => {
    it('insert new emtpy line if dont have any default line in bottom', () => {
      sqe.setHTML('<h1>HELLO WORLD</h1>');
      sqe.preserveLastLine();
      expect(sqe.getBody().querySelectorAll('div').length).toEqual(1);
    });

    it('dont insert new emtpy line if have default line in bottom', () => {
      sqe.setHTML('<h1>HELLO WORLD</h1><div>test<br></div>');
      sqe.preserveLastLine();
      expect(sqe.getBody().querySelectorAll('div').length).toEqual(1);
    });
  });

  describe('scrollTop', () => {
    it('move scroll or get scrollTop value', () => {
      sqe.setHTML(
        'a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>'
      );
      sqe.scrollTop(50);
      expect(sqe.scrollTop()).not.toEqual(0);
    });
  });

  describe('focus', () => {
    it('should preserve scrollTop especially in webket', () => {
      sqe.setHTML(
        'a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>'
      );
      sqe.moveCursorToEnd();

      const inputEL = domUtil.createElementWith(
        '<input type="text" id="myInput" />',
        document.body
      );
      const scrollTop = sqe.scrollTop();

      inputEL.focus();
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

  describe('sanitize content', () => {
    it('empty figure element should be removed', () => {
      sqe.insertHTML('<p>Hello</p><figure class="custom"></figure><p>Hello</p>', true);

      expect(sqe.getBody().querySelectorAll('figure').length).toBe(0);
    });

    it('non-empty figure element should not be removed', () => {
      sqe.insertHTML('<p>Hello</p><figure><img src="url" /></figure><p>World</p>', true);

      expect(sqe.getBody().querySelectorAll('figure').length).toBe(1);
    });
  });
});
