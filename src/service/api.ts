import { login, sendSignupOtp, signUp, verifySignupOtp } from '@/graphql/mutations';
import { healthCheck } from '@/graphql/queries';

import { requestGraphQL } from '@/service/client';
import { toDigits } from '@/utils/phone';

class API {
  // GraphQL:  sendOtp(phone: string) { return requestGraphQL(SendOtp, { phone }).then((r) => r.sendOtp); }
  // Public:   requestGraphQL(Document, variables, { skipAuth: true })
  // REST:     http.post('/upload', form).then((r) => r.data)
  healthCheck() {
    return requestGraphQL(healthCheck, {}, { skipAuth: true }).then((res) => res.healthCheck);
  }

  login(phone: string, password: string) {
    return requestGraphQL(login, { input: { phone: toDigits(phone), password } }, { skipAuth: true }).then(
      (res) => res.login
    );
  }

  sendSignupOtp(phone: string) {
    return requestGraphQL(sendSignupOtp, { phone: toDigits(phone) }, { skipAuth: true }).then(
      (res) => res.sendSignupOtp
    );
  }

  verifySignupOtp(phone: string, code: string) {
    return requestGraphQL(verifySignupOtp, { phone: toDigits(phone), code }, { skipAuth: true }).then(
      (res) => res.verifySignupOtp
    );
  }

  signUp(name: string, password: string, verificationToken: string) {
    return requestGraphQL(signUp, { input: { name, password, verificationToken } }, { skipAuth: true }).then(
      (res) => res.signUp
    );
  }
}

const instance = new API();
export default instance;
