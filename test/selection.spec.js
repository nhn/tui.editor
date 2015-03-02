var Selection = require('../src/js/selection');

describe('Selection', function() {
    'use strict';

    var sel;

    beforeEach(function() {
        $('body').html('<div id="editSection"></div>');
        $('#editSection').html('<pre contenteditable="true" class="language-markdown" style="white-space: pre" />');
        $('pre').html('Hi There\n<span>this is</span>\n<span><b>kim</b> here\n</span>\n<span>last</span>');

        sel = new Selection({
            $editorEl: $('pre')
        });
    });

    describe('createRange', function() {
        it('텍스트의 인덱스 넘버를 넘겨 range를 만든다', function() {
            var range = sel.createRange(0, 8);

            expect(range.collapsed).toEqual(false);
            expect(range.startOffset).toEqual(0);
            expect(range.startContainer.nodeValue).toEqual('Hi There\n');
            expect(range.endOffset).toEqual(8);
            expect(range.endContainer.nodeValue).toEqual('Hi There\n');
        });
    });

    describe('select', function() {
        it('시작인덱스와 끝인덱스를 입력받아 해당 영역을 셀렉트한다', function() {
            var range = sel.select(0, 16),
                rangeOfSelection = rangy.getSelection().getRangeAt(0);

            expect(rangeOfSelection.collapsed).toEqual(range.collapsed);
            expect(rangeOfSelection.commonAncestorContainer).toEqual(range.commonAncestorContainer);
            expect(rangeOfSelection.endContainer).toEqual(range.endContainer);
            expect(rangeOfSelection.startContainer).toEqual(range.startContainer);
            expect(rangeOfSelection.startOffset).toEqual(range.startOffset);
            expect(rangeOfSelection.endOffset).toEqual(range.endOffset);
        });
    });

    describe('getCurrentSelection', function() {
        it('라인 중간부터 빈라인까지의 선택 정보를 얻을 수 있다.', function() {
            var range = sel.select(10, 26),
                rangeOfSelection = sel.getCurrentSelection();


            expect(rangeOfSelection.collapsed).toEqual(range.collapsed);
            expect(rangeOfSelection.commonAncestorContainer).toEqual(range.commonAncestorContainer);
            expect(rangeOfSelection.startContainer.nodeValue).toEqual(range.startContainer.nodeValue);
            expect(rangeOfSelection.startOffset).toEqual(range.startOffset);

            //phantomJS버그로 range를 제대로 가져오지 못함
            //셀렉션의 끝부분에 개행문자에 해당되는 문자가있으
            //endContainer에 개행문자를 포함하고 있는 노드를 가져옴
            //다른 브라우저는 개행문자를 포함하고있는 노드 다음 노드를 가져옴
            if (!/PhantomJS/.test(window.navigator.userAgent)) {
                expect(rangeOfSelection.endContainer.nodeValue).toEqual(range.endContainer.nodeValue);
                expect(rangeOfSelection.endOffset).toEqual(range.endOffset);
            }
            expect(rangeOfSelection.start).toEqual(10);
            expect(rangeOfSelection.end).toEqual(26);
        });

        it('시작에 개행만 있는 노드에서 정보를 얻을 수 있다', function() {
            var range = sel.select(26, 31),
                rangeOfSelection = sel.getCurrentSelection();


            expect(rangeOfSelection.collapsed).toEqual(range.collapsed);
            expect(rangeOfSelection.commonAncestorContainer).toEqual(range.commonAncestorContainer);
            expect(rangeOfSelection.startContainer.nodeValue).toEqual(range.startContainer.nodeValue);
            expect(rangeOfSelection.startOffset).toEqual(range.startOffset);

            expect(rangeOfSelection.endContainer.nodeValue).toEqual(range.endContainer.nodeValue);
            expect(rangeOfSelection.endOffset).toEqual(range.endOffset);
            expect(rangeOfSelection.start).toEqual(26);
            expect(rangeOfSelection.end).toEqual(31);
        });

        it('빈라인의 노드에서 정보를 얻을 수 있다', function() {
            var range = sel.select(26, 26),
                rangeOfSelection = sel.getCurrentSelection();


            expect(rangeOfSelection.collapsed).toEqual(range.collapsed);
            expect(rangeOfSelection.commonAncestorContainer).toEqual(range.commonAncestorContainer);
            expect(rangeOfSelection.startContainer.nodeValue).toEqual(range.startContainer.nodeValue);
            expect(rangeOfSelection.startOffset).toEqual(range.startOffset);

            expect(rangeOfSelection.endContainer.nodeValue).toEqual(range.endContainer.nodeValue);
            expect(rangeOfSelection.endOffset).toEqual(range.endOffset);
            expect(rangeOfSelection.start).toEqual(26);
            expect(rangeOfSelection.end).toEqual(26);
        });

        it('라인의 끝에 end가 설정된 경우에도 정보를 얻을 수 있다', function() {
            var range = sel.select(0, 8),
                rangeOfSelection = sel.getCurrentSelection();


            expect(rangeOfSelection.collapsed).toEqual(range.collapsed);
            expect(rangeOfSelection.commonAncestorContainer).toEqual(range.commonAncestorContainer);
            expect(rangeOfSelection.startContainer.nodeValue).toEqual(range.startContainer.nodeValue);
            expect(rangeOfSelection.startOffset).toEqual(range.startOffset);

            expect(rangeOfSelection.endContainer.nodeValue).toEqual(range.endContainer.nodeValue);
            expect(rangeOfSelection.endOffset).toEqual(range.endOffset);
            expect(rangeOfSelection.start).toEqual(0);
            expect(rangeOfSelection.end).toEqual(8);
        });

        it('개행한 첫번째 index를 end값으로 정보를 얻을 수 있다', function() {
            var range = sel.select(0, 9),
                rangeOfSelection = sel.getCurrentSelection();

            expect(rangeOfSelection.collapsed).toEqual(range.collapsed);
            expect(rangeOfSelection.startContainer.nodeValue).toEqual(range.startContainer.nodeValue);
            expect(rangeOfSelection.startOffset).toEqual(range.startOffset);

            if (!/PhantomJS/.test(window.navigator.userAgent)) {
                expect(rangeOfSelection.commonAncestorContainer).toEqual(range.commonAncestorContainer);
                expect(rangeOfSelection.endContainer.nodeValue).toEqual(range.endContainer.nodeValue);
                expect(rangeOfSelection.endOffset).toEqual(range.endOffset);
            }

            expect(rangeOfSelection.start).toEqual(0);
            expect(rangeOfSelection.end).toEqual(9);
        });
    });
});
