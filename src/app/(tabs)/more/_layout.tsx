import { Stack } from 'expo-router';

import Colors from '@/theme/color';

export default function MoreLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.white } }}
    />
  );
}
