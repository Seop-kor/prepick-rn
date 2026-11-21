## 테스트 파일 작성 시 유의사항 (중요)

Rules:

- 테스트 파일 작성 가독성을 위해 `~ 하면 ~ 한다`로 작성
- 테스트 파일은 src와 같은 레벨의 `__tests__` 폴더에 src 구조 그대로 둔다. ex) src/stores/cart.ts -> __tests__/stores/cart.test.ts

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
- 함수는 이름이 말하는 일만 한다. 이름과 상관없는 동작을 기존 함수에 끼워 넣지 않는다. 여러 동작을 묶어야 하면 그 묶음을 설명하는 이름의 함수를 새로 만든다. ex) clearTokens 안에서 장바구니 비우기 X -> clearTokens와 clearCart를 호출하는 logout 함수를 만든다

## Agent skills

### Issue tracker

이슈는 Jira로 관리하고 spec은 `docs/features/<slug>/design.md`에 둡니다(pi graph 워크플로). See `docs/agents/issue-tracker.md`.

### Domain docs

single-context(루트 `GLOSSARY.md` + `docs/adr/`). See `docs/agents/domain.md`.
