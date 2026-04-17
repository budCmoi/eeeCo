import { mockOrderHistory } from '@/data/products';
import { API_BASE_URL } from '@/lib/constants';
import type { Order, UserProfile } from '@/types';

import { api } from '@/services/api';

export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/auth/google`;
}

export async function fetchProfile() {
  try {
    const { data } = await api.get<UserProfile>('/users/me');
    return data;
  } catch {
    return null;
  }
}

export async function fetchOrderHistory() {
  try {
    const { data } = await api.get<Order[]>('/orders/me');
    return data;
  } catch {
    return mockOrderHistory;
  }
}