import { useMutation } from '@tanstack/react-query';

import { setTokens } from '@/stores/auth';
import { login, sendSignupOtp, signUp, verifySignupOtp } from '@/tanstack/mutations';

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
