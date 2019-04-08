/**
 * @fileoverview test i18n
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import {I18n} from '../../src/js/i18n';

describe('I18n', () => {
  let i18n;

  beforeEach(() => {
    i18n = new I18n();
  });
  it('should add lang set', () => {
    i18n.setLanguage('ko_KR', {
      'Hello': '안녕하세요'
    });

    expect(i18n.get('Hello', 'ko_KR')).toEqual('안녕하세요');
  });
  it('should add lang set with array locale code', () => {
    i18n.setLanguage(['ko', 'ko_KR'], {
      'Hello': '안녕하세요'
    });
    expect(i18n.get('Hello', 'ko_KR')).toEqual('안녕하세요');
    expect(i18n.get('Hello', 'ko')).toEqual('안녕하세요');
  });
  it('should update lang data', () => {
    i18n.setLanguage('ko_KR', {
      'Hello': '안녕하세요',
      'Bye': '안녕히가세요'
    });

    i18n.setLanguage('ko_KR', {
      'Bye': '잘가'
    });

    expect(i18n.get('Hello', 'ko_KR')).toEqual('안녕하세요');
    expect(i18n.get('Bye', 'ko_KR')).toEqual('잘가');
  });
  it('can use default locale code as en_US', () => {
    i18n.setLanguage('en_US', {
      'Hello': 'Hello',
      'Bye': 'Hello'
    });
    expect(i18n.get('Hello')).toEqual('Hello');
  });
  it('should set locale code', () => {
    i18n.setLanguage('en_US', {
      'Hello': 'Hello',
      'Bye': 'Hello'
    });

    i18n.setLanguage('ko_KR', {
      'Hello': '안녕하세요',
      'Bye': '안녕히가세요'
    });

    i18n.setCode('ko_KR');

    expect(i18n.get('Hello')).toEqual('안녕하세요');
  });
  it('should use default lang data if dont have current lang set', () => {
    i18n.setLanguage('en_US', {
      'Hello': 'Hello',
      'Bye': 'Hello'
    });

    i18n.setCode('fr_FR');

    expect(i18n.get('Hello')).toEqual('Hello');
  });
});
