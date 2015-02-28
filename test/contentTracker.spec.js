var ContentTracker = require('../src/js/contentTracker');

describe('contentTracker', function() {
    'use strict';

    var ct;

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = '/base/test/fixtures';
        loadFixtures('contentTracker.html');
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

        it('첫번쩨 offset의 정보를 가져올 수 있다.', function() {
            var res = ct.getOffsetNodeInfo([0]);
            expect(res[0].node.nodeValue).toEqual('Hi There\n');
        });

        it('마지막 offset의 정보를 가져올 수 있다.', function() {
            var res = ct.getOffsetNodeInfo([25]);
            expect(res[0].node.nodeValue).toEqual('\n');
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
            expect(res[0].offset).toEqual(25);
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
