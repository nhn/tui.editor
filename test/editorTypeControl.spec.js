var EditorTypeSwitch = require('../src/js/editorTypeSwitch');

describe('EditorTypeSwitch', function() {
    'use strict';

    beforeEach(function() {
        $('body').empty();
    });

    it('editorTypeControl클래스를 가진 엘리먼트가 존재한다', function() {
        var editorTypeSwitch = new EditorTypeSwitch();
        $('body').append(editorTypeSwitch.$el);

        expect($('.editorTypeSwitch').length).toEqual(1);
    });

    it('버튼 한개를 만든다', function() {
        var editorTypeSwitch = new EditorTypeSwitch();
        $('body').append(editorTypeSwitch.$el);

        expect($('.editorTypeSwitch button').length).toEqual(1);
        expect($('.editorTypeSwitch button').text()).toEqual('toWYSIWYG');
    });

    it('옵션으로 시작 타입을 결정할수 있다', function() {
        var editorTypeSwitch = new EditorTypeSwitch(EditorTypeSwitch.TYPE.WYSIWYG);
        $('body').append(editorTypeSwitch.$el);

        expect($('.editorTypeSwitch button').length).toEqual(1);
        expect($('.editorTypeSwitch button').text()).toEqual('toMarkdown');
    });


    it('버튼이 눌리면 이벤트가 발생되고 버튼 타이틀이 변경된다', function() {
        var editorTypeSwitch = new EditorTypeSwitch(),
            switchedType,
            switchedTypeText;

        editorTypeSwitch.on('editorTypeSwitched', function(e, typeInfo) {
            switchedType = typeInfo.type;
            switchedTypeText = typeInfo.text;
        });

        $('body').append(editorTypeSwitch.$el);

        expect($('.editorTypeSwitch button').text()).toEqual('toWYSIWYG');


        $('button').trigger('click');

        expect($('.editorTypeSwitch button').text()).toEqual('toMarkdown');
        expect(switchedType).toEqual(EditorTypeSwitch.TYPE.WYSIWYG);
        expect(switchedTypeText).toEqual('WYSIWYG');
    });
});
