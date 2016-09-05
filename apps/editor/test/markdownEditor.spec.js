import MarkdownEditor from '../src/js/markdownEditor';
import EventManager from '../src/js/eventManager';

describe('MarkdownEditor', () => {
    let mde, em;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        em = new EventManager();
        mde = new MarkdownEditor($container, em);
    });

    afterEach(() => {
        $('body').empty();
    });

    describe('Initialize', () => {
        it('make codemirror context', () => {
            mde.init();
            expect($('.CodeMirror').length).toEqual(1);
        });
    });

    describe('Events', () => {
        beforeEach(() => {
            mde.init();
        });

        it('when something change emit contentChangedFromMarkdown event', done => {
            em.listen('contentChangedFromMarkdown', editor => {
                expect(editor).toEqual(mde);
                done();
            });

            mde.getEditor().replaceSelection('myText');
        });

        it('when something change emit changeFromMarkdown event', done => {
            em.listen('changeFromMarkdown', ev => {
                done();
            });

            mde.getEditor().replaceSelection('my');
        });

        it('when something change emit change event', done => {
            em.listen('change', ev => {
                expect(ev.source).toEqual('markdown');

                done();
            });

            mde.getEditor().replaceSelection('comment');
        });

        it('when editor gain focus, emit focus event', () => {
            em.listen('focus', ev => {
                expect(ev.source).toEqual('markdown');
            });

            mde.getEditor().focus();
        });

        it('when editor lost focus, emit blur event', () => {
            em.listen('blur', ev => {
                expect(ev.source).toEqual('markdown');
            });

            mde.getEditor().getWrapperElement().blur();
        });
    });

    describe('replaceSelection', () => {
        beforeEach(() => {
            mde.init();
        });

        it('replace selection content with passed content', () => {
            const selection = {
                from: {line: 0, ch: 0},
                to: {line: 0, ch: 0}
            };

            mde.replaceSelection('test', selection);

            expect(mde.getValue()).toEqual('test');
        });

        it('if replace selection without selection, use current selection', () => {
            mde.replaceSelection('test');
            expect(mde.getValue()).toEqual('test');
        });

        it('replace with current cursor\'s containers offset', () => {
            mde.replaceSelection('t');
            mde.replaceSelection('e');
            mde.replaceSelection('s');
            mde.replaceSelection('t');

            mde.replaceRelativeOffset('123', -2, 1);
            expect(mde.getValue()).toEqual('te123t');
        });
    });

    describe('move cursor to end or start', () => {
        beforeEach(() => {
            mde.init();
        });

        it('move cursor to end', () => {
            mde.setValue('test\ntest\ntest\n');

            mde.moveCursorToEnd();

            expect(mde.getEditor().getCursor().line).toEqual(3);
            expect(mde.getEditor().getCursor().ch).toEqual(0);
        });

        it('move cursor to start', () => {
            mde.setValue('test\ntest\ntest\n');

            mde.moveCursorToStart();

            expect(mde.getEditor().getCursor().line).toEqual(0);
            expect(mde.getEditor().getCursor().ch).toEqual(0);
        });
    });

    describe('setValue', () => {
        beforeEach(() => {
            mde.init();
        });
        it('move cursor to end after setValue', () => {
            mde.setValue('test\ntest\ntest\n');

            expect(mde.getEditor().getCursor().line).toEqual(3);
            expect(mde.getEditor().getCursor().ch).toEqual(0);
        });
    });

    describe('getRange', () => {
        beforeEach(() => {
            mde.init();
        });
        it('get current selection range', () => {
            const start = mde.getEditor().getCursor('from');
            const end = mde.getEditor().getCursor('to');
            const range = mde.getRange();

            expect(range.start).toBeDefined();
            expect(range.start.line).toEqual(start.line);
            expect(range.start.ch).toEqual(start.ch);
            expect(range.end).toBeDefined();
            expect(range.end.line).toEqual(end.line);
            expect(range.end.ch).toEqual(end.ch);
        });
    });

    //we dont make codemirror scrollTop tc cuz codemirror css file could not be loaded
    xdescribe('get, set scrollTop', () => {
        beforeEach(() => {
            mde.init();
        });
        it('get scrollTop', () => {
            mde.setHeight(50);

            mde.setValue('1\n2\n3\n4\n5\n1\n2\n3\n4\n5\n');
            mde.scrollTop(10);
            expect(mde.scrollTop()).not.toEqual(0);
        });
    });
});
