/**
 * @fileoverview Test toMark renderer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import { _getAdditionalThCount, _createTheadMarkdown } from '@/toMarkRenderer';

describe('toMarkRendererCreator', () => {
  describe('_getAdditionalThCount()', () => {
    it('get additional th element count, when any th has colspan', () => {
      const theadHtml = [
        '<thead>',
        '<th colspan="2">title1</th>',
        '<th>title2</th>',
        '</thead>'
      ].join('');
      const ths = $(theadHtml)
        .find('th')
        .get();
      const actual = _getAdditionalThCount(ths);

      expect(actual).toBe(1);
    });

    it('get additional th element count, when all th has not colspan', () => {
      const theadHtml = ['<thead>', '<th>title1</th>', '<th>title2</th>', '</thead>'].join('');
      const ths = $(theadHtml)
        .find('th')
        .get();
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
      const [theadElement] = $(theadHtml);
      const theadContent = '|@cols=2:title1|title2|\n';
      const actual = _createTheadMarkdown(theadElement, theadContent);

      expect(actual).toBe('|@cols=2:title1|title2|\n| --- | --- | --- |\n');
    });

    it('create thead markdown, when all th has not colspan', () => {
      const theadHtml = ['<thead>', '<th>title1</th>', '<th>title2</th>', '</thead>'].join('');
      const [theadElement] = $(theadHtml);
      const theadContent = '|title1|title2|\n';
      const actual = _createTheadMarkdown(theadElement, theadContent);

      expect(actual).toBe('|title1|title2|\n| --- | --- |\n');
    });
  });
});
