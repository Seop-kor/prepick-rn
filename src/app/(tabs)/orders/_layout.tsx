import { Stack } from 'expo-router';

import Colors from '@/theme/color';

export default function OrdersLayout() {
  return (
    <Stack
      // 다른 탭에서 withAnchor로 상세를 바로 열어도 뒤로 가면 목록이 나오도록 목록을 기준 화면으로 둔다
      initialRouteName="index"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.white } }}
    />
  );
}
