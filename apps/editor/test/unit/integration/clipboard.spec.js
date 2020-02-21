/**
 * @fileoverview test clipboard integration
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import browser from 'tui-code-snippet/browser/browser';

import Editor from '@/editor';

/**
 * make fake clipboard event
 * @param {string} text - clipboard text
 * @param {string} html - clipboard html
 * @param {array} fileType - supported file types
 * @returns {Event} - clipboard event
 */
function pasteClipboardEvent(text, html, fileType) {
  const event = document.createEvent('Event', false, true);
  const clipboardData = {};
  const items = [];
  const types = [];

  event.initEvent('paste', false, true);

  event.clipboardData = clipboardData;
  clipboardData.items = items;
  clipboardData.types = types;

  if (text) {
    items.push({
      type: 'text/plain',
      getAsString: cb => cb(text)
    });
    types.push('text/plain');
  }
  if (html) {
    items.push({
      type: 'text/html',
      getAsString: cb => cb(html)
    });
    types.push('text/html');
  }
  if (fileType) {
    items.push({
      type: fileType,
      getAsFile: () => {
        return {
          size: 0,
          type: fileType
        };
      }
    });
    types.push('Files');
  }

  return event;
}

describe('Clipboard', () => {
  let editor, se;

  // We can't simulate browser paste. skip IE & Edge browsers
  if (browser.msie || browser.edge) {
    pending();
  }

  beforeEach(done => {
    const container = document.createElement('div');

    document.body.appendChild(container);
    editor = new Editor({
      el: container,
      height: '300px',
      initialEditType: 'wysiwyg'
    });
    se = editor.wwEditor.editor;
    setTimeout(done, 0);
  });

  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  describe('paste', () => {
    describe('plain text', () => {
      it('line breaks should be wrapped with div', () => {
        const pasteText = ['text', 'text', 'text'].join('\n');
        const pastedHtml = '<div>text<br></div><div>text<br></div><div>text<br></div>';

        se.fireEvent('paste', pasteClipboardEvent(pasteText));

        expect(se.getHTML()).toEqual(pastedHtml);
      });

      it('multiple line breaks should be preserved', () => {
        const pasteText = ['text', '', '', 'text'].join('\n');
        const pastedHtml = '<div>text<br></div><div><br></div><div><br></div><div>text<br></div>';

        se.fireEvent('paste', pasteClipboardEvent(pasteText));

        expect(se.getHTML()).toEqual(pastedHtml);
      });
    });

    describe('html', () => {
      it('multiple links should be pasted right', () => {
        const inputHtml = '<a href="">a</a><a href="">b</a>';
        const outputHtml = `<div>${inputHtml}<br></div>`;

        se.fireEvent('paste', pasteClipboardEvent(null, inputHtml));

        expect(se.getHTML()).toEqual(outputHtml);
      });

      it('comment tags should be stripped', () => {
        const inputHtml = '<!-- comment -->text<!-- comment -->';
        const outputHtml = '<div>text<br></div>';

        se.fireEvent('paste', pasteClipboardEvent(null, inputHtml));

        expect(se.getHTML()).toEqual(outputHtml);
      });

      it('danggling TD should become a table', done => {
        const inputHtml = '<td>table</td>';

        se.fireEvent('paste', pasteClipboardEvent(null, inputHtml));

        setTimeout(() => {
          const outputDOM = se._root;

          expect(outputDOM.querySelector('table')).toBeDefined();
          expect(outputDOM.querySelector('table thead')).toBeDefined();
          expect(outputDOM.querySelector('table tbody')).toBeDefined();
          done();
        }, 0);
      });

      it('all block tags should be changed to div', () => {
        const inputHtml =
          '<p>text</p>' +
          '<article>text</article>' +
          '<aside>text</aside>' +
          '<nav>text</nav>' +
          '<div>text</div>' +
          '<section>text</section>';
        const outputHtml =
          '<div>text<br></div><div><br></div>' +
          '<div>text<br></div>' +
          '<div>text<br></div>' +
          '<div>text<br></div>' +
          '<div>text<br></div>' +
          '<div>text<br></div>';

        se.fireEvent('paste', pasteClipboardEvent(null, inputHtml));

        expect(se.getHTML()).toEqual(outputHtml);
      });
    });

    describe('image', () => {
      it('should execute addImageBlobHook', () => {
        const spy = jasmine.createSpy();

        editor.addHook('addImageBlobHook', spy);

        se.fireEvent('paste', pasteClipboardEvent(null, null, 'image/png'));

        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
