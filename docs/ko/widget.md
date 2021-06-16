# 📱 위젯 노드

에디터 내에서 특정 키를 입력할 때 인명 검색과 같은 팝업 창을 띄우거나, 멘션 형태의 일반 링크 노드를 특정한 위젯 노드로 보여주고 싶을 때가 있을 것이다. TOAST UI Editor(이하 '에디터'라고 명시)에서는 이러한 기능을 위해 옵션과 API를 제공한다.

## 팝업 위젯

에디터에서 콘텐츠를 편집하다 보면, 현재 커서의 위치에 검색 또는 추천 팝업을 띄우고 싶을 때가 있다. 이 때 `addWidget` API를 사용하여 원하는 DOM 노드를 에디터 상에 띄울 수 있다. 이 노드는 편집 중인 콘텐츠에는 영향을 미치지 않으며, **일시적으로 추가**된다. 즉, 텍스트를 입력하거나 포커스를 옮기면 사라진다. API의 시그니처는 아래와 같다.

```ts
addWidget(node: Node, style: WidgetStyle, pos?: EditorPos)
```

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `node` | Node | 위젯으로 추가할 DOM 노드 | 
| `style` | 'top' \| 'bottom' | 위젯을 지정된 위치의 위에 추가할 지 아래에 추가할 지 결정한다. | 
| `pos` | EditorPos | 위젯이 추가될 위치를 지정한다. 옵셔널 값이며, 지정하지 않을 경우 현재 커서 위치에 위젯이 추가된다. | 

```js
const popup = document.createElement('ul');
// ...

editor.addWidget(popup, 'top');
```

위의 코드가 실행되면 아래처럼 `popup` 노드가 추가된다. 

![image](https://user-images.githubusercontent.com/37766175/120617182-d6a0d300-c494-11eb-8fb9-58926c60e8b7.png)

만약 특정 키를 입력했을 때 위젯 노드를 띄우고 싶다면, 에디터의 `keyup` 이벤트와 연동해서 사용할 수 있다.

```js
editor.on('keyup', (editorType, ev) => {
  if (ev.key === '@') {
    const popup = document.createElement('ul');
    // ...
  
    editor.addWidget(popup, 'top');
  }
})
```

### 인라인 위젯 노드

일시적으로 특정 상황에 따라 팝업 위젯 노드를 추가하는 방법을 살펴보았다. 그렇다면 만약 팝업 위젯에서 특정 항목을 클릭하여 멘션 형태의 노드를 추가하고 싶다면 어떻게 할 수 있을까? 
마크다운 에디터는 텍스트 기반 에디터이기 때문에 이러한 멘션 노드를 추가할 수 없다. 위지윅 에디터에서도 내부적으로 별도의 멘션 노드를 기본으로 지원하지 않기 때문에 추가할 수 없다. 
에디터에서 멘션 노드와 같은 *인라인 위젯 노드*를 추가하고 싶은 사용자를 위해 `widgetRules` 옵션을 제공한다. 만약 텍스트가 `widgetRules` 옵션에 설정한 규칙에 맞는다면 해당 노드는 에디터에서 인라인 위젯 노드로 렌더링 된다. **인라인 위젯 노드는 팝업 위젯과는 다르게 콘텐츠로서 에디터에 삽입되며, 다른 노드의 위치에 영향을 준다**.

```js
const reWidgetRule = /\[(@\S+)\]\((\S+)\)/;

const editor = new Editor({
  el: document.querySelector('#editor'),
  widgetRules: [
    {
      rule: reWidgetRule,
      toDOM(text) {
        const rule = reWidgetRule;
        const matched = text.match(rule);
        const span = document.createElement('span');
  
        span.innerHTML = `<a class="widget-anchor" href="${matched[2]}">${matched[1]}</a>`;
        return span;
      },
    },
  ],
});
```

예제 코드에서 볼 수 있듯이 `widgetRules`는 배열 형태로 각각의 규칙을 정의하며, 각 규칙은 `rule`, `toDOM`이라는 프로퍼티로 구성된다.

* `rule`: 반드시 정규식 값이 와야하며, 이 정규식에 맞는 텍스트는 위젯 노드로 치환되어 렌더링된다.
* `toDOM`: 렌더링될 위젯 노드의 DOM 노드를 정의한다.

`widgetRules`의 규칙에 맞는 텍스트가 입력되면, 아래 이미지처럼 인라인 위젯 노드로 치환되어 렌더링된다.

![image](https://user-images.githubusercontent.com/37766175/120621226-a6f3ca00-c498-11eb-9355-0275fd3bdbdb.gif)

### `insertText()`, `replaceSelection()` API

위젯 규칙에 맞는 텍스트를 직접 입력하여 인라인 위젯 노드 형태로 치환할 수도 있지만, 대부분의 경우는 팝업 위젯에서 특정 항목을 클릭하여 멘션 노드와 같은 인라인 위젯 노드를 삽입하고 싶을 것이다.

이러한 경우 `insertText()`, `replaceSelection()` API를 사용하여 팝업 위젯의 항목을 클릭하였을 때 인라인 위젯 노드를 삽입할 수 있다.

```js
ul.addEventListener('mousedown', (ev) => {
  const text = ev.target.textContent.replace(/\s/g, '').replace(/😎/g, '');
  const [start, end] = editor.getSelection();

  editor.replaceSelection(`[@${text}](${text})`, [start[0], start[1] - 1], end);
});
```

예제 코드에서는 `@` 문자까지 포함하여 치환해야 하기 때문에 `getSelection()` API로 현재 커서 위치를 기준으로 계산한 후 `replaceSelection()` API를 호출하였다. 결과적으로 아래 이미지처럼 팝업 위젯의 항목을 클릭하였을 때 `@` 문자가 인라인 위젯 노드로 치환되는 것을 볼 수 있다.

![image](https://user-images.githubusercontent.com/37766175/120624280-81b48b00-c49b-11eb-9896-432120c27389.gif)
