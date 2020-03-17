/**
 * @fileoverview test component manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import WysiwygEditor from '@/wysiwygEditor';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('ComponentManager', () => {
  let container, container2, em, wwe, mde;

  beforeEach(() => {
    container = document.createElement('div');
    container2 = document.createElement('div');

    document.body.appendChild(container);
    document.body.appendChild(container2);

    em = new EventManager();

    wwe = new WysiwygEditor(container, em);
    mde = new MarkdownEditor(container2, em, new ToastMark());

    wwe.init();

    wwe.editor.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      container.parentNode.removeChild(container);
      container2.parentNode.removeChild(container2);
      done();
    });
  });

  describe('manager handling', () => {
    it('add and get manager independent of editor type', () => {
      const manager = jasmine.createSpy('manager');

      wwe.componentManager.addManager('myManager', manager);

      expect(manager).toHaveBeenCalledWith(wwe);
      expect(wwe.componentManager.getManager('myManager')).toBeDefined();
      expect(mde.componentManager.getManager('myManager')).toBeUndefined();
    });

    it('add manager only passing manager constructor', () => {
      const manager = () => {
        return { name: 'myManager' };
      };

      mde.componentManager.addManager(manager);

      expect(mde.componentManager.getManager('myManager')).toBeDefined();
      expect(wwe.componentManager.getManager('myManager')).toBeUndefined();
    });
  });
});
