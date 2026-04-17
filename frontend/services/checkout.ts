import type { Address, CartItem } from '@/types';

import { FRONTEND_URL } from '@/lib/constants';
import { api } from '@/services/api';

export type CheckoutPayload = {
  items: CartItem[];
  address: Address;
};

function getFrontendUrl() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return FRONTEND_URL;
}

export async function createCheckoutSession(payload: CheckoutPayload) {
  try {
    const { data } = await api.post('/payments/checkout-session', payload);
    return data;
  } catch {
    return {
      url: `${getFrontendUrl()}/account?payment=demo-success`,
      mode: 'demo'
    };
  }
}