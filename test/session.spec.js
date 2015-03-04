var Session = require('../src/js/session'),
    Selection = require('../src/js/selection');

describe('', function() {
    'use strict';

    var sel, session;

    beforeEach(function() {
        $('body').html('<div id="editSection"></div>');
        $('#editSection').html('<pre contenteditable="true" class="language-markdown" style="white-space: pre" />');
        $('pre').html('');

        sel = new Selection({
            $editorEl: $('pre')
        });

        session = new Session();
    });

    describe('newLine()', function() {
        it('에디팅영역이 비었다면', function() {
            expect(true).toEqual(true);
        });
    });
});