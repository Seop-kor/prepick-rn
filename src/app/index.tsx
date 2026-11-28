import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { getAccessToken, useIsHydrated, useIsLoggedIn, hydrateAuth } from '@/stores/auth';
import { initLocation } from '@/stores/location';
import { queryClient } from '@/tanstack/client';
import { currentUserQuery } from '@/tanstack/queries';

// 스플래시 동안 이름을 받아 두어 더보기에서 기다리지 않게 한다. prefetchQuery는 실패해도 throw하지 않는다
async function prefetchCurrentUser() {
  if (getAccessToken()) await queryClient.prefetchQuery(currentUserQuery);
}

// 앱 진입점: 초기화 후 로그인 상태에 따라 이동
// 로그인/로그아웃으로 Stack.Protected 가드가 바뀔 때도 여기서 다시 이동
export default function IndexScreen() {
  const isHydrated = useIsHydrated();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (isHydrated) return;
    hydrateAuth().then(prefetchCurrentUser).then(SplashScreen.hide);
    initLocation();
  }, [isHydrated]);

  if (!isHydrated) return null;
  return <Redirect href={isLoggedIn ? '/home' : '/welcome'} />;
}
