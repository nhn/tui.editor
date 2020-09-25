/**
 * @fileoverview test wysiwyg add link command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import AddLink from '@/wysiwygCommands/addLink';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import linkManager, { CLASS_NAME_IMAGE_LINK } from '@/wwLinkManager';

describe('AddLink', () => {
  let container, wwe;

  beforeEach(() => {
    const linkAttribute = { target: '_blank' };

    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager(), { linkAttribute });

    wwe.init();
    wwe.componentManager.addManager('link', linkManager);
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

  it('should add a link when only an image is selected', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<img src="" />');

    range.selectNode(wwe.getBody().querySelector('img'));
    wwe.getEditor().setSelection(range);

    AddLink.exec(wwe, {
      url: 'link-url',
      linkText: ''
    });

    const links = wwe.getBody().querySelectorAll('a');

    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('link-url');
    expect(links[0].firstChild.nodeName).toBe('IMG');
  });

  it('should add links when the image and the link are selected', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<img src="" />foo');

    range.selectNode(wwe.getBody().querySelector('div'));
    wwe.getEditor().setSelection(range);

    AddLink.exec(wwe, {
      url: 'link-url',
      linkText: 'link-text'
    });

    const links = wwe.getBody().querySelectorAll('a');

    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('link-url');
    expect(links[0].firstChild.nodeName).toBe('IMG');
    expect(links[1].getAttribute('href')).toBe('link-url');
    expect(links[1].textContent).toBe('foo');
  });

  it('should add the class name for each image link', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<img src="" />foo<img src="" />');

    range.selectNode(wwe.getBody().querySelector('div'));
    wwe.getEditor().setSelection(range);

    AddLink.exec(wwe, {
      url: 'link-url',
      linkText: ''
    });

    const links = wwe.getBody().querySelectorAll('a');

    expect(links[0].firstChild.nodeName).toBe('IMG');
    expect(links[0].className).toBe(CLASS_NAME_IMAGE_LINK);
    expect(links[2].firstChild.nodeName).toBe('IMG');
    expect(links[2].className).toBe(CLASS_NAME_IMAGE_LINK);
  });
});
