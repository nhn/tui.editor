# 🧩 플러그인

TOAST UI Editor(이하 '에디터'라고 명시)는 기본으로 지원하지 않는 기능들을 플러그인으로 제공한다. 에디터에서 제공하는 플러그인은 현재 5개이며, 추후 자주 사용되는 기능은 더 추가될 수 있다.

| 플러그인 명 | 패키지 명 | 설명 |
| --- | --- | --- |
| [`chart`](https://github.com/nhn/tui.editor/tree/master/plugins/chart) | [`@toast-ui/editor-plugin-chart`](https://www.npmjs.com/package/@toast-ui/editor-plugin-chart) | 차트를 렌더링하기 위한 플러그인 |
| [`code-syntax-highlight`](https://github.com/nhn/tui.editor/tree/master/plugins/code-syntax-highlight) | [`@toast-ui/editor-plugin-code-syntax-highlight`](https://www.npmjs.com/package/@toast-ui/editor-plugin-code-syntax-highlight) | 코드 하이라이팅을 위한 플러그인 |
| [`color-syntax`](https://github.com/nhn/tui.editor/tree/master/plugins/color-syntax) | [`@toast-ui/editor-plugin-color-syntax`](https://www.npmjs.com/package/@toast-ui/editor-plugin-color-syntax) | 컬러피커 사용을 위한 플러그인 |
| [`table-merged-cell`](https://github.com/nhn/tui.editor/tree/master/plugins/table-merged-cell) | [`@toast-ui/editor-plugin-table-merged-cell`](https://www.npmjs.com/package/@toast-ui/editor-plugin-table-merged-cell) | 병합 테이블 셀을 사용하기 위한 플러그인 |
| [`uml`](https://github.com/nhn/tui.editor/tree/master/plugins/uml) | [`@toast-ui/editor-plugin-uml`](https://www.npmjs.com/package/@toast-ui/editor-plugin-uml) | UML 사용을 위한 플러그인 |

## 플러그인 설치 및 사용

각 플러그인은 npm을 통해 설치하거나 CDN 형태로 사용할 수 있다.

### 패키지 매니저(npm)를 통한 설치

CLI를 사용하여 각 플러그인을 설치할 수 있다. 설치할 플러그인의 이름을 아래의 `${pluginName}`에 작성하여 설치한다. 예를 들어 `chart` 플러그인을 설치할 경우 `npm install @toast-ui/editor-plugin-chart`로 설치한다.

```sh
$ npm install --save @toast-ui/editor-plugin-${pluginName} 
$ npm install --save @toast-ui/editor-plugin-${pluginName}@<version>
```

npm을 통해 설치할 경우 아래처럼 `node_modules`에 설치된다.

```
- node_modules/
   ├─ @toast-ui/editor-plugin-${pluginName}
   │     ├─ dist/
   │     │    ├─ toastui-editor-plugin-${pluginName}.js
   │     │    ├─ ...
```

설치한 플러그인은 모듈 포맷에 따라 아래처럼 가져올 수 있다.

- ES 모듈

```js
import pluginFn from '@toast-ui/editor-plugin-${pluginName}';
```

- CommonJS

```js
const pluginFn = require('@toast-ui/editor-plugin-${pluginName}');
```

예를 들어 `chart` 플러그인은 다음과 가져올 수 있다.

```js
import chart from '@toast-ui/editor-plugin-chart';
```

### CDN을 통한 설치

각 플러그인은 [NHN Cloud](https://www.toast.com)에서 제공하는 CDN을 통해서도 사용할 수 있다.

```html
...
<body>
  ...
  <script src="https://uicdn.toast.com/editor-plugin-${pluginName}/latest/toastui-editor-plugin-${pluginName}.min.js"></script>
</body>
...
```

특정 버전을 사용하려면 url 경로에서 `latest` 대신 버전을 명시하면 된다.

CDN 디렉터리의 구조는 다음과 같다.

```
- uicdn.toast.com/
   ├─ editor-plugin-${pluginName}/
   │     ├─ latest/
   │     │    ├─ toastui-editor-plugin-${pluginName}.js
   │     │    └─ ...
   │     ├─ 3.0.0/
   │     │    └─ ...
```

> 참조: 각 플러그인의 CDN 파일은 상황에 따라 모든 의존성을 포함하거나 다른 유형의 번들 파일을 제공한다. 자세한 내용은 각 플러그인 저장소를 확인바란다.

CDN을 사용해 플러그인을 가져올 때는 `toastui.Editor.plugin`에 등록된 네임스페이스를 사용한다.

```js
const pluginFn = toastui.Editor.plugin[${pluginName}];
```

예를 들어 `chart` 플러그인은 다음과 같이 가져온다.

```js
const { chart } = toastui.Editor.plugin;
```

### 플러그인 사용

ES 모듈과 CDN에 따라 플러그인을 설치하고 가져오는 방법은 차이가 있지만, 사용하는 방법은 동일하다.

가져온 플러그인을 사용하려면 에디터의 `plugins` 옵션에 플러그인 함수를 추가해야 한다. `plugins` 옵션의 타입은 `Array.<function>`이다.

```js
const editor = new Editor({
  // ...
  plugins: [plugin]
});
```
만약 `chart`와 `uml` 플러그인을 사용한다면, ES 모듈과 CDN 환경에서 각각 아래처럼 사용할 수 있다.

- ES 모듈

```js
import Editor from '@toast-ui/editor';
import chart from '@toast-ui/editor-plugin-chart';
import uml from '@toast-ui/editor-plugin-uml';

const editor = new Editor({
  // ...
  plugins: [chart, uml]
});
```

- CDN

```js
const { Editor } = toastui;
const { chart, uml } = Editor.plugin;

const editor = new Editor({
  // ...
  plugins: [chart, uml]
});
```

플러그인 함수에서 사용할 옵션이 필요한 경우 `plugins` 옵션에 튜플 형태의 데이터를 추가하면 된다.

```js
const pluginOptions = {
  // ...
};

const editor = new Editor({
  // ...
  plugins: [[plugin, pluginOptions]]
});
```

## 플러그인 만들기

기본적으로 제공되는 플러그인 외에도 사용자가 직접 플러그인 함수를 정의하여 사용할 수 있다.

아래처럼 플러그인 함수를 정의하여 정해진 포맷에 맞는 객체를 반환한다.

```ts
interface PluginInfo {
  toHTMLRenderers?: HTMLConvertorMap;
  toMarkdownRenderers?: ToMdConvertorMap;
  markdownPlugins?: PluginProp[];
  wysiwygPlugins?: PluginProp[];
  wysiwygNodeViews?: NodeViewPropMap;
  markdownCommands?: PluginCommandMap;
  wysiwygCommands?: PluginCommandMap;
  toolbarItems?: PluginToolbarItem[];
}

const pluginResult: PluginInfo = {
  // ...
}

function customPlugin() {
  // ...
  return pluginResult;
}
```

다른 플러그인과 마찬가지로 에디터의 `plugins` 옵션을 통해 직접 정의한 플러그인 함수를 추가하여 사용할 수 있다.

```js
const editor = new Editor({
  // ...
  plugins: [customPlugin]
});
```

### 플러그인 반환 객체

플러그인에서 반환하는 객체의 프로퍼티에 대해 알아보겠다. 아래처럼 총 8개의 프로퍼티가 존재하며, 커스터마이징을 원하는 프로퍼티만 정의하여 반환한다.

```ts
interface PluginInfo {
  toHTMLRenderers?: HTMLConvertorMap;
  toMarkdownRenderers?: ToMdConvertorMap;
  markdownCommands?: PluginCommandMap;
  wysiwygCommands?: PluginCommandMap;
  toolbarItems?: PluginToolbarItem[];
  markdownPlugins?: PluginProp[];
  wysiwygPlugins?: PluginProp[];
  wysiwygNodeViews?: NodeViewPropMap;
}
```

#### toHTMLRenderers

`toHTMLRenderers` 객체는 에디터의 마크다운 프리뷰에서 렌더링될 때 또는 마크다운 에디터에서 위지윅 에디터로 컨버팅될 때 요소의 렌더링 결과를 변경할 수 있다. 에디터의 [customHTMLRenderer](https://github.com/nhn/tui.editor/blob/master/docs/ko/custom-html-renderer.md) 옵션과 동일하다.

**toMarkdownRenderers**

`toMarkdownRenderers` 객체는 위지윅 에디터에서 마크다운 에디터로 컨버팅될 때 변환되는 마크다운 텍스트를 재정의할 수 있다. `toMarkdownRenderers` 객체에 정의하는 함수는 `nodeInfo`와 `context` 두 가지 매개변수를 가진다.

* `nodeInfo`: 컨버팅 대상이 되는 위지윅 노드의 정보이다.
  * `node`: 대상 노드에 대한 정보가 담겨 있다.
  * `parent`: 대상 노드의 부모 노드 정보가 담겨 있다.
  * `index`: 대상 노드가 몇 번째 자식인지 알 수 있다.
* `context`: 노드 정보 외에 컨버팅에 필요한 정보들이 담겨있다.
  * `entering`: 해당 노드에 최초 방문인지, 자식 노드의 순회를 모두 끝내고 방문하는 것인지 알 수 있다.
  * `origin`: 기존 컨버팅 함수의 동작을 실행하는 함수이다.

`toMarkdownRenderers` 에 정의된 함수는 결과값으로 마크다운 텍스트로 변환할 때 필요한 토큰 정보들을 반환한다.

```ts
interface ToMdConvertorReturnValues {
  delim?: string | string[];
  rawHTML?: string | string[] | null;
  text?: string;
  attrs?: Attrs;
}
```

* `delim`: 마크다운 텍스트에서 사용할 기호를 정의한다. 마크다운 불릿 리스트의 `*`, `-`처럼 여러 기호로 변환될 수 있는 경우 사용한다.
* `rawHTML`: 노드를 마크다운의 HTML 노드(HTML 문자열)로 변환할 경우 필요한 문자열이다.
* `text`: 마크다운에서 보여줄 텍스트 정보이다.
* `attrs`: 노드를 마크다운 텍스트로 변환할 때 사용할 속성 정보이다. 예를 들어 태스크 리스트의 체크 여부나 이미지 노드의 url 정보가 있다.

**예시**
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

위의 코드는 병합 테이블 플러그인의 예시이다. `toHTMLRenderers`에 정의된 `tableCell` 노드의 반환 결과는 마크다운 프리뷰와 위지윅 에디터로 컨버팅 시 사용되며, `toMarkdownRenderers`에 정의된 `tableHead` 노드의 텍스트 결과는 마크다운 에디터로 컨버팅 시 사용된다.

![image](https://user-images.githubusercontent.com/37766175/121026660-4c80a380-c7e1-11eb-9d36-65425b6944da.gif)

#### markdownCommands, wysiwygCommands

플러그인에서는 `markdownCommands`, `wysiwygCommands` 옵션을 사용하여 마크다운, 위지윅 커맨드를 등록할 수 있다.

각각의 커맨드 함수는 `payload`, `state`, `dispatch` 세 개의 매개변수를 가지며, 이를 사용하여 [Prosemirror](https://prosemirror.net/) 기반의 에디터 내부 동작을 제어할 수 있다.

* `payload`: 커맨드 실행할 때 필요한 `payload`이다.
* `state`: 에디터의 내부 상태를 나타내는 인스턴스로 [prosemirror-state](https://prosemirror.net/docs/ref/#state)와 동일하다.
* `dispatch`: 커맨드 실행을 통해 에디터의 콘텐츠를 변경하고 싶은 경우 `dispatch` 함수를 실행해야 한다. Prosemirror의 [dispatch](https://prosemirror.net/docs/ref/#view.EditorView.dispatch) 함수와 동일하다.

만약 커맨드 함수를 실행하여 에디터의 콘텐츠에 변경 사항이 발생한다면 반드시 `true`를 반환해야 한다. 반대의 경우에는 `false`를 반환해야 한다.

```js
return {
  markdownCommands: {
    myCommand: (payload, state, dispatch) => {
      // ...
      return true;
    },
  },
  wysiwygCommands: {
    myCommand: (payload, state, dispatch) => {
      // ...
      return true;
    },
  },
};
```

위의 예시 코드처럼 플러그인에서 커맨드 함수를 정의하여 반환하면, 해당 커맨드를 에디터에서 사용할 수 있다.

#### toolbarItems

플러그인에서 에디터의 툴바 아이템을 등록할 수도 있다.

```js
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

위의 코드처럼 `toolbarItems` 배열에 어떤 아이템을 추가할지 설정할 수 있다. 각 옵션 객체는 `groupIndex`, `itemIndex`, `item` 세 가지 프로퍼티가 있으며 다음과 같다.

* `groupIndex`: 툴바 아이템을 추가할 그룹의 인덱스를 지정한다.
* `itemIndex`: 지정한 그룹 내에서 몇 번째로 추가할지 인덱스를 지정한다.
* `item`: 추가할 툴바 아이템 요소를 지정한다. [툴바](https://github.com/nhn/tui.editor/blob/master/docs/ko/toolbar.md)의 툴바 커스터마이징에서 사용되는 객체와 동일한 형태이다.

만약 예제 코드처럼 `toolbarItems` 옵션을 설정한다면, 1번째 툴바 그룹의 4번째 인덱스로 툴바 아이템을 등록할 것이다.

#### markdownPlugins, wysiwygPlugins

에디터는 내부적으로 Prosemirror를 사용한다. Prosemirror는 내부적으로 자체적인 플러그인 시스템을 제공한다. 에디터의 플러그인에서도 에디터의 내부 동작을 제어하기 위해 이러한 Prosemirror 플러그인을 직접 정의할 수 있다. 대부분의 경우 이러한 옵션은 필요없지만, 종종 필요한 경우가 있다. 예를 들어 코드 하이라이팅 플러그인에서는 위지윅 에디터의 `codeBlock`에 표시되는 코드를 하이라이팅할 때 사용한다.

```js
return {
  wysiwygPlugins: [() => codeSyntaxHighlighting(context, prism)],
};
```

이 옵션 객체를 사용하는 방법은 Prosemirror의 플러그인 정의 방법과 동일하니, [여기](https://prosemirror.net/docs/ref/#state.Plugin)를 참조 바란다.

#### wysiwygNodeViews

마크다운 에디터는 일반 텍스트이지만, 위지윅 에디터의 콘텐츠는 특정한 노드로 구성된다. 이러한 노드들은 `customHTMLRenderer` 옵션을 사용하여 속성이나 클래스를 추가하는 커스터마이징이 가능하다. 하지만 그 외에 이벤트를 등록하여 무언가를 제어하거나, 더 복잡한 상호 작용을 원하는 경우 `customHTMLRenderer` 옵션만으로는 한계가 있다. 이런 경우 플러그인의 `wysiwygNodeViews` 옵션을 사용하여 위지윅 에디터에서 렌더링되는 노드를 원하는 대로 커스터마이징할 수 있다. 
이 옵션 역시 대부분의 경우에는 필요가 없을 것이다. `wysiwygPlugins` 프로퍼티와 마찬가지로 `wysiwygNodeViews` 프로퍼티도 코드 하이라이팅 플러그인에서 사용된다.

```js
return {
  wysiwygNodeViews: {
    codeBlock: createCodeSyntaxHighlightView(registerdlanguages),
  },
};
```

이 옵션 객체를 사용하는 방법은 Prosemirror의 `nodeView` 정의 방법과 동일하니, [여기](https://prosemirror.net/docs/ref/#view.NodeView)를 참조 바란다.

### 플러그인 함수의 `context` 매개변수
플러그인 함수는 위에서 살펴본 다양한 프로퍼티를 정의하기 위해 `context` 매개변수로 필수적인 정보들을 사용할 수 있다. `context` 매개변수는 아래와 같은 정보들을 가지고 있다.

* `eventEmitter`: 에디터의 `eventEmitter`와 동일하다. 에디터와의 통신을 위해 사용한다.
* `usageStatistics`: 해당 플러그인을 `@toast-ui/editor`의 GA로 수집할지 결정한다.
* `i18n`: 다국어 추가를 위한 인스턴스이다.
* `pmState`: [prosemirror-state](https://prosemirror.net/docs/ref/#state)의 일부 모듈을 가진 프로퍼티이다.
* `pmView`: [prosemirror-view](https://prosemirror.net/docs/ref/#view)의 일부 모듈을 가진 프로퍼티이다.
* `pmModel`: [prosemirror-model](https://prosemirror.net/docs/ref/#model)의 일부 모듈을 가진 프로퍼티이다.
