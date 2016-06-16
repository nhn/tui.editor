'use strict';

tui.Editor.defineExtension('textPalette', function(editor) {
    var $layer = $('<div style="z-index:9999;border:1px solid #f00;width:200px"></div>');
    var isTextPaleltteActive = false;
    var to;

    $(editor.options.el).append($layer);

    function showUI(list) {
        $layer.html(list.join('<br>'));
        $layer.show();
    }

    function hideUI() {
        $layer.hide();
    }

    editor.on('change', function() {
        if (isTextPaleltteActive) {
            //현제 커서위치까지 텍스트오브젝트의 범위를 확장한다.
            to.setEndBeforeRange(editor.getRange());
            showUI(['ac1', 'ac2', 'ac3', to.getTextContent()]);
        } else {
            //텍스트오브젝트를 만든다.
            to = editor.getTextObject();
            //스타트오프셋을 한칸 확장한다(커서이전의 텍스트로)
            to.expandStartOffset();

            //@인지 확인
            if (to.getTextContent()[0] === '@') {
                isTextPaleltteActive = true;
                editor.addWidget(editor.getRange(), $layer[0]);
                showUI(['ac1', 'ac2', 'ac3']);
            }
        }
    });

    editor.on('keyMap', function(ev) {
        if (isTextPaleltteActive) {
            switch (ev.keyMap) {
                case 'ENTER': {
                    ev.data.preventDefault();
                    isTextPaleltteActive = false;

                    //값을 변경하기전 현제 커서위치까지 텍스트오브젝트를 확장한다.
                    to.setEndBeforeRange(editor.getRange());

                    //텍스트 오브젝트 범위의 컨텐츠를 바꾼다.
                    if (editor.isWysiwygMode()) {
                        to.replaceContent('&nbsp;<b>--newTEXT--</b>&nbsp;');
                    } else {
                        to.replaceContent('**--newTEXT--** ');
                    }
                    hideUI();
                    break;
                }
                case 'SPACE': {
                    isTextPaleltteActive = false;
                    hideUI();
                    break;
                }
                case 'DOWN': {
                    ev.data.preventDefault();
                    console.log('셀렉트박스 내리기');
                    break;
                }
                case 'UP': {
                    ev.data.preventDefault();
                    console.log('셀렉트박스 올리기');
                    break;
                }
                default:
            }
        }
    });
});
