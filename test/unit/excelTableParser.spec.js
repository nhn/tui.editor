/**
 * @fileoverview test excel table parser
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import excelTableParser from '@/excelTableParser';

describe('excelTableParser', () => {
  let content;

  describe('parse excel paste data to object', () => {
    it('2 x 2', () => {
      content = 'a\tb\nc\td';

      expect(excelTableParser(content)).toEqual({
        col: 2,
        row: 2,
        data: ['a', 'b', 'c', 'd']
      });
    });

    it('2 x 3', () => {
      content = 'a\tb\nc\td\ne\tf';

      expect(excelTableParser(content)).toEqual({
        col: 2,
        row: 3,
        data: ['a', 'b', 'c', 'd', 'e', 'f']
      });
    });

    it('3 x 2 has empty cell in middle of first row', () => {
      content = 'a\t\tc\nd\te\tf';

      expect(excelTableParser(content)).toEqual({
        col: 3,
        row: 2,
        data: ['a', '', 'c', 'd', 'e', 'f']
      });
    });

    it('3 x 2 has empty cell last', () => {
      content = 'a\tb\tc\nd\te\t';

      expect(excelTableParser(content)).toEqual({
        col: 3,
        row: 2,
        data: ['a', 'b', 'c', 'd', 'e', '']
      });
    });

    it('3 x 2 has cell contains a space', () => {
      content = 'a b\tc\td\ne f\tg\ti';

      expect(excelTableParser(content)).toEqual({
        col: 3,
        row: 2,
        data: ['a b', 'c', 'd', 'e f', 'g', 'i']
      });
    });

    it('3 x 2 has cell contains a blocking content', () => {
      content = 'a\tb\t"this is \r\nblocking content"\na b\te\tf';

      expect(excelTableParser(content)).toEqual({
        col: 3,
        row: 2,
        data: ['a', 'b', 'this is <br/>blocking content', 'a b', 'e', 'f']
      });
    });
  });
  describe('refine line feed difference of os', () => {
    it('CR-LF', () => {
      content = 'a\tb\tc\r\nd\te\t';

      expect(excelTableParser(content)).toEqual({
        col: 3,
        row: 2,
        data: ['a', 'b', 'c', 'd', 'e', '']
      });
    });
    it('CR', () => {
      content = 'a\tb\tc\rd\te\t';

      expect(excelTableParser(content)).toEqual({
        col: 3,
        row: 2,
        data: ['a', 'b', 'c', 'd', 'e', '']
      });
    });
  });
});
