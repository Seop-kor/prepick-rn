import API from '@/service/api';

export async function login(phone: string, password: string) {
  return API.login(phone, password);
}

export async function sendSignupOtp(phone: string) {
  return API.sendSignupOtp(phone);
}

export async function verifySignupOtp(phone: string, code: string) {
  return API.verifySignupOtp(phone, code);
}

export async function signUp(name: string, password: string, verificationToken: string) {
  return API.signUp(name, password, verificationToken);
}
