import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';
import { getTextContent } from './util';

let mde: MarkdownEditor, em: EventEmitter;

function dispatchKeyup() {
  const event = new KeyboardEvent('keyup', {
    key: 'backspace',
    bubbles: true,
    cancelable: true,
  });

  mde.view.dom.dispatchEvent(event);
}

beforeEach(() => {
  em = new EventEmitter();
  mde = new MarkdownEditor(em, { toastMark: new ToastMark() });
});

afterEach(() => {
  mde.destroy();
});

describe('smart task', () => {
  it('should add space between task brackets when collapsed', () => {
    mde.setMarkdown('* [] aaa');
    mde.setSelection([1, 4], [1, 4]);

    dispatchKeyup();

    expect(getTextContent(mde)).toBe('* [ ] aaa');
  });

  it('should remove spaces between task brackets when unnecessary spaces are included', () => {
    mde.setMarkdown('* [ x ] aaa');
    mde.setSelection([1, 4], [1, 4]);

    dispatchKeyup();

    expect(getTextContent(mde)).toBe('* [x] aaa');
  });

  it('should not emit script error and apply smart task when cursor position is not in the task list', () => {
    mde.setMarkdown('*  *aaa*');
    mde.setSelection([1, 4], [1, 4]);

    dispatchKeyup();

    expect(getTextContent(mde)).toBe('*  *aaa*');
  });
});
