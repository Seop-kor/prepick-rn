import type { Order, OrderStatus } from '@/components/(tabs)/orders/mock';
import Colors from '@/theme/color';

type StatusInfo = {
  label: string;
  message: string;
  // 목록 상태 글자색
  labelColor: string;
  // 상세 상태 문장 색
  messageColor: string;
  // 진행 단계. 끝난 주문은 null
  step: number | null;
};

export const ORDER_STEPS = ['확인', '접수', '준비', '픽업 가능'];

export const ORDER_STATUS: Record<OrderStatus, StatusInfo> = {
  PENDING: {
    label: '주문 확인 중',
    message: '주문을 확인하고 있어요',
    labelColor: Colors.primary,
    messageColor: Colors.black,
    step: 0
  },
  ACCEPTED: {
    label: '주문 접수',
    message: '주문이 접수됐어요',
    labelColor: Colors.primary,
    messageColor: Colors.black,
    step: 1
  },
  PREPARING: {
    label: '메뉴 준비 중',
    message: '메뉴를 만들고 있어요',
    labelColor: Colors.primary,
    messageColor: Colors.black,
    step: 2
  },
  READY: {
    label: '픽업 가능',
    message: '카운터에서 받아가세요',
    labelColor: Colors.green,
    messageColor: Colors.green,
    step: 3
  },
  PICKED_UP: {
    label: '픽업 완료',
    message: '픽업을 완료했어요',
    labelColor: Colors.darkGray,
    messageColor: Colors.black,
    step: null
  },
  CANCELED: {
    label: '주문 취소',
    message: '주문이 취소됐어요',
    labelColor: Colors.red,
    messageColor: Colors.red,
    step: null
  },
  REJECTED: {
    label: '주문 거절',
    message: '주문이 거절됐어요',
    labelColor: Colors.red,
    messageColor: Colors.red,
    step: null
  }
};

export function isLiveOrder(order: Order) {
  return ORDER_STATUS[order.status].step !== null;
}

export function isVoidOrder(order: Order) {
  return order.status === 'CANCELED' || order.status === 'REJECTED';
}
