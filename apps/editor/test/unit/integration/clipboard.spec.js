/**
 * @fileoverview test clipboard integration
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { source, oneLineTrim } from 'common-tags';

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
  let editor, se, wwe;

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
    wwe = editor.wwEditor;
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

      describe('list paragraph copied from ms office should be changed to', () => {
        it('normal list', () => {
          const inputHtml = source`
            <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;text-indent:-20.0pt;mso-list:l0 level1 lfo1">
              <span class="font" style="font-family:Wingdings">
                <span style="mso-list:Ignore">l
                  <span class="font" style="font-family:&quot;Times New Roman&quot;">
                    <span class="size" style="font-size:7pt">&nbsp; </span>
                  </span>
                </span>
              </span>
              <span lang="KO">foo</span>
            </p>
            <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;text-indent:-20.0pt;mso-list:l0 level1 lfo1">
              <span class="font" style="font-family:Wingdings">
                <span style="mso-list:Ignore">l
                  <span class="font" style="font-family:&quot;Times New Roman&quot;">
                    <span class="size" style="font-size:7pt">&nbsp; </span>
                  </span>
                </span>
              </span>
              <span lang="KO">bar</span>
            </p>
            <p class="MsoNormal">
              <span lang="KO">&nbsp;</span>
            </p>
            <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;text-indent:-20.0pt;mso-list:l1 level1 lfo2">
              <span lang="KO" style="mso-fareast-font-family:&quot;맑은 고딕&quot;;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:&quot;맑은 고딕&quot;;mso-bidi-theme-font:minor-latin">
                <span style="mso-list:Ignore">1.
                  <span class="font" style="font-family:&quot;Times New Roman&quot;">
                    <span class="size" style="font-size:7pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
              </span>
              <span lang="KO">가</span>
            </p>
            <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;
            text-indent:-20.0pt;mso-list:l1 level1 lfo2">
              <span lang="KO" style="mso-fareast-font-family:&quot;맑은 고딕&quot;;mso-fareast-theme-font:minor-latin;
            mso-bidi-font-family:&quot;맑은 고딕&quot;;mso-bidi-theme-font:minor-latin">
                <span style="mso-list:Ignore">2.
                  <span class="font" style="font-family:&quot;Times New Roman&quot;">
                    <span class="size" style="font-size:7pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
              </span>
              <span lang="KO">나</span>
            </p>
          `;
          const outputHtml = oneLineTrim`
            <div><br></div>
            <ul>
              <li>foo<br></li>
              <li>bar<br></li>
            </ul>
            <div>&nbsp;<br></div>
            <ol>
              <li>가<br></li>
              <li>나<br></li>
            </ol>
            <div><br></div>
          `;

          se.fireEvent('paste', pasteClipboardEvent(null, inputHtml));

          expect(se.getHTML()).toEqual(outputHtml);
        });

        it('nested list', () => {
          const inputHtml = source`
            <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;
            text-indent:-20.0pt;mso-list:l0 level1 lfo1">
              <span class="font" style="font-family:Wingdings">
                <span style="mso-list:Ignore">l
                  <span class="font" style="font-family:&quot;Times New Roman&quot;">
                    <span class="size" style="font-size:7pt">&nbsp; </span>
                  </span>
                </span>
              </span>
              <span lang="KO">foo</span>
            </p>
            <p class="MsoListParagraph" style="margin-left:60.0pt;mso-para-margin-left:0gd;
  text-indent:-20.0pt;mso-list:l0 level2 lfo1">
              <span lang="KO" style="mso-fareast-font-family:&quot;맑은 고딕&quot;;mso-fareast-theme-font:minor-latin;
  mso-bidi-font-family:&quot;맑은 고딕&quot;;mso-bidi-theme-font:minor-latin">
                <span style="mso-list:Ignore">1.
                  <span class="font" style="font-family:&quot;Times New Roman&quot;">
                    <span class="size" style="font-size:7pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </span>
                </span>
              </span>
              <span lang="KO">가나다</span>
            </p>
          `;
          const outputHtml = oneLineTrim`
            <div><br></div>
            <ul>
              <li>foo<br></li>
              <ol>
                <li>가나다<br></li>
              </ol>
            </ul>
            <div><br></div>
          `;

          se.fireEvent('paste', pasteClipboardEvent(null, inputHtml));

          expect(se.getHTML()).toEqual(outputHtml);
        });
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

    describe('list', () => {
      it('should decrease the pasted list depth to match current list depth', () => {
        const html = source`
          <ul>
            <li>list1</li>
            <li>list2</li>
          </ul>
        `;

        const inputHtml = source`
          <ul>
            <ul>
              <li>text</li>
            </ul>
          </ul>
        `;
        const outputHtml = oneLineTrim`
          <ul>
            <li>l<br></li>
            <li>text<br></li>
            <li>ist1<br></li>
            <li>list2<br></li>
          </ul>
          <div><br></div>
        `;

        se.setHTML(html);

        const range = se.getSelection().cloneRange();

        range.setStart(wwe.getBody().querySelectorAll('li')[0].childNodes[0], 1);
        range.collapse(true);

        se.setSelection(range);
        se.fireEvent('paste', pasteClipboardEvent(null, inputHtml));

        expect(se.getHTML()).toBe(outputHtml);
      });
    });

    it('should increase the pasted list depth to match current list depth', () => {
      const html = source`
        <ul>
          <li>text1</li>
          <li>
            <ul>
              <li>text2</li>
            </ul>
          </li>
        </ul>
      `;
      const inputHtml = source`
        <ul>
          <li>list1</li>
        </ul>
      `;

      const outputHtml = oneLineTrim`
        <ul>
          <li>text1<br></li>
          <li>
            <ul>
              <li>t<br></li>
            </ul>
          </li>
          <ul>
            <li>list1<br></li>
          </ul>
          <li>
            <div><br></div>
            <ul>
              <li>ext2<br></li>
            </ul>
          </li>
        </ul>
        <div><br></div>
      `;

      se.setHTML(html);

      const range = se.getSelection().cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('ul > li > ul > li')[0].childNodes[0], 1);
      range.collapse(true);

      se.setSelection(range);
      se.fireEvent('paste', pasteClipboardEvent(null, inputHtml));

      expect(se.getHTML()).toBe(outputHtml);
    });
  });
});
