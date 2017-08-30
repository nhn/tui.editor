import TuiEditor from '../../src/js/editor';

describe('taskCounter', () => {
    let ned, container;

    beforeEach(() => {
        $('body').html('<div id="editSection"></div>');
    });

    // we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    describe('viewOnly', () => {
        beforeEach(() => {
            ned = TuiEditor.factory({
                el: $('#editSection').get(0),
                viewOnly: true,
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
                el: $('#editSection').get(0),
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
                el: $('#editSection').get(0),
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

