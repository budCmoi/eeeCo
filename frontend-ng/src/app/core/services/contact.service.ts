import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  send(payload: ContactPayload) {
    return this.http.post<{ message: string; id: string }>(
      `${environment.apiUrl}/contact`,
      payload
    );
  }
}
