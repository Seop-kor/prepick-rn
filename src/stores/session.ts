import { clearTokens } from '@/stores/auth';
import { clearCart } from '@/stores/cart';

export async function logout() {
  await clearTokens();
  clearCart();
}
