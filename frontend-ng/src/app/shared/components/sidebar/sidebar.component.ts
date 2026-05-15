import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- Sidebar panel -->
    <aside class="fixed top-0 left-0 h-full w-72 z-40 flex flex-col transition-transform duration-500"
           style="background:rgba(8,8,8,0.97);backdrop-filter:blur(20px);border-right:1px solid rgba(30,30,30,0.8);"
           [class.translate-x-0]="open"
           [class.-translate-x-full]="!open">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5"
           style="border-bottom:1px solid rgba(30,30,30,0.8);">
        <a routerLink="/" (click)="close.emit()" class="select-none">
          <span style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;
                       font-weight:300;letter-spacing:0.22em;font-size:1.25rem;color:#fff;">
            NOIR<span style="color:#C2C85B;">É</span>
          </span>
        </a>
        <button (click)="close.emit()"
                class="p-2 text-brand-muted hover:text-white transition-colors duration-200"
                aria-label="Fermer">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- User info if connected -->
      <div *ngIf="auth.isAuthenticated()" class="px-6 py-4"
           style="border-bottom:1px solid rgba(30,30,30,0.8);">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-brand-accent/12 border border-brand-accent/25
                      flex items-center justify-center text-brand-accent text-sm font-medium">
            {{ (auth.currentUser()?.firstName || auth.currentUser()?.name || 'U').charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-white text-sm font-medium">{{ auth.currentUser()?.firstName || auth.currentUser()?.name }}</p>
            <p class="text-brand-muted text-xs">{{ auth.currentUser()?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 px-4 py-5 space-y-0.5 overflow-y-auto">
        <a *ngFor="let link of navLinks"
           [routerLink]="link.path"
           routerLinkActive="text-white bg-brand-surface"
           [routerLinkActiveOptions]="{exact: link.exact}"
           (click)="close.emit()"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted
                  hover:text-white hover:bg-brand-surface
                  transition-all duration-200 text-sm font-medium group">
          <span class="w-4 h-4 shrink-0 group-[.active]:text-brand-accent"
                [innerHTML]="link.icon"></span>
          <span class="tracking-[0.06em] uppercase text-xs">{{ link.label }}</span>
        </a>

        <!-- Séparateur -->
        <div class="h-px my-3" style="background:rgba(30,30,30,0.8);"></div>

        <!-- Si connecté -->
        <ng-container *ngIf="auth.isAuthenticated()">
          <a routerLink="/profil" (click)="close.emit()"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-muted
                    hover:text-white hover:bg-brand-surface transition-all duration-200 text-sm">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="tracking-[0.06em] uppercase text-xs">Mon Profil</span>
          </a>
          <button (click)="logout()"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/70
                         hover:bg-red-500/8 hover:text-red-400 transition-all duration-200 text-sm text-left">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="tracking-[0.06em] uppercase text-xs">Déconnexion</span>
          </button>
        </ng-container>

        <!-- Si non connecté — bouton connexion MOBILE uniquement -->
        <ng-container *ngIf="!auth.isAuthenticated()">
          <a routerLink="/auth" (click)="close.emit()"
             class="flex items-center justify-center gap-2 w-full mt-3 btn-primary text-xs py-3">
            Connexion
          </a>
        </ng-container>
      </nav>

      <!-- Mini footer -->
      <div class="px-6 py-4" style="border-top:1px solid rgba(30,30,30,0.8);">
        <p class="text-brand-muted text-[10px] text-center tracking-widest uppercase">
          © {{ year }} NOIRÉ — Tous droits réservés
        </p>
        <div class="flex justify-center gap-4 mt-2">
          <a routerLink="/mentions-legales" (click)="close.emit()"
             class="text-brand-muted hover:text-brand-accent text-[10px] transition-colors tracking-wider uppercase">
            Légal
          </a>
          <a routerLink="/contact" (click)="close.emit()"
             class="text-brand-muted hover:text-brand-accent text-[10px] transition-colors tracking-wider uppercase">
            Contact
          </a>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  auth: AuthService = inject(AuthService);
  year = new Date().getFullYear();

  navLinks = [
    {
      path: '/', label: 'Accueil', exact: true,
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
    },
    {
      path: '/produit', label: 'Produit', exact: false,
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
    },
    {
      path: '/panier', label: 'Panier', exact: false,
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
    },
    {
      path: '/a-propos', label: 'À Propos', exact: false,
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    {
      path: '/contact', label: 'Contact', exact: false,
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`
    },
  ];

  logout() {
    this.close.emit();
    this.auth.logout();
  }
}
