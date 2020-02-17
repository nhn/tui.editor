/**
 * @fileoverview test wysiwyg hr manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwHrManager from '@/wwHrManager';

describe('WwHrManager', () => {
  let container, em, wwe;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();

    wwe = new WysiwygEditor(container, em);

    wwe.init();
    wwe.componentManager.addManager(WwHrManager);
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('hr has contenteditable="false" whene wysiwygSetValueAfter event fire', () => {
    wwe.getEditor().setHTML('<div>test</div><hr><div>test</div>');

    em.emit('wysiwygSetValueAfter');

    expect(
      wwe
        .getEditor()
        .getHTML()
        .replace(/<br \/>|<br>/g, '')
    ).toEqual(
      '<div>test</div><div contenteditable="false"><hr contenteditable="false"></div><div>test</div>'
    );
  });

  it('should insert empty line before hr if hr is first child of root', () => {
    wwe.getEditor().setHTML('<hr><div>test</div>');

    em.emit('wysiwygSetValueAfter');

    expect(
      wwe
        .getEditor()
        .getHTML()
        .replace(/<br \/>|<br>/g, '')
    ).toEqual(
      '<div></div><div contenteditable="false"><hr contenteditable="false"></div><div>test</div>'
    );
  });

  it('should insert empty line after hr if hr is last child of root', () => {
    wwe.getEditor().setHTML('<div>test</div><hr>');

    em.emit('wysiwygSetValueAfter');

    expect(
      wwe
        .getEditor()
        .getHTML()
        .replace(/<br \/>|<br>/g, '')
    ).toEqual(
      '<div>test</div><div contenteditable="false"><hr contenteditable="false"></div><div></div>'
    );
  });
});
