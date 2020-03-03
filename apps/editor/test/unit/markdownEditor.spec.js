/**
 * @fileoverview test markdown editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

xdescribe('MarkdownEditor', () => {
  let mde, em, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();
    mde = new MarkdownEditor(container, em);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('when something change emit contentChangedFromMarkdown event', done => {
    em.listen('contentChangedFromMarkdown', editor => {
      expect(editor).toEqual(mde);
      done();
    });

    mde.getEditor().replaceSelection('myText');
  });

  it('when something change emit changeFromMarkdown event', done => {
    em.listen('changeFromMarkdown', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.getEditor().replaceSelection('my');
  });

  it('when something change emit change event', done => {
    em.listen('change', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.getEditor().replaceSelection('comment');
  });

  xit('when editor gain focus, emit focus event', done => {
    em.listen('focus', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.focus();
  });

  xit('when editor lost focus, emit blur event', done => {
    em.listen('blur', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.focus();
    mde.blur();
  });
});
