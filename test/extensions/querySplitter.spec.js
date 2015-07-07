'use strict';

var Neditor = require('../../src/js/editor');

describe('querySplitter', function() {
    var ned;

    beforeEach(function() {
        $('body').empty();
        $('body').html('<div id="#editSection"></div>');

        ned = new Neditor({
            el: $('#editSection'),
            previewStyle: 'tab',
            height: 300,
            delay: 300,
            initialEditType: 'wysiwyg',
            exts: ['querySplitter']
        });
    });

    describe('', function() {
        it('', function() {
            expect(ned).not.toBeUndefined();
        });
    });
});
