import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'aurora_token';
  private readonly USER_KEY = 'aurora_user';

  currentUser = signal<User | null>(this.loadUser());
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap(res => { this.handleAuth(res); this.router.navigate(['/']); }));
  }

  register(payload: { firstName?: string; lastName?: string; name?: string; email: string; password: string }) {
    const name = payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim();
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { ...payload, name })
      .pipe(tap(res => { this.handleAuth(res); this.router.navigate(['/']); }));
  }

  // Démo Google login — simule sans OAuth réel
  loginWithGoogle() {
    const demoUser: User = {
      id: 'demo-google-' + Date.now(),
      firstName: 'Demo',
      lastName: 'Google',
      name: 'Demo Google',
      email: 'demo.google@aurora.fr',
      role: 'user',
    };
    this.currentUser.set(demoUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(demoUser));
    localStorage.setItem(this.TOKEN_KEY, 'demo-token-google');
    this.router.navigate(['/profil']);
  }

  // Démo Apple login
  loginWithApple() {
    const demoUser: User = {
      id: 'demo-apple-' + Date.now(),
      firstName: 'Demo',
      lastName: 'Apple',
      name: 'Demo Apple',
      email: 'demo.apple@aurora.fr',
      role: 'user',
    };
    this.currentUser.set(demoUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(demoUser));
    localStorage.setItem(this.TOKEN_KEY, 'demo-token-apple');
    this.router.navigate(['/profil']);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  updateCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }
}
