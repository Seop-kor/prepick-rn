# Prepick

Prepick의 매장과 주문 도메인에서 사용하는 표준 용어를 정의한다.

## Language

**진행 중 주문**:
고객이 픽업하기 전까지 매장이 확인하거나 접수·준비하는 주문. CREATED, CONFIRMED, IN_PROGRESS, READY 상태의 주문을 말한다.
_Avoid_: 실시간 주문, 활성 주문

**취소된 주문**:
고객 취소와 매장 거절을 구분하지 않고 CANCELED 상태로 나타내는 종료된 주문이다.
_Avoid_: 별도 상태로서의 거절된 주문
