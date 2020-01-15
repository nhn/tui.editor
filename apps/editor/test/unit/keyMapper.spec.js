/**
 * @fileoverview test key mapper
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import KeyMapper from '@/keyMapper';

describe('KeyMapper', () => {
  let km;

  describe('Convert KeyboardEvent to string', () => {
    beforeEach(() => {
      km = new KeyMapper();
    });

    it('convert letter', () => {
      const ke = {
        keyCode: 'A'.charCodeAt(0)
      };

      expect(km.convert(ke)).toEqual('A');
    });

    it('convert altKey combination', () => {
      const ke = {
        keyCode: 'B'.charCodeAt(0),
        altKey: true
      };

      expect(km.convert(ke)).toEqual('ALT+B');
    });

    it('convert ctrlKey combination', () => {
      const ke = {
        keyCode: '1'.charCodeAt(0),
        ctrlKey: true
      };

      expect(km.convert(ke)).toEqual('CTRL+1');
    });

    it('convert metaKey combination', () => {
      const ke = {
        keyCode: '1'.charCodeAt(0),
        metaKey: true
      };

      expect(km.convert(ke)).toEqual('META+1');
    });

    it('convert shiftKey combination', () => {
      const ke = {
        keyCode: '0'.charCodeAt(0),
        shiftKey: true
      };

      expect(km.convert(ke)).toEqual('SHIFT+0');
    });

    it('convert ctrl + alt combination', () => {
      const ke = {
        keyCode: 219,
        ctrlKey: true,
        altKey: true
      };

      expect(km.convert(ke)).toEqual('CTRL+ALT+[');
    });

    it('convert shift + ctrl + alt combination', () => {
      const ke = {
        keyCode: 59,
        ctrlKey: true,
        altKey: true,
        shiftKey: true
      };

      expect(km.convert(ke)).toEqual('SHIFT+CTRL+ALT+;');
    });

    it('convert shift + ctrl + alt + meta combination', () => {
      const ke = {
        keyCode: 59,
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
        metaKey: true
      };

      expect(km.convert(ke)).toEqual('SHIFT+CTRL+META+ALT+;');
    });
  });

  describe('Change splitter by option', () => {
    beforeEach(() => {
      km = new KeyMapper({
        splitter: '_'
      });
    });
    it('change splitter to underscore', () => {
      const ke = {
        keyCode: 'B'.charCodeAt(0),
        altKey: true
      };

      expect(km.convert(ke)).toEqual('ALT_B');
    });
  });
});
