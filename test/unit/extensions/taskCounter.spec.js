/**
 * @fileoverview test task counter extension
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import TuiEditor from '@/editor';
import '@/extensions/taskCounter';

describe('taskCounter', () => {
  let ned, wrapper;

  beforeEach(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      wrapper.parentNode.removeChild(wrapper);
      done();
    });
  });

  describe('viewer', () => {
    beforeEach(() => {
      ned = TuiEditor.factory({
        el: wrapper,
        viewer: true,
        exts: ['taskCounter']
      });
    });

    it('get task count of content', () => {
      ned.setValue('* [ ] task1\n* [ ] task2');
      expect(ned.getTaskCount()).toEqual(2);

      ned.setValue('* [ ] task1');
      expect(ned.getTaskCount()).toEqual(1);

      ned.setValue('waefwaefwe* [ ] task1\n* [ ] task2');
      expect(ned.getTaskCount()).toEqual(1);

      ned.setValue('waefawefawefwef');
      expect(ned.getTaskCount()).toEqual(0);
    });

    it('get checked task count of content', () => {
      ned.setValue('* [ ] task1\n* [x] task2');
      expect(ned.getCheckedTaskCount()).toEqual(1);

      ned.setValue('* [x] task1');
      expect(ned.getCheckedTaskCount()).toEqual(1);

      ned.setValue('waefwaefwe* [ ] task1\n* [x] task2');
      expect(ned.getCheckedTaskCount()).toEqual(1);

      ned.setValue('waefawefawefwef');
      expect(ned.getCheckedTaskCount()).toEqual(0);
    });
  });
  describe('wysiwyg', () => {
    beforeEach(() => {
      ned = new TuiEditor({
        el: wrapper,
        previewStyle: 'tab',
        height: '300px',
        initialEditType: 'wysiwyg',
        exts: ['taskCounter'],
        querySplitter: {
          queryRx: /@[^@\s]*/
        }
      });
    });

    it('get task count of content', () => {
      ned.setValue('* [ ] task1\n* [ ] task2');
      expect(ned.getTaskCount()).toEqual(2);

      ned.setValue('* [ ] task1');
      expect(ned.getTaskCount()).toEqual(1);

      ned.setValue('waefwaefwe* [ ] task1\n* [ ] task2');
      expect(ned.getTaskCount()).toEqual(1);

      ned.setValue('waefawefawefwef');
      expect(ned.getTaskCount()).toEqual(0);
    });

    it('get checked task count of content', () => {
      ned.setValue('* [ ] task1\n* [x] task2');
      expect(ned.getCheckedTaskCount()).toEqual(1);

      ned.setValue('* [x] task1');
      expect(ned.getCheckedTaskCount()).toEqual(1);

      ned.setValue('waefwaefwe* [ ] task1\n* [x] task2');
      expect(ned.getCheckedTaskCount()).toEqual(1);

      ned.setValue('waefawefawefwef');
      expect(ned.getCheckedTaskCount()).toEqual(0);
    });
  });

  describe('markdown', () => {
    beforeEach(() => {
      ned = new TuiEditor({
        el: wrapper,
        previewStyle: 'tab',
        height: '300px',
        initialEditType: 'markdown',
        exts: ['taskCounter'],
        querySplitter: {
          queryRx: /@[^@\s]*/
        }
      });
    });

    it('get task count of content', () => {
      ned.setValue('* [ ] task1\n    * [ ] task2');
      expect(ned.getTaskCount()).toEqual(2);

      ned.setValue('* [ ] task1');
      expect(ned.getTaskCount()).toEqual(1);

      ned.setValue('waefwaefwe* [ ] task1\n* [ ] task2');
      expect(ned.getTaskCount()).toEqual(1);

      ned.setValue('waefawefawefwef');
      expect(ned.getTaskCount()).toEqual(0);
    });

    it('get checked task count of content', () => {
      ned.setValue('* [ ] task1\n* [x] task2');
      expect(ned.getCheckedTaskCount()).toEqual(1);

      ned.setValue('* [x] task1');
      expect(ned.getCheckedTaskCount()).toEqual(1);

      ned.setValue('waefwaefwe* [ ] task1\n* [x] task2');
      expect(ned.getCheckedTaskCount()).toEqual(1);

      ned.setValue('waefawefawefwef');
      expect(ned.getCheckedTaskCount()).toEqual(0);
    });
  });
});
