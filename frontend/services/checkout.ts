import type { Address, CartItem } from '@/types';

import { FRONTEND_URL } from '@/lib/constants';
import { api } from '@/services/api';

export type CheckoutPayload = {
  items: CartItem[];
  address: Address;
};

export async function createCheckoutSession(payload: CheckoutPayload) {
  try {
    const { data } = await api.post('/payments/checkout-session', payload);
    return data;
  } catch {
    return {
      url: `${FRONTEND_URL}/account?payment=demo-success`,
      mode: 'demo'
    };
  }
}