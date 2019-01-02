/**
 * @fileoverview test markdown add link
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import AddLink from '../../../src/js/markdownCommands/addLink';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('AddLink', () => {
  let cm, doc, mde;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    mde = new MarkdownEditor($container, new EventManager());

    cm = mde.getEditor();

    const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

    cm.setValue(sourceText.join('\n'));
    doc = cm.getDoc();
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('should add link in markdown syntax', () => {
    let data;

    beforeEach(() => {
      data = {
        linkText: 'mylink',
        url: 'http://www.nhnent.com'
      };
    });

    it('on empty area', () => {
      doc.setCursor(1, 0);

      AddLink.exec(mde, data);

      expect(doc.getLine(1)).toEqual(`[${data.linkText}](${data.url})`);
    });

    it('and decode characters in link text', () => {
      doc.setCursor(1, 0);

      data.linkText = '%ED%95%9C%EA%B8%80%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C';
      AddLink.exec(mde, data);

      expect(doc.getLine(1)).toEqual(`[한글유니코드](${data.url})`);
    });

    it('and escape markdown critical characters in link text', () => {
      doc.setCursor(1, 0);

      data.linkText = 'mylink ()[]<>';
      AddLink.exec(mde, data);

      expect(doc.getLine(1)).toEqual(`[mylink \\(\\)\\[\\]\\<\\>](${data.url})`);
    });

    it('and encode markdown critical characters in url', () => {
      doc.setCursor(1, 0);

      data.url = 'mylink ()[]<>';
      AddLink.exec(mde, data);

      expect(doc.getLine(1)).toEqual(`[${data.linkText}](mylink %28%29%5B%5D%3C%3E)`);
    });

    it('on selected area', () => {
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 2,
        ch: 7
      });

      AddLink.exec(mde, data);

      expect(doc.getLine(0)).toEqual(`[${data.linkText}](${data.url})`);
      expect(doc.getLine(1)).toEqual('mytext3');
    });
  });
});
