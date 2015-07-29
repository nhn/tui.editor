## 임시 설치 가이드

현재 에디터가 개발중에 있습니다. 미리 에디터를 적용하기 위한 임시 배포입니다.
*demo/*디렉토리의 demoDist.html파일을 참고하시면 간단한 설치 예제가 있습니다.
특별한 경우가 아니라면 neonEditor.full.min.js파일을 이용하시면 됩니다.
jQuery최신 버전이 필요합니다..
dist디렉토리의 neonEditor.css와 contentStyle.css를 링크해야합니다.
neonEditor.css는 에디터에 필요한 css스타일들이고
contentStyle.css는 wysiwyg에디터나 preview에서 보여질 컨텐트의 스타일들입니다.
contentStyle.css는 기호에 맞게 수정하실수 있으며 에디터를 통해 만들어진 컨텐츠를 보여줄때 같은 내용을 사용하실수 있습니다.(css파일 내용 참고)

``` javascript
$('#editSection').neonEditor({
    initialEditType: 'markdown',
    previewStyle: 'tab',
    height: 300,
    contentCSSStyles: [
        '../dist/contentStyle.css'
    ]
});
```

## 옵션 설명

* initialEditType: 'markdown'과 'wysiwyg'둘중 하나를 선택해서 에디터를 시작합니다.
* previewStyle: 마크다운의 경우 preview pane과 edit pane을 2단으로 보여줄지 tab형식으로 보여줄지를 정하는 옵션입니다.(tab, vertical)
* height: 에디팅영역의 기본 높이를 결정합니다.(숫자)
* contentCSSStyles: 위지윅에서 사용될 스타일파일을 지정합니다. 보통 demoDist.html파일처럼 contentStyle.css의 경로를 다시 지정하면됩니다.

## 이미지 서버 연동

이미지 추가 팝업에서 전달받은 form데이터를 이용해서 서버통신후
해당 이미지의 url을 콜백으로 넘겨 처리합니다.
예제는 form submit으로 화면이 전환되지만 실사용시에는 ajaxForm과 같은 툴을 이용해 ajax나 iframe으로 통신을 해야합니다.

``` javascript
$('#editSection').neonEditor({
    initialEditType: 'markdown',
    previewStyle: 'tab',
    height: 300,
    contentCSSStyles: [
        '../dist/contentStyle.css'
    ],
    hooks: {
        'addImageFileHook': function($form, callback) {
            $form.find('.imageFileInput').attr('name','fileName');
            $form[0].action = 'http://posttestserver.com/post.php';
            $form[0].method = 'POST';
            $form[0].submit();

            //callback으로 url전달
            //callback('이미지URL');
        }
    }
});
```

## API

``` javascript
//아래와 같이 일반적인 jQuery 플러그인 인터페이스를 이용합니다.

$('#editSection').neonEditor('focus');

var content = $("#editSection").neonEditor("getValue");

$("#editSection").neonEditor("setValue", "# Hello!!");

```

* focus: 에디터에 포커스를 줍니다.
* hide: 에디터를 숨깁니다.
* show: 에디터를 보입니다.
* getValue: 입력된 마크다운 컨텐트를 가져옵니다.
* setValue: 에디터에 마크다운 컨텐트를 셋팅합니다.

## 설치

```
bower install git@github.com:shiren/neon-editor.git#develop
```

bower를 이용하시거나 리포의 dist폴더의 내용에서 필요한 파일을 다운로드 하셔도 됩니다.
