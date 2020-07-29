/**
 * @fileoverview test ChangeTaskMarker command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import changeTaskMarker from '@/markdownCommands/changeTaskMarker';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('ChangeTaskMarker command', () => {
  let cm, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());
    cm = mde.getEditor();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('spaces before state character in marker are removed', () => {
    cm.setValue('* [  x] list');
    cm.setCursor({ line: 0, ch: 3 });

    changeTaskMarker.exec(mde);

    expect(cm.getValue()).toBe('* [x] list');
  });

  it('spaces after state character in marker are removed', () => {
    cm.setValue('* [x  ] list');
    cm.setCursor({ line: 0, ch: 5 });

    changeTaskMarker.exec(mde);

    expect(cm.getValue()).toBe('* [x] list');
  });

  it('all spaces in marker are removed', () => {
    cm.setValue('* [    x  ] list');
    cm.setCursor({ line: 0, ch: 3 });

    changeTaskMarker.exec(mde);

    expect(cm.getValue()).toBe('* [x] list');
  });

  it('space is added if marker has no spaces', () => {
    cm.setValue('* [] list');
    cm.setCursor({ line: 0, ch: 3 });

    changeTaskMarker.exec(mde);

    expect(cm.getValue()).toBe('* [ ] list');
  });
});
