/**
 * @fileoverview test markdown editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { MarkdownDocument } from '@toast-ui/markdown-parser';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('MarkdownEditor', () => {
  let mde, em, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();
    mde = new MarkdownEditor(container, em, new MarkdownDocument());
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('when something change emit contentChangedFromMarkdown event', done => {
    em.listen('contentChangedFromMarkdown', ({ nodes, removedNodeRange }) => {
      const expectedMdNode = mde.getMdDocument().findFirstNodeAtLine(1);

      expect(nodes[0]).toEqual(expectedMdNode);
      expect(removedNodeRange).toBeNull();
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

  it('when editor gain focus, emit focus event', done => {
    em.listen('focus', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.focus();
  });

  it('when editor lost focus, emit blur event', done => {
    em.listen('blur', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.focus();
    mde.blur();
  });
});
