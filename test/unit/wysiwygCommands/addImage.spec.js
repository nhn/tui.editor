/**
 * @fileoverview test wysiwyg add image command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import AddImage from '../../../src/js/wysiwygCommands/addImage';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import EventManager from '../../../src/js/eventManager';

describe('AddImage', () => {
  let wwe, $container;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $container.remove();
      done();
    });
  });

  it('add image to current selection', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('line');

    range.selectNodeContents(wwe.get$Body().find('div')[0].firstChild);
    wwe.getEditor().setSelection(range);

    AddImage.exec(wwe, {
      altText: 'altText',
      imageUrl: '#url'
    });

    expect(wwe.get$Body().find('img').length).toEqual(1);
    expect(wwe.get$Body().find('img').attr('src')).toEqual('#url');
    expect(wwe.get$Body().find('img').attr('alt')).toEqual('altText');
  });

  it('add image with no selection text', () => {
    AddImage.exec(wwe, {
      altText: 'altText',
      imageUrl: '#url'
    });

    expect(wwe.get$Body().find('img').length).toEqual(1);
    expect(wwe.get$Body().find('img').attr('src')).toEqual('#url');
    expect(wwe.get$Body().find('img').attr('alt')).toEqual('altText');
  });

  it('should add image with decoded text', () => {
    AddImage.exec(wwe, {
      altText: '%ED%95%9C%EA%B8%80%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C',
      imageUrl: ''
    });

    expect(wwe.get$Body().find('img').attr('alt')).toEqual('한글유니코드');
  });

  it('should add image markdown characters encoded url', () => {
    AddImage.exec(wwe, {
      imageUrl: '()[]<>',
      altText: ''
    });

    expect(wwe.get$Body().find('img').attr('src')).toEqual('%28%29%5B%5D%3C%3E');
  });
});
