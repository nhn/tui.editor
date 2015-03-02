var Selection = require('../src/js/selection');

describe('Selection', function() {
    'use strict';

    var sel;

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = '/base/test/fixtures';
        loadFixtures('selection.html');

        sel = new Selection({
            $editorEl: $('pre')
        });
    });

    xdescribe('텍스트의 인덱스 넘버를 넘겨 range를 만든다', function() {
        it('createRange', function() {
            var range = sel.createRange(10, 20);

            expect(range.collapsed).toEqual(false);
            expect(range.startOffset).toEqual(1);
            expect(range.startContainer.nodeValue).toEqual('this is');
            expect(range.endOffset).toEqual(0);
            expect(range.endContainer.nodeValue).toEqual(' here');
        });
    });
});
