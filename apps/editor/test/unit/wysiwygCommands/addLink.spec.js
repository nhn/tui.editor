/**
 * @fileoverview test wysiwyg add link command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import AddLink from '@/wysiwygCommands/addLink';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('AddLink', () => {
  let container, wwe;

  beforeEach(() => {
    const linkAttribute = { target: '_blank' };

    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager(), { linkAttribute });

    wwe.init();
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('add link to current selection', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('line');

    range.selectNodeContents(wwe.getBody().querySelectorAll('div')[0].firstChild);
    wwe.getEditor().setSelection(range);

    AddLink.exec(wwe, {
      url: '#url',
      linkText: 'inputText'
    });

    expect(wwe.getBody().querySelectorAll('a').length).toEqual(1);
    expect(
      wwe
        .getBody()
        .querySelector('a')
        .getAttribute('href')
    ).toEqual('#url');
    expect(wwe.getBody().querySelector('a').textContent).toEqual('line');
  });

  it('add link with no selection text', () => {
    AddLink.exec(wwe, {
      url: '#url',
      linkText: 'inputText'
    });

    expect(wwe.getBody().querySelectorAll('a').length).toEqual(1);
    expect(
      wwe
        .getBody()
        .querySelector('a')
        .getAttribute('href')
    ).toEqual('#url');
    expect(wwe.getBody().querySelector('a').textContent).toEqual('inputText');
  });

  it('should add link with decoded text', () => {
    AddLink.exec(wwe, {
      url: '',
      linkText: '%ED%95%9C%EA%B8%80%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C'
    });

    expect(wwe.getBody().querySelector('a').textContent).toEqual('한글유니코드');
  });

  it('should add link markdown characters encoded url', () => {
    AddLink.exec(wwe, {
      url: '()[]<>',
      linkText: ''
    });

    expect(
      wwe
        .getBody()
        .querySelector('a')
        .getAttribute('href')
    ).toEqual('%28%29%5B%5D%3C%3E');
  });

  it('should apply linkAttribute option to link node', () => {
    AddLink.exec(wwe, {
      url: 'https://www.google.com',
      linkText: 'google'
    });

    expect(
      wwe
        .getBody()
        .querySelector('a')
        .getAttribute('target')
    ).toEqual('_blank');
  });
});
