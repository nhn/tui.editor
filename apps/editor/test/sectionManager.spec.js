var SectionManager = require('../src/js/sectionManager');

describe('SectionManager', function() {
    'use strict';

    var sm,
        p1 = '그냥 텍스트1',
        p2 = '그냥 텍스트2',
        h1 = '# Heading',
        h2 = '## Heading 2nd',
        h3 = '### Heading 3rd';
        /*list = '* list',
        olist1 = '1. olist',
        olist2 = '2, olist';
        */

    beforeEach(function() {
        sm = new SectionManager();
    });

    describe('update()', function() {
        it('헤딩을 기준으로 분할이 정상적으로 이루어진다', function() {
            var text = [p1, h1, p2, h2, h3].join('\n'),
                length = 0;

            sm.update(text);

            sm.forEach(function() {
                length += 1;
            });

            expect(length).toEqual(4);
        });

        it('변화감지', function() {
            var text = [p1, h1, p2, h2, h3].join('\n'),
                text2 = [p1, h1, p2, h3, h2, h3].join('\n'),
                length = 0;

            sm.update(text);
            sm.update(text2);
        })
    });
});