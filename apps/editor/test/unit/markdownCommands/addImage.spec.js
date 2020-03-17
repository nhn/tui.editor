/**
 * @fileoverview test markdown add image
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import AddImage from '@/markdownCommands/addImage';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('AddImage', () => {
  let cm, doc, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());

    cm = mde.getEditor();

    const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

    cm.setValue(sourceText.join('\n'));
    doc = cm.getDoc();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('add image syntax with param', () => {
    let data;

    beforeEach(() => {
      data = {
        imageUrl:
          'http://static.nhn.com/static/site/wgnb/siteTheme_ent/logoImage/logo_ne_theme_01.png?ver=20150121',
        altText: 'NHN'
      };
    });

    it('to blank line', () => {
      doc.setCursor(1, 0);

      AddImage.exec(mde, data);

      expect(doc.getLine(1)).toEqual(`![${data.altText}](${data.imageUrl})`);
    });

    it('to selected area', () => {
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 2,
          ch: 7
        }
      );

      AddImage.exec(mde, data);

      expect(doc.getLine(0)).toEqual(`![${data.altText}](${data.imageUrl})`);
      expect(doc.getLine(1)).toEqual('mytext3');
    });

    it('trigger change event with origin', () => {
      let origin;

      doc.setCursor(1, 0);

      cm.on('change', (cmOb, changeObj) => {
        ({ origin } = changeObj);
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
