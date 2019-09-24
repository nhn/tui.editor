/**
 * @fileoverview test wysiwyg add link command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import AddLink from '@/wysiwygCommands/addLink';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('AddLink', () => {
  let wwe;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('add link to current selection', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('line');

    range.selectNodeContents(wwe.get$Body().find('div')[0].firstChild);
    wwe.getEditor().setSelection(range);

    AddLink.exec(wwe, {
      url: '#url',
      linkText: 'inputText'
    });

    expect(wwe.get$Body().find('a').length).toEqual(1);
    expect(wwe.get$Body().find('a').attr('href')).toEqual('#url');
    expect(wwe.get$Body().find('a').text()).toEqual('line');
  });

  it('add link with no selection text', () => {
    AddLink.exec(wwe, {
      url: '#url',
      linkText: 'inputText'
    });

    expect(wwe.get$Body().find('a').length).toEqual(1);
    expect(wwe.get$Body().find('a').attr('href')).toEqual('#url');
    expect(wwe.get$Body().find('a').text()).toEqual('inputText');
  });

  it('should add link with decoded text', () => {
    AddLink.exec(wwe, {
      url: '',
      linkText: '%ED%95%9C%EA%B8%80%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C'
    });

    expect(wwe.get$Body().find('a').text()).toEqual('한글유니코드');
  });

  it('should add link markdown characters encoded url', () => {
    AddLink.exec(wwe, {
      url: '()[]<>',
      linkText: ''
    });

    expect(wwe.get$Body().find('a').attr('href')).toEqual('%28%29%5B%5D%3C%3E');
  });
});
