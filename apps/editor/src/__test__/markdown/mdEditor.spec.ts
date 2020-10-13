// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';

describe('MarkdownEditor', () => {
  let mde: MarkdownEditor, em: EventEmitter, container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventEmitter();
    mde = new MarkdownEditor(container, new ToastMark(), em);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should emit contentChangedFromMarkdown event when editing the content', () => {
    const spy = jest.fn();

    em.listen('contentChangedFromMarkdown', spy);

    mde.setMarkdown('# myText');

    expect(spy).toHaveBeenCalled();
  });
});
