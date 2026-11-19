import { clearTokens } from '@/stores/auth';
import { clearCart } from '@/stores/cart';
import { queryClient } from '@/tanstack/client';

export async function logout() {
  await clearTokens();
  clearCart();
  queryClient.clear();
}
