## 개요

해당 문서는 TOAST UI Editor 3.0 버전 업데이트에 대한 마이그레이션 가이드로, 2.x 버전을 사용하는 사용자가 3.0 버전으로 업데이트할 때 필요한 모든 변경 사항을 기술한다.

TOAST UI Editor(이하 '에디터'로 표기)는 3.0 버전에서 기존 [CodeMirror](https://codemirror.net/)와 squire, to-mark 등에 대한 의존성을 제거하고 Prosemirror를 이용하여 추상화 모델을 사용하는 에디터로 변경하는 작업을 진행하였다. 코어 모듈과 API, 플러그인 사용 방법 등이 모두 변경되었기 때문에 업데이트 시 마이그레이션 가이드의 내용을 잘 숙지하길 바란다. 목차는 다음과 같으며, 실제 적용 시에는 '변경 사항' 항목의 내용을 순서대로 진행하길 권장한다.

## 목차

- [변경 사항](#변경-사항)
  1. [설치 및 사용 방법](#1-설치-및-사용-방법)
  2. [툴바 커스터마이징](#2-툴바-커스터마이징)
  3. [플러그인 정의](#3-플러그인-정의)
  4. [API와 이벤트](#4-API와-이벤트)
  5. [지원 브라우저 범위](#5-지원-브라우저-범위)
- [제거된 기능](#제거된-기능)
  1. [jQuery Wrapper 제거](#1-jQuery-Wrapper-제거)
  2. [의존성 제거](#2-의존성-제거)
  3. [제거된 API](#3-제거된-API)

## 변경 사항

### 1. 설치 및 사용 방법

에디터 사용 방식은 기존 v2.x와 동일하게 [스코프드 패키지(Scoped package)](https://docs.npmjs.com/using-npm/scope.html)를 적용하여 다음과 같이 `@toast-ui/editor`로 패키지를 설치하여 사용한다. 아래는 npm 커맨드를 사용한 에디터 설치 예제이다.

```sh
$ npm install @toast-ui/editor
$ npm install @toast-ui/editor@<version>
```

#### 사용 방법

```js
const Editor = require('@toast-ui/editor'); /* CommonJS 방식 */
import Editor from '@toast-ui/editor'; /* ES6 모듈 방식 */
```

또한, v3.0에서는 에디터의 기본 UI를 사용하지 않고 별도로 UI를 구상하고 싶은 사용자를 위해 `EditorCore`란 모듈을 named export 형태로 제공한다. 이 모듈을 사용하면 마크다운 에디터와 프리뷰, 위지윅 에디터만 생성하며, 이를 `getEditorElements()` 메서드를 사용하여 원하는 UI에 에디터를 추가하여 사용할 수 있다. 툴바나 툴바 팝업, 스위치 탭과 같은 에디터 외부의 UI는 생성하지 않는다.

```js
import { EditorCore } from '@toast-ui/editor'; /* ES6 모듈 방식 */

const editorCore = new EditorCore({
  el
  // ...
});

const { mdEditor, mdPreview, wwEditor } = editorCore.getEditorElements();

// ...
```

#### 번들 구조

v3.0에서는 기존 v2.x의 번들 구조에 두 가지가 더 추가되었다.
기존의 legacy 지원을 위한 번들과 cdn 번들 외에 ESM 번들이 추가로 제공된다. ESM 번들은 복잡한 모듈 호환 구문이 없기 때문에 더 가벼우며, 정적 분석으로 인한 트리 쉐이킹(Tree shaking)의 이점도 누릴 수 있다.
두 번째로 다크 테마 지원을 위한 `theme/toastui-editor-dark.css` 파일이 추가되었다. 이에 대한 설명은 [다크 테마 추가](#-다크-테마-추가)에서 볼 수 있다.

v3.0의 번들 구조는 다음과 같다.

```
- dist/
   ├─ cdn/...
   ├─ i18n/...
   ├─ esm/
   │    ├─ index.js
   │    └─ index.js.map
   ├─ theme/
   │    └─ toastui-editor-dark.css
   │
   ├─ toastui-editor-only.css
   ├─ toastui-editor-viewer.css
   ├─ toastui-editor.css
   ├─ toastui-editor.js
   └─ toastui-editor-viewer.js
```

또한 v3.0에서 ESM 번들이 추가되며, package.json 파일도 이에 맞게 변경되었다. 
기존의 UMD 용 번들 파일은 main 필드에 정의되며, ESM 번들 파일은 exports 필드에 정의되었다.

```json
{
  "main": "dist/toastui-editor.js",
  "module": "dist/esm/",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/toastui-editor.js"
    },
    "./viewer": {
      "import": "./dist/esm/indexViewer.js",
      "require": "./dist/toastui-editor-viewer.js"
    }
  }
}
```

#### 다크 테마 추가
v3.0에서는 다크 테마가 추가되었다. 다크 테마를 적용하고 싶은 경우 `theme/toastui-editor-dark.css`를 추가한 후, 에디터의 `theme` 옵션을 `dark`로 설정하여 사용한다. 현재 v3.0에서는 다크 테마만 지원하지만, 사용자가 여러 테마를 혼합하여 사용하거나 추후 다른 테마를 지원하기 위해 `theme` 옵션을 추가하였다.

```js
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

const editor = new Editor({
  el: document.querySelector('#editor'),
  previewStyle: 'vertical',
  height: '500px',
  initialValue: content,
  theme: 'dark',
});
```

![image](https://user-images.githubusercontent.com/37766175/120954138-73ab8680-c789-11eb-8445-87bf15842482.png)

#### 의존성 정보 변경

에디터 3.0에서는 v2.x에서 사용하던 의존성 모듈들이 제거되었다. 만약 CDN 환경에서 개발하고 있다면, v2.x에서 사용하던 [CodeMirror](https://codemirror.net/) 의존성 코드는 더 이상 필요없으니 제거해야 한다.
3.0에서는 Prosemirror와 관련된 의존성 모듈들이 추가되었지만, 이는 CDN 번들에 모두 포함되기 때문에 별도로 추가할 필요가 없다. 

**v2.0**

```html
<head>
  ...
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.css"
  />
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.css" />
  ...
</head>
<body>
  ...
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  ...
</body>
```

**v3.0**

```html
<head>
  ...
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.css" />
  ...
</head>
<body>
  ...
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  ...
</body>
```

### 2. 툴바 커스터마이징

`toolbarItems` 옵션이 기존 v2.x에 비해 더 간결하고 선언적으로 변경되었다. v3.0에서는 각 툴바 아이템과 툴바 그룹을 **2차원 배열** 형태의 옵션으로 정의한다. 이 방식은 그룹을 구분하기 위해 `divider`라는 불필요한 요소를 옵션으로 넘겨 정의하던 기존 방식보다 훨씬 간결하고 명확하다.

**v2.0**

```js
const editor = new Editor({
  el: document.querySelector('#editor'),
  toolbarItems: [
    'heading',
    'bold',
    'italic',
    'strike',
    // 그룹을 구분짓기 위해 옵션에 divider 요소를 추가해야 했다.
    'divider',
    'hr',
    'quote',
    'divider',
    // ...
  ],
  // ...
});
```

**v3.0**

```js
const editor = new Editor({
  el: document.querySelector('#editor'),
  toolbarItems: [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    // ...
  ],
  // ...
});
```

위의 예제 코드를 보면, v3.0의 코드가 더 간결하고 그룹이 어떻게 나뉘는지 훨씬 쉽게 구분할 수 있음을 알 수 있다.

#### 커스터마이징

툴바 아이템을 커스터마이징하는 방법도 변경되었다. v2.x에서는 툴바 아이템을 클릭하여 팝업을 띄우거나 닫을 때 에디터의 `eventManager`나 다른 UI 인스턴스에 대한 결합도가 상당히 높았다. 이는 사용자 또는 플러그인에서 커스터마이징할 때 에디터 내부 동작 방식에 대한 지식을 강요하기 때문에 사용하기 어렵고, 불필요한 제어 코드들을 생산하였다. v3.0에서는 이러한 결합도를 낮추기 위해 UI 제어를 위한 코드를 모두 내부로 캡슐화하였고, 사용자는 옵션만 설정하여 툴바 아이템을 커스터마이징할 수 있게 변경하였다.

**v2.0**

```js
const popup = editor.getUI().createPopup({
  header: false,
  title: null,
  content: colorPickerContainer,
  className: 'tui-popup-color',
  target: editor.getUI().getToolbar().el,
  css: {
    width: 'auto',
    position: 'absolute'
  }
});

editor.eventManager.listen('focus', () => {
  popup.hide();

  // ...
});

editor.eventManager.listen('colorButtonClicked', () => {
  // ...
});

editor.eventManager.listen('closeAllPopup', () => {
  // ...
});
```

위의 코드는 v2.x에서 컬러피커 플러그인의 툴바 커스터마이징 예시이다. 툴바의 팝업 동작을 제어하기 위해 `editor.getUI().createPopup()`, `editor.getUI().getToolbar()`와 같은 에디터 내부 구조에 종속적인 API를 사용해야 한다. 내부 구현에 대한 이러한 의존성은 유연한 커스터마이징을 더 어렵게 만든다. API 뿐만이 아니다. 팝업을 제어하기 위해 `eventManager`에 여러 이벤트를 등록하여 코드를 수정해야 한다.


**v3.0**

```js
const popup = {
  name: 'color',
  tooltip: 'Text color',
  className: 'toastui-editor-toolbar-icons color',
  popup: {
    className: 'toastui-editor-popup-color',
    body: colorPickerContainer,
    style: { width: 'auto' },
  },
};
```

몇 가지 코드가 생략되었지만, 3.0에서는 간단한 옵션 설정으로 팝업 UI를 생성하고 제어할 수 있다. 기존처럼 내부 UI에 모듈에 대해 알 필요없이 `popup` 옵션 객체에 `className`, `style`, `body` 프로퍼티만 정의하면, 툴바 버튼을 눌렀을 때 팝업을 띄울 수 있다. 툴바 커스터마이징에 대한 더 자세한 설명은 [여기](https://github.com/nhn/tui.editor/tree/master/docs/ko/toolbar.md)를 참조 바란다.

![image](https://user-images.githubusercontent.com/37766175/120915630-b6b11f80-c6df-11eb-8094-b264ca9312a1.gif)

### 3. 플러그인 정의

v3.0의 가장 큰 변경점은 플러그인을 정의하는 방식이다. 기존 2.x에서는 플러그인 역시 앞서 살펴본 툴바 커스터마이징처럼 에디터 내부 모듈에 대한 의존성이 굉장히 높았다. 특히 플러그인은 마크다운 에디터, 위지윅 에디터, 컨버터 등 에디터 내부 인스턴스의 동작을 더욱 깊숙이 알아야 한다. 3.0버전에서는 이 문제를 개선하기 위해 명확한 옵션을 주입하여 각각의 기능을 커스터마이징하는 형태로 변경되었다. 이 가이드에서는 옵션의 형태만 간략하게 설명할 것이며, 플러그인을 정의하는 자세한 방법은 [여기](https://github.com/nhn/tui.editor/tree/master/docs/ko/plugin.md)서 볼 수 있다.

#### 커맨드 등록

플러그인에서는 `markdownCommands`, `wysiwygCommands` 옵션을 사용하여 마크다운, 위지윅 커맨드를 등록할 수 있다.

```js
return {
  markdownCommands: {
    myCommand: (payload, state, dispatch) => {
      // ...
    },
  },
  wysiwygCommands: {
    myCommand: (payload, state, dispatch) => {
      // ...
    },
  },
};
```

각각의 커맨드는 `payload`, `state`, `dispatch` 세가지 인자를 받으며, 이를 사용하여 Prosemirror 기반의 에디터 내부 동작을 제어할 수 있다. 이 방식 역시 Prosemirror의 동작을 알아야 한다는 단점이 있다. 하지만, 앞으로 에디터 자체적으로 여러 가지 기본 커맨드를 제공할 것이기 때문에 직접적으로 이러한 내부 동작을 재정의할 일은 많지 않을 것이다.

#### 컨버팅

특정 요소가 마크다운 프리뷰에서 렌더링될 때 또는 마크다운 에디터에서 위지윅 에디터로 컨버팅할 때 요소의 렌더링 결과를 변경할 수 있다. 반대로 위지윅 에디터에서 마크다운 에디터로 컨버팅할 때 변환되는 마크다운 텍스트를 재정의할 수 있다.
`toHTMLRenderers`, `toMarkdownRenderers` 옵션을 사용하여 마크다운 => 위지윅, 위지윅 => 마크다운 컨버팅 시 수행할 동작을 추가할 수 있다.

```ts
return {
  toHTMLRenderers: {
    // ...
    tableCell(node: MergedTableCellMdNode, { entering, origin }) {
      const result = origin!();

      // ...
      
      return result;
    },
  },
  toMarkdownRenderers: {
    // ...
    tableHead(nodeInfo) {
      const row = (nodeInfo.node as ProsemirrorNode).firstChild;

      let delim = '';

      if (row) {
        row.forEach(({ textContent, attrs }) => {
          const headDelim = createTableHeadDelim(textContent, attrs.align);

          delim += `| ${headDelim} `;

          // ...
        });
      }
      return { delim };
    },
  },
};
```

위의 코드는 병합 테이블 플러그인의 예시이다. `toHTMLRenderers`에 정의된 `tableCell` 노드의 반환 결과는 마크다운 프리뷰와 위지윅 에디터로 컨버팅 시 사용되며, `toMarkdownRenderers`에 정의된 `tableHead` 노드의 텍스트 결과는 마크다운 에디터로 컨버팅 시 사용된다. 각 에디터로 컨버팅 시 수행될 동작을 노드별 옵션으로 명확하게 설정할 수 있다.

#### 툴바 아이템 등록

플러그인에서 툴바 아이템을 등록하는 방식 역시 변경되었다. 앞서 설명한 툴바 커스터마이징 옵션과 유사하며, 어느 그룹에 추가될지 인덱스 정보만 추가로 설정하면 된다.


```ts
return {
  // ...
  toolbarItems: [
    {
      groupIndex: 0,
      itemIndex: 3,
      item: toolbarItem,
    },
  ],
};
```

위의 코드처럼 `toolbarItems` 배열에 어떤 아이템을 추가할지 설정할 수 있다. 각 옵션 객체는 `groupIndex`, `itemIndex`, `item` 세가지 프로퍼티가 있으며 다음과 같은 역할을 한다.

* `groupIndex`: 툴바 아이템을 추가할 그룹의 인덱스를 지정한다.
* `itemIndex`: 지정한 그룹 내에서 몇 번째로 추가할지 인덱스를 지정한다.
* `item`: 추가할 툴바 아이템 요소를 지정한다.

만약 예제 코드처럼 `toolbarItems` 옵션을 설정한다면, 1번째 툴바 그룹의 4번째 인덱스로 툴바 아이템을 등록할 것이다.

이외에도 마크다운, 위지윅 에디터의 Prosemirror 플러그인을 등록하는 방법, `eventEmitter`로 에디터와 플러그인 간의 통신 등 몇 가지 여기서 소개하지 않는 옵션들이 있다. 해당 내용은 [플러그인 활용 가이드](https://github.com/nhn/tui.editor/tree/master/docs/ko/plugin.md)를 자세히 읽어보길 권장한다.


### 4. API와 이벤트

3.0에서 변경된 API의 시그니처와 이벤트 명은 다음과 같다.

#### 커맨드
등록하려는 커맨드의 옵션을 이름과 핸들러로 이루어진 객체 형태가 아닌 각각의 인자로 넘겨주는 형태로 변경되었다. 또한 커맨드를 실행하는 메서드의 인자 형태도 변경되었다.

**v2.x**

| 메서드 시그니처              | 반환 타입         |
| ----------------- | ------------ |
| `addCommand(type: string, props: { name: string; exec: Command }` | `void` |
| `exec(name: string, ...args: any[]`) | `void` |

**v3.0**

| 메서드 시그니처              | 반환 타입         |
| ----------------- | ------------ |
| `addCommand(type: string, name: string, command: CommandFn)` | `void` |
| `exec(name: string, payload?: Object)` | `void` |

#### 텍스트 조작 API
기존에는 `getTextObject()` API를 사용하여 에디터 내에 텍스트를 삽입하거나 교체하였다. 하지만 `getTextObject()` API가 반환하는 인스턴스의 구조를 알아야 한다는 단점이 있었다. 3.0에서는 해당 API를 삭제하고 텍스트 삽입, 교체, 삭제 동작을 수행하는 API를 별도로 추가하였다.

**v2.x**

`TextObject`의 인터페이스

```ts
interface TextObject {
  setRange(range): void;
  setEndBeforeRange(range): void;
  expandStartOffset(): void;
  expandEndOffset(): void;
  getTextContent(): string;
  replaceContent(content) : void;
  deleteContent(): void;
  peekStartBeforeOffset(offset): Range;
}
```

**v3.0**

| 메서드 시그니처              | 반환 타입         | 비고        |
| ----------------- | ------------ | ------------ |
| `replaceSelection(text: string, start?: EditorPos, end?: EditorPos) ` | `void` | 특정 범위의 텍스트를 교체한다. 범위를 지정하지 않을 경우 현재 에디터의 셀렉션 범위 내의 텍스트를 수정한다. |
| `deleteSelection(start?: EditorPos, end?: EditorPos)` | `void` | 특정 범위의 텍스트를 삭제한다. 범위를 지정하지 않을 경우 현재 에디터의 셀렉션 범위 내의 텍스트를 삭제한다. |
| `getSelectedText(start?: EditorPos, end?: EditorPos)` | `string` | 특정 범위의 텍스트를 가져온다. 범위를 지정하지 않을 경우 현재 에디터의 셀렉션 범위 내의 텍스트를 가져온다. |

위의 API들의 위치 정보(`EditorPos`)는 마크다운 에디터, 위지윅 에디터에 따라 다르며, 아래와 같은 형태이다. 이는 마크다운과 위지윅의 위치 계산 정보 방법이 다르기 때문이다. 마크다운은 라인을 기준으로 계산하여, 위지윅은 문서 시작을 기준으로 오프셋을 계산한다.

```ts
// 마크다운 위치 정보
type EditorPos = [line: number, charactorOffset: number];
// 위지윅 위치 정보
type EditorPos = number; // 오프셋
```

#### 인스턴스 생성 옵션 및 메서드 변경

표기가 잘못되거나 기능이 명확하지 않은 옵션과 메서드가 변경되었다.

* 인스턴스 생성 옵션 

| v2 | v3 |
| --- | --- |
| `linkAttribute` | `linkAttributes` |

* 인스턴스 메서드

| v2 | v3 |
| --- | --- |
| `setHtml` | `setHTML` |
| `getHtml` | `getHTML` |
| `minHeight` | `setMinHeight`, `getMinHeight` |
| `height` | `setHeight`, `getHeight` |
| `getRange` | `getSelection` |
| `remove` | `destroy` |

#### 이벤트 명 변경

몇몇 이벤트 명도 더 명확한 의미를 전달을 위해 변경되었다.

| v2 | v3 |
| --- | --- |
| `stateChange` | `caretChange` |
| `convertorAfterMarkdownToHtmlConverted` | `beforePreviewRender` |
| `convertorAfterHtmlToMarkdownConverted` | `beforeConvertWysiwygToMarkdown` |

### 5. 지원 브라우저 범위

v3.0부터 지원 브라우저 범위가 **인터넷 익스플로러 11 이상**으로 변경된다. 이전 버전에서는 인터넷 익스플로러 10 이상을 지원하였으나 낮은 브라우저 점유율 및 Prosemirror 코어 모듈 사용을 위해 지원 범위를 변경하게 되었다.

## 제거된 기능

### 1. jQuery Wrapper 제거

v3.0부터는 jQuery Wrapper가 제거되었다. jQuery에서 사용을 원하는 경우 직접 `@toast-ui/editor` 패키지를 랩핑하여 사용해야 한다.

### 2. 의존성 제거

기존의 CodeMirror, squire, to-mark 의존성이 모두 제거되었기 때문에 공식적인 API를 통해서든 비공식적 방법이든 해당 모듈에 직접 접근하여 조작하던 코드는 더 이상 동작하지 않을 것이다. 대부분의 필요한 기능은 에디터 인스턴스 API로 추가되었으니 해당 API를 사용하길 권장한다.

**v2.x**

```js
const editor = new Editor(/* */);

console.log(editor.getCodeMirror()); // CodeMirror 인스턴스
console.log(editor.getSquire()); // squire 인스턴스
```

**v3.0**

```js
const editor = new Editor(/* */);

console.log(editor.getCodeMirror()); // Uncaught TypeError
console.log(editor.getSquire()); // Uncaught TypeError
```

### 3. 제거된 API

마지막으로, 에디터 v3.0에서 제거된 API를 정리한 목록이다.

#### 정적 속성

| 이름                  | 타입               |
| --------------------- | ------------------ |
| `isViewer`            | `{boolean}` |
| `codeBlockManager`    | `{CodeBlockManager}` |
| `WwCodeBlockManager`  | `{Class.<WwCodeBlockManager>}` |
| `WwTableManager`      | `{Class.<WwTableManager>}` |
| `WwTableSelectionManager` | `{Class.<WwTableSelectionManager>}` |
| `CommandManager` | `{Class.<CommandManager>}` |

#### 정적 메서드

| 이름              | 타입         |
| ----------------- | ------------ |
| `getInstances` | `{function}` |

#### 인스턴스 생성 옵션

| 이름                 | 타입                       |
| -------------------- | -------------------------- |
| `useDefaultHTMLSanitizer` | `boolean`         |  
#### 인스턴스 메서드

| 이름       | 타입         |
| ---------- | ------------ |
| `setCodeBlockLanguages`  | `{function}` |
| `afterAddedCommand` | `{function}` |
| `getCodeMirror` | `{function}` |
| `getSquire` | `{function}` |
| `getCurrentModeEditor` | `{function}` |
| `getUI` | `{function}` |
