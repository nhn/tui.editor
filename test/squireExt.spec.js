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

           //IE 스탠다드 모드전환시 load이벤트 발생문제로 done 지연처리
           //IE의 경우 첫 로드이벤트 진입후 쿼크모드인경우 doctype을 삽입하면서 load이벤트가 동기로 바로 발생된다.
           //동기로 바로실행되고 그때 바로 done이 실행되버리면 처음 로드이벤트의 진입되었을때의 프로세스가 남은 채로 테스트케이스에 진입하고 테스트가 완료되면
           //카르마는 다음 TC를 돌리는데 이때 이전에 남은 프로세스와 꼬여서 IE에서 오류가 발생한다. 그래서 남은 프로세스를 진행한후 done실행하기위해 지연처리
           setTimeout(done, 0);
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

    describe('getSelectionInfoByOffset() find next element and next offset by passed element and replative offset of splited text node', function() {
        var firstBlock;

        beforeEach(function() {
            sqe.modifyBlocks(function(frag) {
                frag = sqe.getDocument().createDocumentFragment();
                frag.appendChild(sqe.getDocument().createTextNode('text1'));
                frag.appendChild(sqe.getDocument().createTextNode('text2'));

                return frag;
            });

            firstBlock = sqe.getDocument().body.childNodes[0];
        });

        it('offset is lower than passed element\'s length', function() {
            expect(sqe.getSelectionInfoByOffset(firstBlock, 3)).toEqual({
                element: firstBlock,
                offset: 3
            });
        });

        it('offset is higher than passed element\'s length', function() {
            expect(sqe.getSelectionInfoByOffset(firstBlock, 7)).toEqual({
                element: firstBlock.nextSibling,
                offset: 2
            });
        });

        it('offset is higher than exist content length', function() {
            expect(sqe.getSelectionInfoByOffset(firstBlock, 11)).toEqual({
                element: firstBlock.nextSibling,
                offset: 5
            });
        });
    });

    describe('replaceParent()', function() {
        it('replace li\'s parent ul to ol', function() {
            sqe.setHTML('<ul><li>test</li></ul>');

            sqe.replaceParent(sqe.get$Body().find('li'), 'UL', 'OL');

            expect(sqe.get$Body().find('ul').length).toEqual(0);
            expect(sqe.get$Body().find('ol').length).toEqual(1);
            expect(sqe.get$Body().find('li').text()).toEqual('test');
        });
    });

    describe('preserveLastLine()', function() {
        it('insert new emtpy line if dont have any default line in bottom', function() {
            sqe.setHTML('<h1>HELLO WORLD</h1>');
            sqe.preserveLastLine();
            expect(sqe.get$Body().find('div').length).toEqual(1);
        });

        it('dont insert new emtpy line if have default line in bottom', function() {
            sqe.setHTML('<h1>HELLO WORLD</h1><div>test<br></div>');
            sqe.preserveLastLine();
            expect(sqe.get$Body().find('div').length).toEqual(1);
        });
    });

    describe('scrollTop', function() {
        it('move scroll or get scrollTop value', function() {
            sqe.setHTML('a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>');
            sqe.scrollTop(50);
            expect(sqe.scrollTop()).not.toEqual(0);
        });
    });
});
