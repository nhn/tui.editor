/**
 * @fileoverview test unmerge preparer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import {_prependMergeSyntaxToContent} from '@/extensions/table/tableUnmergePreparer';
import prepareTableUnmerge from '@/extensions/table/tableUnmergePreparer';

describe('tableUnmergePreparer', () => {
  describe('_prependMergeSyntaxToContent()', () => {
    it('Prepend merge syntax to content, when has colspan', () => {
      const $td = $('<td colspan="2">value</td>');

      expect($td.html()).toBe('value');

      _prependMergeSyntaxToContent($td[0]);

      expect($td.html()).toBe('@cols=2:value');
    });

    it('Prepend merge syntax to content, when has rowspan', () => {
      const $td = $('<td rowspan="2">value</td>');

      expect($td.html()).toBe('value');

      _prependMergeSyntaxToContent($td[0]);

      expect($td.html()).toBe('@rows=2:value');
    });

    it('Prepend merge syntax to content, when has both colspan and rowspan', () => {
      const $td = $('<td colspan="2" rowspan="2">value</td>');

      expect($td.html()).toBe('value');

      _prependMergeSyntaxToContent($td[0]);

      expect($td.html()).toBe('@rows=2:@cols=2:value');
    });

    it('Prepend merge syntax to content, when has not both colspan and rowspan', () => {
      const $td = $('<td>value</td>');

      expect($td.html()).toBe('value');

      _prependMergeSyntaxToContent($td[0]);

      expect($td.html()).toBe('value');
    });
  });

  describe('prepareTableUnmerge', () => {
    it('Prepare table unmerge.', () => {
      const tableHtml = [
        '<table>',
        '<thead>',
        '<tr><th colspan="2">title</th></tr>',
        '</thead>',
        '<tbody>',
        '<tr><td>content1-1</td><td rowspan="2">content1-2</td></tr>',
        '<tr><td>content2-1</td></tr>',
        '<tbody>',
        '</table>'
      ].join('');
      const tableElement = $(tableHtml)[0];
      const actual = prepareTableUnmerge(tableElement);
      const $actual = $(actual);

      expect($actual.find('th').eq(0).html()).toBe('@cols=2:title');
      expect($actual.find('td').eq(1).html()).toBe('@rows=2:content1-2');
    });
  });
});
