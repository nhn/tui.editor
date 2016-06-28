'use strict';

var ModeSwitch = require('../../src/js/ui/modeSwitch');

describe('ModeSwitch', function() {
    afterEach(function() {
        $('body').empty();
    });

    it('editorTypeControl클래스를 가진 엘리먼트가 존재한다', function() {
        var modeSwitch = new ModeSwitch();
        $('body').append(modeSwitch.$el);

        expect($('.te-mode-switch').length).toEqual(1);
    });

    describe('옵션으로 시작 타입을 결정할수 있다', function() {
        it('markdown', function() {
            var modeSwitch = new ModeSwitch(ModeSwitch.TYPE.MARKDOWN);
            $('body').append(modeSwitch.$el);

            expect($('button.te-switch-button.active').length).toEqual(1);
            expect($('button.te-switch-button.wysiwyg.active').length).toEqual(0);
            expect($('button.te-switch-button.markdown.active').length).toEqual(1);
            expect($('button.te-switch-button.markdown.active').text()).toEqual('Markdown');
        });
        it('wysiwyg', function() {
            var modeSwitch = new ModeSwitch(ModeSwitch.TYPE.WYSIWYG);
            $('body').append(modeSwitch.$el);

            expect($('button.te-switch-button.active').length).toEqual(1);
            expect($('button.te-switch-button.markdown.active').length).toEqual(0);
            expect($('button.te-switch-button.wysiwyg.active').length).toEqual(1);
            expect($('button.te-switch-button.wysiwyg.active').text()).toEqual('WYSIWYG');
        });
    });


    it('버튼이 눌리면 이벤트가 발생되고 버튼에 active 클래스가 붙는다', function() {
        var modeSwitch = new ModeSwitch();

        $('body').append(modeSwitch.$el);

        expect($('button.te-switch-button.wysiwyg').text()).toEqual('WYSIWYG');
        expect($('button.te-switch-button.markdown.active').text()).toEqual('Markdown');


        $('button').trigger('click');

        expect($('button.te-switch-button.wysiwyg.active').text()).toEqual('WYSIWYG');
        expect($('button.te-switch-button.markdown').text()).toEqual('Markdown');
    });
});
