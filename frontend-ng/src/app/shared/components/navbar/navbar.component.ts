import { Component, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
            [style.background]="scrolled ? 'rgba(8,8,8,0.92)' : 'transparent'"
            [style.border-bottom]="scrolled ? '1px solid rgba(30,30,30,0.8)' : 'none'"
            [style.backdrop-filter]="scrolled ? 'blur(16px)' : 'none'"
            (window:scroll)="onScroll($event)">

      <nav class="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

        <!-- Logo NOIRÉ -->
        <a routerLink="/" class="group flex items-center gap-0 select-none">
          <span class="font-relicta text-2xl text-white tracking-[0.22em] uppercase
                       group-hover:text-brand-accent transition-colors duration-400"
                style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;font-weight:300;letter-spacing:0.22em;">
            NOIR<span class="text-brand-accent">É</span>
          </span>
        </a>

        <!-- Nav desktop -->
        <div class="hidden lg:flex items-center gap-8">
          <a routerLink="/" routerLinkActive="text-white"
             [routerLinkActiveOptions]="{exact:true}"
             class="text-brand-muted hover:text-white text-xs tracking-[0.18em] uppercase
                    transition-colors duration-200 font-medium">
            Accueil
          </a>
          <a routerLink="/produit" routerLinkActive="text-white"
             class="text-brand-muted hover:text-white text-xs tracking-[0.18em] uppercase
                    transition-colors duration-200 font-medium">
            Produit
          </a>
          <a routerLink="/a-propos" routerLinkActive="text-white"
             class="text-brand-muted hover:text-white text-xs tracking-[0.18em] uppercase
                    transition-colors duration-200 font-medium">
            À Propos
          </a>
          <a routerLink="/contact" routerLinkActive="text-white"
             class="text-brand-muted hover:text-white text-xs tracking-[0.18em] uppercase
                    transition-colors duration-200 font-medium">
            Contact
          </a>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">

          <!-- Panier -->
          <a routerLink="/panier" class="relative p-2 text-brand-muted hover:text-white
                                         transition-colors duration-200 group">
            <svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span *ngIf="cartCount() > 0"
                  class="absolute -top-0.5 -right-0.5 w-[14px] h-[14px] bg-brand-accent rounded-full
                         text-brand-dark text-[9px] font-bold flex items-center justify-center">
              {{ cartCount() }}
            </span>
          </a>

          <!-- Auth — visible UNIQUEMENT desktop lg+ -->
          <ng-container *ngIf="!auth.isAuthenticated(); else userMenu">
            <a routerLink="/auth"
               class="hidden lg:inline-flex btn-secondary text-xs py-2 px-5">
              Connexion
            </a>
          </ng-container>

          <ng-template #userMenu>
            <a routerLink="/profil"
               class="hidden lg:flex items-center gap-2 p-1 rounded-full
                      hover:bg-brand-surface transition-colors duration-200">
              <div class="w-7 h-7 rounded-full bg-brand-accent/15 border border-brand-accent/30
                          flex items-center justify-center text-brand-accent text-xs font-medium">
                {{ (auth.currentUser()?.firstName || auth.currentUser()?.name || 'U').charAt(0).toUpperCase() }}
              </div>
            </a>
          </ng-template>

          <!-- Burger mobile — lg:hidden -->
          <button class="lg:hidden p-2 text-brand-muted hover:text-white transition-colors"
                  (click)="toggleSidebar.emit()" aria-label="Menu">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>
    </header>

    <!-- Spacer -->
    <div class="h-[68px]"></div>
  `
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  auth: AuthService = inject(AuthService);
  cartService: CartService = inject(CartService);
  scrolled = false;

  cartCount = this.cartService.itemCount;

  onScroll(_e: Event) {
    this.scrolled = window.scrollY > 30;
  }
}

