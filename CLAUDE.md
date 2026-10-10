## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## 테스트 파일 작성 시 유의사항 (중요)

Rules:

- 테스트 파일 작성 가독성을 위해 `~ 하면 ~ 한다`로 작성

## 코드 작성 시 유의사항 (중요)

Rules:

- 코드 작성 시 불필요한 주석은 작성하지 않는다. 과한 주석은 코드 이해를 방해한다. 주석 작성 시 한글로 작성한다.
- 컴포넌트의 핸들러는 반드시 handle~ 이라는 함수명을 가져야한다.

```javascript
// Bad
return <Components onClose={() => setState(false)} />;

// Good
function handleClose() {
  setState(false);
}
return <Components onClose={handleClose} />;

// 굳이 하지 않아도 되는것
function ExampleComp({ onClose }) {
  function handleClose() {
    onClose();
  }

  return <Components onClose={handleClose} />;
}
```

- src/app 하위에 들어가는 페이지의 function 이름은 ~Screen으로 통일한다. 예외로는 modal로 뜨는 애들은 Screen이 어색하니 ~Modal, ~BottomSheet 등으로 작성한다. ex) Login X -> LoginScreen
- src/components에 들어가는 컴포넌트들의 function 이름은 마지막에 Screen을 넣지 않는다. ex) AuthScreen X -> AuthForm or BaseAuth 등
- boolean 값을 담는 변수는 is, has 등이 붙는다. ex) isVisible, hasAccount
