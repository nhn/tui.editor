/**
 * @fileoverview test markdownit custom renderer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Convertor from '@/convertor';
import EventManager from '@/eventManager';
import domUtils from '@/utils/dom';
import hasClass from 'tui-code-snippet/domUtil/hasClass';

describe('Custom HTMLRender', () => {
  let convertor;

  beforeEach(() => {
    convertor = new Convertor(new EventManager());
  });

  describe('tableRendererRule', () => {
    const tableText = [
      '\n| | | |',
      '\n| --- | :---: | ---: |',
      '\n| | | |',
      '\n| | | |',
      '\n| | | |'
    ].join('');

    it('sholud render table element accurately', () => {
      const tableHTML = convertor.toHTML(tableText);
      const tableElement = domUtils.createElementWith(tableHTML);

      expect(tableElement.querySelectorAll('td,th').length).toBe(12);

      const tds = tableElement.querySelectorAll('td');
      const ths = tableElement.querySelectorAll('th');

      expect(tds[0].align).toBe('');
      expect(ths[0].align).toBe('');
      expect(tds[1].align).toBe('center');
      expect(ths[1].align).toBe('center');
      expect(tds[2].align).toBe('right');
      expect(ths[2].align).toBe('right');
    });
  });

  describe('taskPlugin', () => {
    const taskText = ['\n* [ ] study', '\n* [x] workout', '\n* [X] eat breakfast'].join('');

    it('should render task list accurately', () => {
      const taskHTML = convertor.toHTML(taskText);
      const container = document.createElement('div');

      container.innerHTML = taskHTML;

      const lis = container.querySelectorAll('li');
      const [li0, li1, li2] = lis;

      expect(container.querySelectorAll('ul').length).toBe(1);
      expect(lis.length).toBe(3);
      expect(li0.getAttribute('data-te-task')).toBe('');
      expect(li0.textContent).toBe('study');
      expect(hasClass(li0, 'task-list-item')).toBe(true);
      expect(hasClass(li0, 'checked')).toBe(false);

      expect(li1.textContent).toBe('workout');
      expect(li1.getAttribute('data-te-task')).toBe('');
      expect(hasClass(li1, 'task-list-item')).toBe(true);
      expect(hasClass(li1, 'checked')).toBe(true);

      expect(li2.textContent).toBe('eat breakfast');
      expect(li2.getAttribute('data-te-task')).toBe('');
      expect(hasClass(li2, 'task-list-item')).toBe(true);
      expect(hasClass(li2, 'checked')).toBe(true);
    });
  });

  describe('codeblock', () => {
    const codeblockText = ['\n```javascript', '\nconst a = 100;', '\n```'].join('');
    const wrongLanguageText = ['\n```korea', '\n<div>asd</div>', '\n```'].join('');
    const planeText = ['\n```', '\n<div>asd</div>', '\n```'].join('');

    it('rendering Codeblock element accurately', () => {
      const codeblockHTML = convertor._markdownToHtml(codeblockText);
      const container = document.createElement('div');

      container.innerHTML = codeblockHTML;

      const preEl = container.firstChild;
      const codeEl = preEl.firstChild;

      expect(preEl.nodeName).toBe('PRE');
      expect(hasClass(preEl, 'lang-javascript')).toBe(true);
      expect(codeEl.nodeName).toBe('CODE');
      expect(codeEl.getAttribute('data-language')).toBe('javascript');
    });

    it('rendering Codeblock element with invalid language name should escape html entity', () => {
      const codeblockHTML = convertor._markdownToHtmlWithCodeHighlight(wrongLanguageText);
      const container = document.createElement('div');

      container.innerHTML = codeblockHTML;

      const preEl = container.firstChild;
      const codeEl = preEl.firstChild;

      expect(preEl.nodeName).toBe('PRE');
      expect(hasClass(preEl, 'lang-korea')).toBe(true);
      expect(codeEl.nodeName).toBe('CODE');
      expect(codeEl.querySelector('span')).toBe(null);
      expect(codeEl.querySelector('div')).toBe(null);
      expect(codeEl.textContent).toBe('<div>asd</div>\n');
      expect(codeEl.getAttribute('data-language')).toBe('korea');
    });

    it('rendering Codeblock element without language name should escape html entity', () => {
      const codeblockHTML = convertor._markdownToHtmlWithCodeHighlight(planeText);
      const container = document.createElement('div');

      container.innerHTML = codeblockHTML;

      const preEl = container.firstChild;
      const codeEl = preEl.firstChild;

      expect(preEl.nodeName).toBe('PRE');
      expect(codeEl.nodeName).toBe('CODE');
      expect(codeEl.querySelector('div')).toBe(null);
      expect(codeEl.textContent).toBe('<div>asd</div>\n');
    });
  });
});
