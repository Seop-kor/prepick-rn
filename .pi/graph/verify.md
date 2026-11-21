# 실행 검증 설정

verification 노드가 이 파일만 보고 서버를 띄우고 e2e를 실행한다. 노드는 스택을 모른다. 프로젝트가 명령을 적는다.
`<채우기>`가 남아 있으면 `doctor`가 경고한다. 해당하지 않는 섹션은 통째로 지운다.

## frontend

- 서버 실행: `yarn start --dev-client`
- 준비 확인: `curl -sf http://localhost:8081/status`
- 준비 대기 한도(초): 180
- e2e 실행: `maestro test .maestro/`
- e2e 시나리오 위치: `.maestro/`
