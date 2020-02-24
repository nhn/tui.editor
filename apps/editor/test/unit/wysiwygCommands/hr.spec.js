/**
 * @fileoverview test wysiwyg hr command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import HR from '@/wysiwygCommands/hr';
import WwTaskManager from '@/wwTaskManager';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('HR', () => {
  let container, wwe, sq;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();

    sq = wwe.getEditor();
    wwe.componentManager.addManager('task', WwTaskManager);
    sq.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('add HR and if there is no next block then append default block', () => {
    const range = sq.getSelection().cloneRange();

    range.setStart(wwe.getBody().querySelectorAll('div')[0], 0);
    range.collapse(true);
    sq.setSelection(range);

    HR.exec(wwe);

    expect(wwe.getBody().querySelectorAll('hr').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('div').length).toEqual(3);
  });

  it('add HR and if there is next block then dont make default block', () => {
    const range = sq.getSelection().cloneRange();

    sq.setHTML('<div>test</div><div><br></div>');

    range.setStart(wwe.getBody().querySelectorAll('div')[0], 0);
    range.collapse(true);

    sq.setSelection(range);

    HR.exec(wwe);

    expect(
      wwe
        .getEditor()
        .getHTML()
        .replace(/<br \/>|<br>/g, '')
    ).toEqual(
      '<div>test</div><div contenteditable="false"><hr contenteditable="false"></div><div></div>'
    );
  });

  it('append hr then cursor to next block', () => {
    const range = sq.getSelection().cloneRange();

    sq.setHTML('<div>test</div><div><br></div>');

    range.setStart(wwe.getBody().querySelectorAll('div')[0], 0);
    range.collapse(true);

    sq.setSelection(range);

    HR.exec(wwe);

    expect(sq.getSelection().startContainer).toBe(wwe.getBody().querySelectorAll('div')[2]);
  });
});
