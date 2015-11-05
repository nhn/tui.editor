## 설치

bower를 이용하시거나 리포의 dist폴더의 내용에서 필요한 파일들을 다운로드 하셔도 됩니다.
[릴리즈노트][https://github.com/shiren/tui-editor/releases]를 참고하여 버전을 지정해서 설치합니다.

```
bower install git@github.com:shiren/tui-editor.git#0.0.7
```

디펜던시 모듈 정보는 bower.json을 참고 바랍니다.
디펜던시 라이브러리설치 편의를 위해서는 bower를 이용하는 편이 좋습니다.

이후 업데이트는 아래와같이 할수있습니다.

```
bower update
```

## 임시 설치 가이드

현재 에디터가 개발중에 있습니다. 미리 에디터를 적용하기 위한 임시 배포입니다.
에디터를 정상적으로 사용하기 위해서는 하단에 샘플 코드와같이 디펜던시 js, css 파일들과 에디터js, css파일이 로드가 되어야합니다.
tuiEditor.css는 에디터에 필요한 css스타일들이고
contentStyle.css는 wysiwyg에디터나 마크다운 preview에서 보여질 컨텐트의 스타일들입니다.
contentStyle.css는 기호에 맞게 수정하실수 있으며 에디터를 통해 만들어진 컨텐츠를 보여줄때 같은 내용을 사용하실수 있습니다.(css파일 내용 참고)
아래 예제를 확인 바랍니다.

``` html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>DEMO</title>
    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/tui-code-snippet/code-snippet.js"></script>
    <script src="bower_components/marked/lib/marked.js"></script>
    <script src="bower_components/toMark/dist/toMark.js"></script>
    <script src="bower_components/codemirror/lib/codemirror.js"></script>
    <script src="bower_components/highlightjs/highlight.pack.js"></script>
    <script src="bower_components/Squire/build/squire-raw.js"></script>
    <script src="bower_components/tui-editor/dist/tui-editor.min.js"></script>
    <link rel="stylesheet" href="bower_components/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="bower_components/highlightjs/styles/github.css">
    <link rel="stylesheet" href="bower_components/tui-editor/dist/tui-editor.css">
    <link rel="stylesheet" href="bower_components/tui-editor/dist/tui-editor-contents.css">
</head>
<body>
<div id="editSection"></div>
<script>
    $('#editSection').tuiEditor({
        initialEditType: 'markdown',
        previewStyle: 'tab',
        height: 300,
        contentCSSStyles: [
            'bower_components/tui-editor/dist/tui-editor-contents.css'
        ],
        events: {
            'load': function() {
                console.log('handler');
            }
        }
    });
</script>
</body>
</html>
```

## 옵션 설명

* initialEditType: 'markdown'과 'wysiwyg'둘중 하나를 선택해서 에디터를 시작합니다.
* previewStyle: 마크다운의 경우 preview pane과 edit pane을 2단으로 보여줄지 tab형식으로 보여줄지를 정하는 옵션입니다.(tab, vertical)
* height: 에디팅영역의 기본 높이를 결정합니다.(숫자)
* contentCSSStyles: 위지윅에서 사용될 스타일파일을 지정합니다. 보통 위 예시 처럼 tui-editor-contents.css의 경로를 다시 지정하면됩니다.
* events: 내부 이벤트에 대응하는 핸들러를 셋팅합니다.
* exts: 사용할 익스텐션들을 배열로 지정합니다.
    * `exts: ['scrollFollow']`
* hooks: 이미지서버와의 연동등을 처리하는 훅을 바인드합니다.

## 이미지 서버 연동

기존에 addImageFileHook훅을 이용해  폼을 전달하는 방식의 서버연동은 아래와 같지만 deprecated됩니다.
addImageBlobHook을 이용해서 이미지 파일을 blob으로 전달받아서 연동합니다.
https://developer.mozilla.org/en/docs/Using_files_from_web_applications
상단 링크의 Handling the upload process for a file파트를 참조해주세요


``` javascript
$('#editSection').tuiEditor({
    initialEditType: 'markdown',
    previewStyle: 'tab',
    height: 300,
    contentCSSStyles: [
        'bower_components/tui-editor/dist/tui-editor-contents.css'
    ],
    hooks: {
        'addImageFileHook': function($form, callback) {
            //addImageFileHook은 deprecated됩니다.
            $form.find('.imageFileInput').attr('name','fileName');
            $form[0].action = 'http://posttestserver.com/post.php';
            $form[0].method = 'POST';
            $form[0].submit();

            //callback으로 url전달
            //callback('이미지URL');
        },
        'addImageBlobHook': function(blob, callback) {
            //이미지 블롭을 이용해 서버 연동 후 콜백실행
            //callback('이미지URL');
        }
    }
});
```

## API

``` javascript
//아래와 같이 일반적인 jQuery 플러그인 인터페이스를 이용합니다.

$('#editSection').tuiEditor('focus');

var content = $("#editSection").tuiEditor("getValue");

$("#editSection").tuiEditor("setValue", "# Hello!!");
```

* focus: 에디터에 포커스를 줍니다.
* hide: 에디터를 숨깁니다.
* show: 에디터를 보입니다.
* getValue: 입력된 마크다운 컨텐트를 가져옵니다.
* setValue: 에디터에 마크다운 컨텐트를 셋팅합니다.
* changeMode: 에디터의 타입을 변경한다(인자로는 wysiwyg과 markdown)
* contentHeight: 에디터의 컨텐트 영역의 높이값을 인자로 넘겨 지정하거나 현재의 높이값을 반환합니다
* on: 이벤트핸들러와 핸들러평션을 파라메터로 넘겨 에디터 내부이벤트를 바인드 할수있습니다.

``` javascript
$('#editSection').tuiEditor('on', 'load', handler);
```

## 주요변경점
* 0.0.7
    * 네이밍 변경으로 리포지토리부터 경로들이 모두 바뀌었습니다.
* 0.0.6
    * 디펜던시 모듈 code-snippets의 네이밍이 변경됨에 따라 사용 경로도 바뀌었습니다. tui-code-snippets의 경로를 확인바랍니다.
* 0.0.2
    * 에디터 셋팅한뒤 바로 에디터에 접근할때 iframe이 셋팅되지 않아 문제가될수있습니다.
    iframe의 셋팅이 비동기로 이루어집니다. 에디터를 생성한시점에 에디터 API를 이용한다던지 에디터에 접근할때는 load이벤트를 이용해주시기바랍니다.
    * 기존에 디펜던시 모듈들이 모두포함된 full버전이 제거되었습니다 따라서 디펜던시 모듈들을 직접 로드해야합니다(샘플 참조)
