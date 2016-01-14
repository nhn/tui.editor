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

    it('버튼 한개를 만든다', function() {
        var modeSwitch = new ModeSwitch();
        $('body').append(modeSwitch.$el);

        expect($('.te-mode-switch button').length).toEqual(1);
        expect($('.te-mode-switch button').text()).toEqual('toWYSIWYG');
    });

    it('옵션으로 시작 타입을 결정할수 있다', function() {
        var modeSwitch = new ModeSwitch(ModeSwitch.TYPE.WYSIWYG);
        $('body').append(modeSwitch.$el);

        expect($('.te-mode-switch button').length).toEqual(1);
        expect($('.te-mode-switch button').text()).toEqual('toMarkdown');
    });


    it('버튼이 눌리면 이벤트가 발생되고 버튼 타이틀이 변경된다', function() {
        var modeSwitch = new ModeSwitch(),
            switchedType,
            switchedTypeText;

        modeSwitch.on('modeSwitched', function(e, typeInfo) {
            switchedType = typeInfo.type;
            switchedTypeText = typeInfo.text;
        });

        $('body').append(modeSwitch.$el);

        expect($('.te-mode-switch button').text()).toEqual('toWYSIWYG');


        $('button').trigger('click');

        expect($('.te-mode-switch button').text()).toEqual('toMarkdown');
        expect(switchedType).toEqual(ModeSwitch.TYPE.WYSIWYG);
        expect(switchedTypeText).toEqual('wysiwyg');
    });
});
