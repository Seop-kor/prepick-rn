import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useIsHydrated, useIsLoggedIn, hydrateAuth } from '@/stores/auth';

// 앱 진입점: 초기화 후 로그인 상태에 따라 이동
// 로그인/로그아웃으로 Stack.Protected 가드가 바뀔 때도 여기서 다시 이동
export default function IndexScreen() {
  const isHydrated = useIsHydrated();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (isHydrated) return;
    hydrateAuth().then(SplashScreen.hide);
  }, [isHydrated]);

  if (!isHydrated) return null;
  return <Redirect href={isLoggedIn ? '/home' : '/welcome'} />;
}
