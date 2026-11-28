import { skipToken, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import API from '@/service/api';
import { getRefreshToken, setTokens } from '@/stores/auth';
import type { Coords } from '@/stores/location';
import { logout as clearSession } from '@/stores/session';
import { login, logout, sendSignupOtp, signUp, verifySignupOtp } from '@/tanstack/mutations';
import {
  currentUserQuery,
  getNearbyStores,
  getOngoingOrders,
  getNewStores,
  getOrders,
  getPromotions
} from '@/tanstack/queries';

export function useLogin() {
  return useMutation({
    mutationFn: ({ phone, password }: { phone: string; password: string }) => login(phone, password),
    onSuccess: setTokens
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      // 서버 세션 폐기는 기다리지 않고 실패해도 알리지 않는다
      if (refreshToken) logout(refreshToken).catch(() => {});
      await clearSession();
    }
  });
}

export function useSendSignupOtp() {
  return useMutation({
    mutationFn: ({ phone }: { phone: string }) => sendSignupOtp(phone)
  });
}

export function useVerifySignupOtp() {
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) => verifySignupOtp(phone, code)
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: ({
      name,
      password,
      verificationToken
    }: {
      name: string;
      password: string;
      verificationToken: string;
    }) => signUp(name, password, verificationToken)
  });
}

export function useOrders() {
  return useInfiniteQuery({
    queryKey: ['orders'],
    queryFn: ({ pageParam }) => getOrders(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
}

export function useOrder(id: string) {
  return useQuery({ queryKey: ['order', id], queryFn: () => API.getOrder(id) });
}

export function useOngoingOrders() {
  return useQuery({ queryKey: ['ongoingOrders'], queryFn: getOngoingOrders });
}

export function useCurrentUser() {
  return useQuery(currentUserQuery);
}

export function usePromotions() {
  return useQuery({ queryKey: ['promotions'], queryFn: getPromotions });
}

export function useNearbyStores(coords: Coords | null) {
  return useQuery({
    queryKey: ['stores', coords?.latitude, coords?.longitude],
    queryFn: coords ? () => getNearbyStores(coords) : skipToken
  });
}

export function useNewStores() {
  return useQuery({ queryKey: ['newStores'], queryFn: getNewStores });
}
