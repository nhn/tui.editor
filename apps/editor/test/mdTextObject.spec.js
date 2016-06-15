'use strict';

var MdTextObject = require('../src/js/mdTextObject');
var MarkdownEditor = require('../src/js/markdownEditor');
var EventManager = require('../src/js/eventManager');

describe('MdTextObject', function() {
    var cm, doc, mde, to;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        mde = new MarkdownEditor($container, new EventManager());

        mde.init();

        cm = mde.getEditor();

        cm.setValue('test textObject');
        doc = cm.getDoc();
    });

    //mde를 몰르고 getSelection API를 만들어서 change이벤트에서 업데이트 하는방식으로 가자
    //즉 커런트셀렉션이고 뭐고를 textObject는 모르도록
    describe('set range', function() {
        beforeEach(function() {
            to = new MdTextObject(mde);
        });

        it('if constructor has no range argument then use current range', function() {
            var range = mde.getRange();
            expect(range.start).toEqual(to._start);
            expect(range.end).toEqual(to._end);
        });

        it('set start and set end', function() {
            var cursor = {line: 1, ch: 1};

            to._setStart(cursor);
            to._setEnd(cursor);

            expect(to._start).toEqual(cursor);
            expect(to._end).toEqual(cursor);
        });

        it('set with range', function() {
            var range = mde.getRange();

            expect(to._start).toEqual(range.start);
            expect(to._end).toEqual(range.end);
        });
    });

    describe('Get text of range', function() {
        beforeEach(function() {
            to = new MdTextObject(mde, {
                start: {
                    line: 0,
                    ch: 1
                },
                end: {
                    line: 0,
                    ch: 3
                }
            });
        });
        it('get text', function() {
            expect(to.getTextContent()).toEqual('es');
        });
    });

    describe('Update range', function() {
        beforeEach(function() {
            to = new MdTextObject(mde, {
                start: {
                    line: 0,
                    ch: 1
                },
                end: {
                    line: 0,
                    ch: 3
                }
            });
        });
        it('set end before range', function() {
            var expected = {
                line: 0,
                ch: 6
            };

            to.setEndBeforeRange({start: expected});

            expect(to._end).toEqual(expected);
            expect(to.getTextContent()).toEqual('est t');
        });
    });

    describe('Range expand', function() {
        beforeEach(function() {
            to = new MdTextObject(mde, {
                start: {
                    line: 0,
                    ch: 1
                },
                end: {
                    line: 0,
                    ch: 3
                }
            });
        });

        it('Expand start offset', function() {
            to.expandStartOffset();
            expect(to.getTextContent()).toEqual('tes');
        });
        it('Expand end offset', function() {
            to.expandEndOffset();
            expect(to.getTextContent()).toEqual('est');
        });
    });
    describe('Replace range with text', function() {
        beforeEach(function() {
            to = new MdTextObject(mde, {
                start: {
                    line: 0,
                    ch: 1
                },
                end: {
                    line: 0,
                    ch: 3
                }
            });
        });

        it('replace text', function() {
            to.replaceContent('12');
            expect(doc.getValue()).toEqual('t12t textObject');
        });
    });

    describe('Delete text content within range', function() {
        beforeEach(function() {
            to = new MdTextObject(mde, {
                start: {
                    line: 0,
                    ch: 1
                },
                end: {
                    line: 0,
                    ch: 3
                }
            });
        });

        it('delete text', function() {
            to.deleteContent();
            expect(doc.getValue()).toEqual('tt textObject');
        });
    });
});
