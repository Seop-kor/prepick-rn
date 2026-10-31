import { skipToken, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import { setTokens } from '@/stores/auth';
import type { Coords } from '@/stores/location';
import { login, sendSignupOtp, signUp, verifySignupOtp } from '@/tanstack/mutations';
import { getCurrentUser, getNearbyStores, getNewStores, getOrders, getPromotions } from '@/tanstack/queries';

export function useLogin() {
  return useMutation({
    mutationFn: ({ phone, password }: { phone: string; password: string }) => login(phone, password),
    onSuccess: setTokens
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

export function useCurrentUser() {
  return useQuery({ queryKey: ['currentUser'], queryFn: getCurrentUser });
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
