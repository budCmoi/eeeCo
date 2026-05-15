import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<User>(`${environment.apiUrl}/profile`);
  }

  updateProfile(data: Partial<User>) {
    return this.http.put<User>(`${environment.apiUrl}/profile`, data);
  }

  addAddress(data: object) {
    return this.http.post(`${environment.apiUrl}/profile/addresses`, data);
  }

  removeAddress(id: string) {
    return this.http.delete(`${environment.apiUrl}/profile/addresses/${id}`);
  }

  addPaymentMethod(data: object) {
    return this.http.post(`${environment.apiUrl}/profile/payment-methods`, data);
  }

  removePaymentMethod(id: string) {
    return this.http.delete(`${environment.apiUrl}/profile/payment-methods/${id}`);
  }
}
