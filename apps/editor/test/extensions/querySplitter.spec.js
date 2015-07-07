'use strict';

var Neditor = require('../../src/js/editor');

describe('querySplitter', function() {
    var ned, em;

    beforeEach(function() {
        $('body').empty();
        $('body').html('<div id="editSection"></div>');
    });

    describe('wysiwyg', function() {
        beforeEach(function(done) {
            ned = new Neditor({
                el: $('#editSection'),
                previewStyle: 'tab',
                height: 300,
                delay: 300,
                name: 'exiff',
                initialEditType: 'wysiwyg',
                exts: ['querySplitter'],
                querySplitter: {
                    queryRx: /@[^@\s]*/
                },
                onload: function(editor) {
                    ned = editor;
                    em = editor.eventManager;
                    done();
                }
            });
        });

        it('if there is no query text in caret placed context then query event not fire', function() {
            var eventObject = {
                    selection: {},
                    textContent: 'awefawefwef',
                    caretOffset: 10
                },
                handler = jasmine.createSpy('handler');


            em.listen('query', handler);

            em.emit('change.wysiwygEditor', eventObject);
            expect(handler).not.toHaveBeenCalled();
        });

        it('if there is query text in caret placed context then fireEvent', function() {
            var eventObject = {
                    selection: {},
                    textContent: 'awefa@wefwef',
                    caretOffset: 10
                },
                handler = jasmine.createSpy('handler');


            em.listen('query', handler);

            em.emit('change.wysiwygEditor', eventObject);
            expect(handler).toHaveBeenCalled();
        });

        it('if when removed caret context that contain query text then fireEvent with undefined context', function() {
            var queryObject = '',
                eventObject1 = {
                    selection: {},
                    textContent: 'awefa@wefwef',
                    caretOffset: 10
                },
                eventObject2 = {
                    selection: {},
                    textContent: '',
                    caretOffset: 0
                };


            em.listen('query', function(q) {
                queryObject = q;
            });

            em.emit('change.wysiwygEditor', eventObject1);
            em.emit('change.wysiwygEditor', eventObject2);

            expect(queryObject).toBeUndefined();
        });

        it('@abcdef_ -> @abcdef _ = query event with undefined', function() {
            var queryObject = '',
                eventObject1 = {
                    selection: {},
                    textContent: '@abcdef',
                    caretOffset: 7
                },
                eventObject2 = {
                    selection: {},
                    textContent: '@abcdef ',
                    caretOffset: 8
                };

            em.listen('query', function(q) {
                queryObject = q;
            });

            em.emit('change.wysiwygEditor', eventObject1);
            em.emit('change.wysiwygEditor', eventObject2);

            expect(queryObject).toBeUndefined();
        });

        it('@abcdef _ -> @abcdef_ = nothing, query event with "@abcdef"', function() {
            var result = [],
                eventObject1 = {
                    selection: {},
                    textContent: '@abcdef ',
                    caretOffset: 8
                },
                eventObject2 = {
                    selection: {},
                    textContent: '@abcdef',
                    caretOffset: 7
                };

            em.listen('query', function(q) {
                result.push(q);
            });

            em.emit('change.wysiwygEditor', eventObject1);
            em.emit('change.wysiwygEditor', eventObject2);

            expect(result[0]).toBeUndefined();
            expect(result[1].text).toEqual('@abcdef');
            expect(result[1].currentText).toEqual('f');
            expect(result[1].caretOffset).toEqual(7);
            expect(result[1].startOffset).toEqual(0);
        });

        it('xxx_ -> xxx@_ = query event with "@"', function() {
            var result = [],
                eventObject1 = {
                    selection: {},
                    textContent: 'xxx',
                    caretOffset: 3
                },
                eventObject2 = {
                    selection: {},
                    textContent: 'xxx@',
                    caretOffset: 4
                };

            em.listen('query', function(q) {
                result.push(q);
            });

            em.emit('change.wysiwygEditor', eventObject1);
            em.emit('change.wysiwygEditor', eventObject2);

            expect(result[0].text).toEqual('@');
            expect(result[0].currentText).toEqual('@');
            expect(result[0].caretOffset).toEqual(4);
            expect(result[0].startOffset).toEqual(3);
        });

        it('xxx@_ -> xxx_ = query event with "@"', function() {
            var result = [],
                eventObject1 = {
                    selection: {},
                    textContent: 'xxx@',
                    caretOffset: 4
                },
                eventObject2 = {
                    selection: {},
                    textContent: 'xxx',
                    caretOffset: 3
                };

            em.listen('query', function(q) {
                result.push(q);
            });

            em.emit('change.wysiwygEditor', eventObject1);
            em.emit('change.wysiwygEditor', eventObject2);

            expect(result[1]).toBeUndefined();
        });

        it('abc @ef _ gh @i -> abc @ef_ gh @i = query event with "@ef"', function() {
            var result = [],
                eventObject1 = {
                    selection: {},
                    textContent: 'abc @ef   gh @i',
                    caretOffset: 8
                },
                eventObject2 = {
                    selection: {},
                    textContent: 'abc @ef  gh @i',
                    caretOffset: 7
                };

            em.listen('query', function(q) {
                result.push(q);
            });

            em.emit('change.wysiwygEditor', eventObject1);
            em.emit('change.wysiwygEditor', eventObject2);

            expect(result[0]).toBeUndefined();
            expect(result[1].text).toEqual('@ef');
            expect(result[1].currentText).toEqual('f');
            expect(result[1].caretOffset).toEqual(7);
            expect(result[1].startOffset).toEqual(4);
        });

        it('abc @ef_ gh @i -> abc @ef _ gh @i = query event with "@ef"', function() {
            var result = [],
                eventObject1 = {
                    selection: {},
                    textContent: 'abc @ef  gh @i',
                    caretOffset: 7
                },
                eventObject2 = {
                    selection: {},
                    textContent: 'abc @ef   gh @i',
                    caretOffset: 8
                };

            em.listen('query', function(q) {
                result.push(q);
            });

            em.emit('change.wysiwygEditor', eventObject1);
            em.emit('change.wysiwygEditor', eventObject2);

            expect(result[1]).toBeUndefined();
        });

        it('abc @ef gh @i _ -> abc @ef gh @i_ = query event with "@ef"', function() {
            var result = [],
                eventObject1 = {
                    selection: {},
                    textContent: 'abc @ef gh @i ',
                    caretOffset: 14
                },
                eventObject2 = {
                    selection: {},
                    textContent: 'abc @ef gh @i',
                    caretOffset: 13
                };

            em.listen('query', function(q) {
                result.push(q);
            });

            em.emit('change.wysiwygEditor', eventObject1);
            em.emit('change.wysiwygEditor', eventObject2);

            expect(result[0]).toBeUndefined();
            expect(result[1].text).toEqual('@i');
            expect(result[1].currentText).toEqual('i');
            expect(result[1].caretOffset).toEqual(13);
            expect(result[1].startOffset).toEqual(11);
        });
    });
});
