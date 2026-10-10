import { Stack } from 'expo-router';

import Colors from '@/theme/color';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.white }
      }}
    >
      <Stack.Screen name="welcome/index" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="signup/index" />
      <Stack.Screen
        name="(modal)/terms"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
          sheetGrabberVisible: true,
          sheetCornerRadius: 24
        }}
      />
      {/* 약관 시트 위에 뜨도록 모달로 지정 (일반 push는 iOS에서 시트 뒤에 깔림) */}
      <Stack.Screen name="(modal)/terms-detail" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
