/**
 * @fileoverview Test toMark renderer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import {
  _getAdditionalThCount,
  _createTheadMarkdown,
  _createTableCellMarkdown
} from '@/toMarkRenderer';

function createElement(html, selector) {
  const container = document.createElement('table');

  container.innerHTML = html;

  return toArray(container.querySelectorAll(selector));
}

describe('toMarkRendererCreator', () => {
  describe('_getAdditionalThCount()', () => {
    it('get additional th element count, when any th has colspan', () => {
      const theadHtml = [
        '<thead>',
        '<th colspan="2">title1</th>',
        '<th>title2</th>',
        '</thead>'
      ].join('');
      const ths = createElement(theadHtml, 'th');
      const actual = _getAdditionalThCount(ths);

      expect(actual).toBe(1);
    });

    it('get additional th element count, when all th has not colspan', () => {
      const theadHtml = ['<thead>', '<th>title1</th>', '<th>title2</th>', '</thead>'].join('');
      const ths = createElement(theadHtml, 'th');
      const actual = _getAdditionalThCount(ths);

      expect(actual).toBe(0);
    });
  });

  describe('_createTheadMarkdown()', () => {
    it('create thead markdown, when any th has colspan', () => {
      const theadHtml = [
        '<thead>',
        '<th colspan="2">@cols=2:title1</th>',
        '<th>title2</th>',
        '</thead>'
      ].join('');
      const [theadElement] = createElement(theadHtml, 'thead');
      const theadContent = '|@cols=2:title1|title2|\n';
      const actual = _createTheadMarkdown(theadElement, theadContent);

      expect(actual).toBe('|@cols=2:title1|title2|\n| --- | --- | --- |\n');
    });

    it('create thead markdown, when all th has not colspan', () => {
      const theadHtml = ['<thead>', '<th>title1</th>', '<th>title2</th>', '</thead>'].join('');
      const [theadElement] = createElement(theadHtml, 'thead');
      const theadContent = '|title1|title2|\n';
      const actual = _createTheadMarkdown(theadElement, theadContent);

      expect(actual).toBe('|title1|title2|\n| --- | --- |\n');
    });
  });

  describe('_createTableCellMarkdown() should create table cell markdown properly', () => {
    it('basic cell ', () => {
      const cellHtml = '<th>title1</th>';
      const [cellElement] = createElement(cellHtml, 'th');
      const cellContent = 'title1';
      const actual = _createTableCellMarkdown(cellElement, cellContent);

      expect(actual).toBe(' title1 |');
    });

    it('with colspan', () => {
      const cellHtml = '<th colspan="2">title1</th>';
      const [cellElement] = createElement(cellHtml, 'th');
      const cellContent = 'title1';
      const actual = _createTableCellMarkdown(cellElement, cellContent);

      expect(actual).toBe(' @cols=2:title1 |');
    });

    it('with colspan, rowspan', () => {
      const cellHtml = '<th colspan="2" rowspan="2">title1</th>';
      const [cellElement] = createElement(cellHtml, 'th');
      const cellContent = 'title1';
      const actual = _createTableCellMarkdown(cellElement, cellContent);

      expect(actual).toBe(' @cols=2:@rows=2:title1 |');
    });
  });
});
