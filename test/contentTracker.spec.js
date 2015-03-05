var ContentTracker = require('../src/js/contentTracker');

describe('contentTracker', function() {
    'use strict';

    var ct;

    beforeEach(function() {
        $('body').html('<div id="editSection"></div>');
        $('#editSection').html('<pre contenteditable="true" class="language-markdown" style="white-space: pre" />');
        $('pre').html('Hi There\n<span>this is</span>\n<span><b>kim</b> here\n</span>\n<span>last</span>');

        ct = new ContentTracker($('pre'));
    });

    describe('getOffsetNode', function() {
        it('offset정보를 넘겨 정보를 얻어올수있다', function() {
            var res = ct.getOffsetNodeInfo([18]);

            expect(res.length).toEqual(1);
        });

        it('여러개의 offset정보를 넘겨 정보를 얻어올수있다', function() {
            var res = ct.getOffsetNodeInfo([3, 18]);

            expect(res.length).toEqual(2);
        });

        it('offset이 포함된 node정보가 있다', function() {
            var res = ct.getOffsetNodeInfo([10]);

            expect(res[0].node.nodeValue).toEqual('this is');
        });

        it('해당 offset의 node상의 위치 정보가 있다', function() {
            var res = ct.getOffsetNodeInfo([18]);

            expect(res[0].offsetInNode).toEqual(1);
        });

        it('해당위치의 node바로 이전의 node의 정보가 있다.', function() {
            var res = ct.getOffsetNodeInfo([18]);

            expect(res[0].before.nodeValue).toEqual('\n');
        });

        it('여러번 실행해도 문제 처음부터 다시 검사한다', function() {
            var res;

            ct.getOffsetNodeInfo([10]);
            res = ct.getOffsetNodeInfo([18]);

            expect(res[0].node.nodeValue).toEqual('kim');
        });

        it('첫탐색에서 실패하고(인자가 잘못되서) 다음탐색에서 정상적인 인자에는 정상적인 결과를 낸다', function() {
            var res;

            ct.getOffsetNodeInfo([200]);
            res = ct.getOffsetNodeInfo([18]);

            expect(res[0].offsetInNode).toEqual(1);
            expect(res[0].before.nodeValue).toEqual('\n');
        });

        it('첫번쩨 offset의 정보를 가져올 수 있다.', function() {
            var res = ct.getOffsetNodeInfo([0]);
            expect(res[0].node.nodeValue).toEqual('Hi There\n');
        });

        it('라인의 맨끝 offset의 정보를 가져올 수 있다.', function() {
            var res = ct.getOffsetNodeInfo([8]);

            expect(res[0].node.nodeValue).toEqual('Hi There\n');
            expect(res[0].offset).toEqual(8);
            expect(res[0].offsetInNode).toEqual(8);
        });

        it('개행후 라인의 첫번째 offset의 정보를 가져올 수 있다.', function() {
            var res = ct.getOffsetNodeInfo([9]);

            expect(res[0].node.nodeValue).toEqual('this is');
            expect(res[0].offset).toEqual(9);
            expect(res[0].offsetInNode).toEqual(0);
        });

        it('분리된 개행은 패스하고 다음 노드 첫번째 offset의 정보를 가져올 수 있다.', function() {
            var res = ct.getOffsetNodeInfo([17]);

            expect(res[0].node.nodeValue).toEqual('kim');
            expect(res[0].offset).toEqual(17);
            expect(res[0].offsetInNode).toEqual(0);
        });

        it('빈 라인의 offset 정보를 가져올 수 있다.', function() {
            var res = ct.getOffsetNodeInfo([26]);

            expect(res[0].node.nodeValue).toEqual('\n');
            expect(res[0].before.nodeValue).toEqual(' here\n');
            expect(res[0].offset).toEqual(26);
            expect(res[0].offsetInNode).toEqual(0);
        });

        it('마지막 offset의 정보를 가져올 수 있다.', function() {
            var res = ct.getOffsetNodeInfo([31]);

            expect(res[0].node.nodeValue).toEqual('last');
        });

    });

    describe('getNodeOffset', function() {
        it('node정보를 넘겨 정보를 얻어올수있다', function() {
            var nodeInfo = ct.getOffsetNodeInfo([17]),
                res = ct.getNodeOffset([nodeInfo[0].node]);

            expect(res.length).toEqual(1);
        });

        it('node정보를 여러개 넘겨 정보를 얻어올수있다', function() {
            var nodeInfo = ct.getOffsetNodeInfo([10, 20]),
                res = ct.getNodeOffset([nodeInfo[0].node, nodeInfo[1].node]);

            expect(res.length).toEqual(2);
        });

        it('node의 offset위치를 얻을수있다.', function() {
            var nodeInfo = ct.getOffsetNodeInfo([17]),
                res = ct.getNodeOffset([nodeInfo[0].node]);

            expect(res[0].offset).toEqual(17);
        });

        it('첫번째 node의 offset위치를 얻을수있다.', function() {
            var nodeInfo = ct.getOffsetNodeInfo([0]),
                res = ct.getNodeOffset([nodeInfo[0].node]);
            expect(res[0].offset).toEqual(0);
        });

        it('마지막 node의 offset위치를 얻을수있다.', function() {
            var nodeInfo = ct.getOffsetNodeInfo([25]),
                res = ct.getNodeOffset([nodeInfo[0].node]);
            expect(res[0].offset).toEqual(20);
        });

        it('여러번 실행해도 문제 처음부터 다시 검사한다', function() {
            var nodeInfo = ct.getOffsetNodeInfo([20, 0, 18]),
                res;

            ct.getNodeOffset([nodeInfo[0].node]);
            ct.getNodeOffset([nodeInfo[1].node]);
            res = ct.getNodeOffset([nodeInfo[2].node]);

            expect(res[0].node.nodeValue).toEqual('kim');
        });

        it('첫탐색에서 실패하고(인자가 잘못되서) 다음탐색에서 정상적인 인자에는 정상적인 결과를 낸다', function() {
            var nodeInfo = ct.getOffsetNodeInfo([18]),
                res;

            ct.getNodeOffset([$('<div />')]);
            res = ct.getNodeOffset([nodeInfo[0].node]);

            expect(res[0].node.nodeValue).toEqual('kim');
        });
    });

    describe('_getNodeOffset', function() {
        it('node정보를 넘겨 정보를 얻어올수있다', function() {
            var nodeInfo = ct.getOffsetNodeInfo([17]),
                res = ct._getNodeOffset([nodeInfo[0].node]);

            expect(res.length).toEqual(1);
        });

        it('node정보를 여러개 넘겨 정보를 얻어올수있다', function() {
            var nodeInfo = ct.getOffsetNodeInfo([10, 20]),
                res = ct._getNodeOffset([nodeInfo[0].node, nodeInfo[1].node]);

            expect(res.length).toEqual(2);
        });

        it('node의 offset위치를 얻을수있다.', function() {
            var nodeInfo = ct.getOffsetNodeInfo([17]),
                res = ct._getNodeOffset([nodeInfo[0].node]);
            expect(res[0]).toEqual(17);
        });
    });
});
