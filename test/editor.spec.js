import Editor from '../src/js/editor';

describe('Editor', () => {
    let editor;

    describe('Api', () => {
        beforeEach(() => {
            editor = new Editor({
                el: $('body'),
                height: 300,
                initialEditType: 'markdown'
            });
        });

        //we need to wait squire input event process
        afterEach(done => {
            setTimeout(() => {
                $('body').empty();
                done();
            });
        });

        describe('contentHeight()', () => {
            it('set content height', () => {
                editor.contentHeight(500);
                expect($('.te-md-container .te-editor').height()).toEqual(500);
                expect($('.te-preview').height()).toEqual(500);
                expect($('.te-ww-container .te-editor').height()).toEqual(500);
            });

            it('get content height', () => {
                expect(editor.contentHeight()).toEqual(300);
            });

            it('set content height "auto" to fit contents height of wysiwyg', () => {
                let height = $('.te-ww-container .te-editor').height();
                editor.contentHeight('auto');
                editor.changeMode('wysiwyg');
                editor.setValue('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.te-ww-container .tui-editor-contents').height()).not.toEqual(height);
            });

            it('set content height "auto" to fit contents height of markdown', () => {
                let height = $('.te-md-container .te-editor').height();
                editor.contentHeight('auto');
                editor.setValue('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.te-md-container .te-editor').height()).not.toEqual(height);
            });
        });
        describe('setValue()', () => {
            it('fire setValueAfter evnet after setValue', done => {
                editor.on('setValueAfter', done);
                editor.setValue('dd');
            });
        });
        describe('changePreviewStyle()', () => {
            it('Preview should refreash after preview style is changed', () => {
                editor.changePreviewStyle('tab');
                editor.setValue('1\n2');
                editor.changePreviewStyle('vertical');
                expect(editor.preview.$el.text()).toEqual('1\n2\n');
            });
        });
    });
});

