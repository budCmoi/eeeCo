import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-brand-dark flex items-center justify-center py-20 px-4">

      <!-- Background déco -->
      <div class="absolute top-1/3 left-1/3 w-96 h-96 bg-brand-yellow/3 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-md animate-fade-up">

        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-yellow to-brand-orange
                      flex items-center justify-center text-brand-dark font-relicta text-2xl font-bold mx-auto mb-4">
            A
          </div>
          <h1 class="font-relicta text-3xl text-brand-light">Aurora Essence</h1>
          <p class="text-brand-muted mt-1">{{ tab === 'login' ? 'Bienvenue de retour' : 'Créez votre compte' }}</p>
        </div>

        <!-- Tabs -->
        <div class="flex bg-brand-surface rounded-2xl p-1 mb-8">
          <button (click)="tab = 'login'"
                  class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  [class.bg-brand-card]="tab === 'login'"
                  [class.text-brand-light]="tab === 'login'"
                  [class.text-brand-muted]="tab !== 'login'">
            Connexion
          </button>
          <button (click)="tab = 'register'"
                  class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  [class.bg-brand-card]="tab === 'register'"
                  [class.text-brand-light]="tab === 'register'"
                  [class.text-brand-muted]="tab !== 'register'">
            Inscription
          </button>
        </div>

        <!-- Boutons sociaux -->
        <div class="space-y-3 mb-6">
          <button (click)="googleLogin()" type="button"
                  class="w-full flex items-center gap-3 bg-brand-surface hover:bg-brand-card
                         border border-brand-border hover:border-brand-yellow/30
                         text-brand-light text-sm font-medium py-3 px-4 rounded-xl
                         transition-all duration-200">
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          <button (click)="appleLogin()" type="button"
                  class="w-full flex items-center gap-3 bg-white hover:bg-gray-100
                         text-gray-900 text-sm font-medium py-3 px-4 rounded-xl
                         transition-all duration-200">
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continuer avec Apple
          </button>
        </div>

        <div class="flex items-center gap-3 mb-6">
          <div class="flex-1 h-px bg-brand-border"></div>
          <span class="text-brand-muted text-xs">ou par email</span>
          <div class="flex-1 h-px bg-brand-border"></div>
        </div>

        <!-- Formulaire login -->
        <form *ngIf="tab === 'login'" [formGroup]="loginForm" (ngSubmit)="login()" class="space-y-4">
          <div>
            <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Email</label>
            <input formControlName="email" type="email" class="input-field" placeholder="vous@email.com">
          </div>
          <div>
            <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Mot de passe</label>
            <input formControlName="password" type="password" class="input-field" placeholder="••••••••">
          </div>
          <p *ngIf="error" class="text-red-400 text-sm">{{ error }}</p>
          <button type="submit" [disabled]="authLoading"
                  class="btn-primary w-full justify-center py-3
                         disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!authLoading">Se connecter</span>
            <span *ngIf="authLoading">Connexion…</span>
          </button>
        </form>

        <!-- Formulaire register -->
        <form *ngIf="tab === 'register'" [formGroup]="registerForm" (ngSubmit)="register()" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Prénom</label>
              <input formControlName="firstName" class="input-field" placeholder="Marie">
            </div>
            <div>
              <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Nom</label>
              <input formControlName="lastName" class="input-field" placeholder="Dupont">
            </div>
          </div>
          <div>
            <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Email</label>
            <input formControlName="email" type="email" class="input-field" placeholder="vous@email.com">
          </div>
          <div>
            <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Mot de passe</label>
            <input formControlName="password" type="password" class="input-field" placeholder="••••••••">
          </div>
          <p *ngIf="error" class="text-red-400 text-sm">{{ error }}</p>
          <button type="submit" [disabled]="authLoading"
                  class="btn-primary w-full justify-center py-3
                         disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!authLoading">Créer mon compte</span>
            <span *ngIf="authLoading">Inscription…</span>
          </button>
        </form>

        <p class="text-center text-brand-muted text-xs mt-6">
          En continuant, vous acceptez nos
          <a routerLink="/mentions-legales" class="text-brand-yellow hover:underline">CGV</a>
          et notre
          <a routerLink="/mentions-legales" class="text-brand-yellow hover:underline">politique de confidentialité</a>.
        </p>
      </div>
    </div>
  `
})
export class AuthComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  tab: 'login' | 'register' = 'login';
  error = '';
  authLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    if (this.loginForm.invalid) return;
    this.authLoading = true;
    this.error = '';
    this.auth.login(this.loginForm.value as { email: string; password: string }).subscribe({
      error: (e) => { this.error = e.message || 'Email ou mot de passe incorrect'; this.authLoading = false; }
    });
  }

  register() {
    if (this.registerForm.invalid) return;
    this.authLoading = true;
    this.error = '';
    this.auth.register(this.registerForm.value as any).subscribe({
      error: (e) => { this.error = e.message || 'Erreur lors de l\'inscription'; this.authLoading = false; }
    });
  }

  googleLogin() { this.auth.loginWithGoogle(); }
  appleLogin() { this.auth.loginWithApple(); }
}
