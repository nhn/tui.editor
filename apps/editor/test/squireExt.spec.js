'use strict';

var SquireExt = require('../src/js/squireExt');

describe('SquireExt', function() {
    var sqe;

    beforeEach(function(done) {
        var $iframe;

        $iframe = $('<iframe />');

        $iframe.load(function() {
           var doc = $iframe[0].contentDocument;

           if (doc.compatMode !== 'CSS1Compat') {
               doc.open();
               doc.write('<!DOCTYPE html><title></title>');
               doc.close();
           }

           if (sqe) {
               return;
           }

           sqe = new SquireExt(doc, {
               blockTag: 'DIV'
           });

           done();
        });

        $('body').append($iframe);
    });

    afterEach(function() {
        $('body').empty();
        sqe = null;
    });

    describe('initialize', function() {
        it('squireExt instance defined', function() {
            expect(sqe).toBeDefined();
        });

        it('has squire prototype method', function() {
            expect(sqe.modifyBlocks).toBeDefined();
        });
    });

    describe('changeBlockFormat', function() {
        it('change block format', function() {
            var range = sqe.getSelection().cloneRange();

            sqe.get$Body().html('<h1><div>test<br></div></h1>');

            range.selectNode(sqe.getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            sqe.setSelection(range);

            sqe.changeBlockFormat('H1', 'P');

            expect(sqe.get$Body().find('p').length).toEqual(1);
            expect(sqe.get$Body().find('h1').length).toEqual(0);
        });

        it('unwrap block format', function() {
            var range = sqe.getSelection().cloneRange();

            sqe.get$Body().html('<h1><div>test<br></div></h1>');

            range.selectNode(sqe.getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            sqe.setSelection(range);

            sqe.changeBlockFormat('H1');

            expect(sqe.get$Body().find('H1').length).toEqual(0);
        });

        it('unwrap block format list', function() {
            var range = sqe.getSelection().cloneRange();

            sqe.get$Body().html('<ul><li><div>test<br></div></li></ul>');

            range.selectNode(sqe.getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            sqe.setSelection(range);

            sqe.changeBlockFormat('UL', 'OL');

            expect(sqe.get$Body().find('ul').length).toEqual(0);
            expect(sqe.get$Body().find('ol').length).toEqual(1);
        });

        it('if not mached any condition, wrap targetTagName node to first div node', function() {
            var range = sqe.getSelection().cloneRange();

            sqe.get$Body().html('<div>test<br></div>');

            range.selectNode(sqe.getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            sqe.setSelection(range);

            sqe.changeBlockFormat('UL', 'P');

            expect(sqe.get$Body().find('ul').length).toEqual(0);
            expect(sqe.get$Body().find('p').length).toEqual(1);
        });
    });

    describe('changeBlockFormatTo()', function() {
        it('change any block for to passed tagName', function() {
            var range = sqe.getSelection().cloneRange();

            sqe.get$Body().html('<h1><div>test<br></div></h1>');

            range.selectNode(sqe.getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            sqe.setSelection(range);

            sqe.changeBlockFormatTo('P');

            expect(sqe.get$Body().find('h1').length).toEqual(0);
            expect(sqe.get$Body().find('p').length).toEqual(1);
        });

        it('remove unused inputbox when change from task to another', function() {
            var range = sqe.getSelection().cloneRange();

            sqe.get$Body().html('<ul><li><div><input type="checkbox" />test<br></div></li></ul>');

            range.selectNode(sqe.getDocument().getElementsByTagName('div')[0].firstChild);
            range.collapse(true);
            sqe.setSelection(range);

            sqe.changeBlockFormatTo('H1');

            expect(sqe.get$Body().find('ul').length).toEqual(0);
            expect(sqe.get$Body().find('h1').length).toEqual(1);
        });
    });

    describe('replaceSelection()', function() {
        it('replace selection content with passed content', function() {
            var selection;

            selection = sqe.getSelection();
            sqe.replaceSelection('test', selection);
            expect(sqe.getDocument().body.textContent).toEqual('test');
        });

        it('if replace selection without selection, use current selection', function() {
            sqe.replaceSelection('test');
            expect(sqe.getDocument().body.textContent).toEqual('test');
        });
    });

    describe('replaceRelativeOffset', function() {
        it('replace with current cursor\'s containers offset', function() {
            var selection;

            sqe.setHTML('test');

            //selection for user cursor mocking
            selection = sqe.getSelection();
            selection.setStart(selection.startContainer, 4);
            selection.collapse(true);
            sqe.setSelection(selection);

            sqe.replaceRelativeOffset('123', -2, 1);

            expect(sqe.getDocument().body.textContent).toEqual('te123t');
        });
    });

    describe('getSelectionInfoByOffset() find element and offset by passing element and offset', function() {
        var firstBlock;

        beforeEach(function() {
            sqe.insertPlainText('text1');
            sqe.insertPlainText('text2');

            firstBlock = sqe.getDocument().body.childNodes[0];
        });

        it('offset is lower than passed element\'s length', function() {
            expect(sqe.getSelectionInfoByOffset(firstBlock.childNodes[0], 3)).toEqual({
                element: firstBlock.childNodes[0],
                offset: 3
            });
        });

        it('offset is higher than passed element\'s length', function() {
            expect(sqe.getSelectionInfoByOffset(firstBlock.childNodes[0], 7)).toEqual({
                element: firstBlock.childNodes[1],
                offset: 2
            });
        });

        it('offset is higher than exist content length', function() {
            expect(sqe.getSelectionInfoByOffset(firstBlock.childNodes[0], 11)).toEqual({
                element: firstBlock.childNodes[1],
                offset: 5
            });
        });
    });
});
