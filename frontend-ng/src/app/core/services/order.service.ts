import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Order } from '../models/user.model';

export interface CreateOrderPayload {
  items: Array<{ productId: string; quantity: number; price: number }>;
  shippingAddress?: string;
  address?: Record<string, string>;
  promoCode?: string;
  paymentMethod?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  createDemo(payload: CreateOrderPayload) {
    return this.http.post<Order>(`${environment.apiUrl}/orders/demo`, payload);
  }

  getMyOrders() {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`);
  }

  getOrder(id: string) {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }
}
