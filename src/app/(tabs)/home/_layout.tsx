import { Stack } from 'expo-router';

import Colors from '@/theme/color';

export default function HomeLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.white } }}
    />
  );
}
