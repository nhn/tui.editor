/**
 * @fileoverview test markdownit custom renderer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Convertor from '@/convertor';
import EventManager from '@/eventManager';

describe('Markdown-it', () => {
  let convertor, em;

  beforeEach(() => {
    const $container = $('<div />');
    em = new EventManager();
    convertor = new Convertor(em);

    $('body').append($container);
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('tableRendererRule', () => {
    const tableText = '\n| | | |'
            + '\n| --- | :---: | ---: |'
            + '\n| | | |'
            + '\n| | | |'
            + '\n| | | |';

    it('sholud render table element accurately', () => {
      const tableHTML = convertor.toHTML(tableText);
      const $tableElement = $(tableHTML);

      expect($tableElement.find('td,th').length).toBe(12);
      const tds = $tableElement.find('td');
      const ths = $tableElement.find('th');
      expect(tds.eq(0).attr('align')).toBeUndefined();
      expect(tds.eq(1).attr('align')).toBe('center');
      expect(tds.eq(2).attr('align')).toBe('right');
      expect(ths.eq(0).attr('align')).toBeUndefined();
      expect(ths.eq(1).attr('align')).toBe('center');
      expect(ths.eq(2).attr('align')).toBe('right');
    });
  });

  describe('taskPlugin', () => {
    const taskText = '\n* [ ] study'
            + '\n* [x] workout'
            + '\n* [X] eat breakfast';

    it('should render task list accurately', () => {
      const taskHTML = convertor.toHTML(taskText);
      const $container = $('<div></div>');

      $container.html(taskHTML);

      const lis = $container.find('li');
      const li0 = lis.eq(0);
      const li1 = lis.eq(1);
      const li2 = lis.eq(2);

      expect($container.children('ul').length).toBe(1);
      expect(lis.length).toBe(3);
      expect(li0.text()).toBe('study');
      expect(li0.hasClass('task-list-item')).toBe(true);
      expect(li0.hasClass('checked')).toBe(false);
      expect(li0.attr('data-te-task')).toBe('');

      expect(li1.text()).toBe('workout');
      expect(li1.hasClass('task-list-item')).toBe(true);
      expect(li1.hasClass('checked')).toBe(true);
      expect(li1.attr('data-te-task')).toBe('');

      expect(li2.text()).toBe('eat breakfast');
      expect(li2.hasClass('task-list-item')).toBe(true);
      expect(li2.hasClass('checked')).toBe(true);
      expect(li2.attr('data-te-task')).toBe('');
    });
  });

  describe('codeblock', () => {
    const codeblockText = '\n```javascript'
            + '\nconst a = 100;'
            + '\n```';
    const wrongLanguageText = '\n```korea'
            + '\n<div>asd</div>'
            + '\n```';
    const planeText = '\n```'
            + '\n<div>asd</div>'
            + '\n```';

    it('rendering Codeblock element accurately', () => {
      const codeblockHTML = convertor._markdownToHtml(codeblockText);
      const $container = $('<div></div>');

      $container.html(codeblockHTML);

      expect($container.children('pre').length).toBe(1);
      expect($container.children('pre').children('code').length).toBe(1);
      expect($container.children('pre').children('code').attr('data-language')).toBe('javascript');
      expect($container.children('pre').children('code').hasClass('lang-javascript')).toBe(true);
    });
    it('rendering Codeblock element accurately with highlight', () => {
      const codeblockHTML = convertor._markdownToHtmlWithCodeHighlight(codeblockText);
      const $container = $('<div></div>');

      $container.html(codeblockHTML);

      expect($container.children('pre').length).toBe(1);
      expect($container.children('pre').children('code').length).toBe(1);
      expect($container.children('pre').children('code').children('span').length).toBe(2);
      expect($container.children('pre').children('code').attr('data-language')).toBe('javascript');
      expect($container.children('pre').children('code').hasClass('lang-javascript')).toBe(true);
    });
    it('rendering Codeblock element with invalid language name should escape html entity', () => {
      const codeblockHTML = convertor._markdownToHtmlWithCodeHighlight(wrongLanguageText);
      const $container = $('<div></div>');

      $container.html(codeblockHTML);

      expect($container.children('pre').length).toBe(1);
      expect($container.children('pre').children('code').length).toBe(1);
      expect($container.children('pre').children('code').children('span').length).toBe(0);
      expect($container.children('pre').children('code').children('div').length).toBe(0);
      expect($container.children('pre').children('code').text()).toBe('<div>asd</div>\n');
      expect($container.children('pre').children('code').attr('data-language')).toBe('korea');
      expect($container.children('pre').children('code').hasClass('lang-korea')).toBe(true);
    });
    it('rendering Codeblock element without language name should escape html entity', () => {
      const codeblockHTML = convertor._markdownToHtmlWithCodeHighlight(planeText);
      const $container = $('<div></div>');

      $container.html(codeblockHTML);

      expect($container.children('pre').length).toBe(1);
      expect($container.children('pre').children('code').length).toBe(1);
      expect($container.children('pre').children('code').children('div').length).toBe(0);
      expect($container.children('pre').children('code').text()).toBe('<div>asd</div>\n');
    });
  });
});
