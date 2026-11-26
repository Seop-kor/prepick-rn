import { login, sendSignupOtp, signUp, verifySignupOtp } from '@/graphql/mutations';
import type { OrderStatus } from '@/graphql/__generated__/graphql';
import { currentUser, healthCheck, newStores, order, orders, promotions, stores } from '@/graphql/queries';

import { requestGraphQL } from '@/service/client';
import { toDigits } from '@/utils/phone';

class API {
  // GraphQL:  sendOtp(phone: string) { return requestGraphQL(SendOtp, { phone }).then((r) => r.sendOtp); }
  // Public:   requestGraphQL(Document, variables, { skipAuth: true })
  // REST:     http.post('/upload', form).then((r) => r.data)
  healthCheck() {
    return requestGraphQL(healthCheck, {}, { skipAuth: true }).then((res) => res.healthCheck);
  }

  currentUser() {
    return requestGraphQL(currentUser, {}).then((res) => res.currentUser);
  }

  promotions() {
    return requestGraphQL(promotions, {}).then((res) => res.promotions);
  }

  stores(latitude: number, longitude: number, size: number) {
    return requestGraphQL(stores, { latitude, longitude, size }).then((res) => res.stores.items);
  }

  newStores(size: number) {
    return requestGraphQL(newStores, { size }).then((res) => res.newStores.items);
  }

  getOrders(cursor: string | null, size: number, statuses?: OrderStatus[]) {
    return requestGraphQL(orders, { cursor, size, statuses }).then((res) => res.orders);
  }

  getOrder(id: string) {
    return requestGraphQL(order, { id }).then((res) => res.order);
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
