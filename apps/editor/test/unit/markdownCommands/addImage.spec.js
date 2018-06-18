/**
 * @fileoverview test markdown add image
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import AddImage from '../../../src/js/markdownCommands/addImage';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('AddImage', () => {
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

  describe('add image syntax with param', () => {
    let data;

    beforeEach(() => {
      data = {
        imageUrl: 'http://static.nhnent.com/static/site/wgnb/siteTheme_ent/logoImage/logo_ne_theme_01.png?ver=20150121',
        altText: 'NHN Entertainment'
      };
    });

    it('to blank line', () => {
      doc.setCursor(1, 0);

      AddImage.exec(mde, data);

      expect(doc.getLine(1)).toEqual(`![${data.altText}](${data.imageUrl})`);
    });

    it('to selected area', () => {
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 2,
        ch: 7
      });

      AddImage.exec(mde, data);

      expect(doc.getLine(0)).toEqual(`![${data.altText}](${data.imageUrl})`);
      expect(doc.getLine(1)).toEqual('mytext3');
    });

    it('trigger change event with origin', () => {
      let origin;

      doc.setCursor(1, 0);

      cm.on('change', (cmOb, changeObj) => {
        ({origin} = changeObj);
      });

      AddImage.exec(mde, data);

      expect(doc.getLine(1)).toEqual(`![${data.altText}](${data.imageUrl})`);
      expect(origin).toEqual('+addImage');
    });

    it('and escape markdown critical characters in alt text', () => {
      doc.setCursor(1, 0);

      data.altText = 'mytext ()[]<>';
      AddImage.exec(mde, data);

      expect(doc.getLine(1)).toEqual(`![mytext \\(\\)\\[\\]\\<\\>](${data.imageUrl})`);
    });

    it('and encode markdown critical characters in image url', () => {
      doc.setCursor(1, 0);

      data.imageUrl = 'myurl ()[]<>';
      AddImage.exec(mde, data);

      expect(doc.getLine(1)).toEqual(`![${data.altText}](myurl %28%29%5B%5D%3C%3E)`);
    });
  });
});
