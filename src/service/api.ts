import { healthCheck } from '@/graphql/queries';

import { requestGraphQL } from '@/service/client';

class API {
  // GraphQL:  sendOtp(phone: string) { return requestGraphQL(SendOtp, { phone }).then((r) => r.sendOtp); }
  // Public:   requestGraphQL(Document, variables, { skipAuth: true })
  // REST:     http.post('/upload', form).then((r) => r.data)
  healthCheck() {
    return requestGraphQL(healthCheck, {}, { skipAuth: true }).then((res) => res.healthCheck);
  }
}

const instance = new API();
export default instance;
