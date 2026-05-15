import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-brand-dark">

      <!-- ─── Panier vide ─── -->
      <ng-container *ngIf="cartService.items().length === 0">
        <section class="min-h-[80vh] flex items-center justify-center px-6">
          <div class="text-center max-w-lg scroll-reveal">
            <div class="relative w-24 h-24 mx-auto mb-10">
              <div class="absolute inset-0 rounded-full border border-brand-accent/20"
                   style="animation:float 4s ease-in-out infinite;"></div>
              <div class="absolute inset-3 rounded-full border border-brand-accent/10"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-8 h-8 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
            <div class="flex items-center justify-center gap-4 mb-8">
              <div class="h-px w-12 bg-brand-accent/40"></div>
              <span class="text-brand-accent text-xs tracking-[0.3em] uppercase">Panier</span>
              <div class="h-px w-12 bg-brand-accent/40"></div>
            </div>
            <h1 class="text-3xl md:text-4xl text-white mb-5"
                style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;font-weight:300;letter-spacing:0.04em;">
              Votre panier attend<br>sa première signature.
            </h1>
            <p class="text-brand-muted text-sm leading-relaxed mb-10 max-w-sm mx-auto">
              Une seule fragrance. Une présence qui se pose et qui reste.
              Il suffit d'un geste pour commencer.
            </p>
            <div class="relative aspect-[16/7] rounded-3xl overflow-hidden mb-10 mx-auto max-w-sm">
              <img src="https://images.unsplash.com/photo-1594913985966-4bb55e7b66e4?w=700&q=80"
                   alt="NOIRÉ Signature"
                   class="w-full h-full object-cover opacity-70 hover:opacity-90 hover:scale-105
                          transition-all duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent"></div>
              <div class="absolute bottom-4 left-0 right-0 text-center">
                <span class="text-white text-sm italic"
                      style="font-family:'Cormorant Garamond',Georgia,serif;">
                  NOIRÉ — Signature · 50 ml
                </span>
              </div>
            </div>
            <a routerLink="/produit" class="btn-primary inline-flex">Découvrir la fragrance</a>
          </div>
        </section>
      </ng-container>

      <!-- ─── Panier plein ─── -->
      <ng-container *ngIf="cartService.items().length > 0">
        <div class="max-w-7xl mx-auto px-6 py-16">
          <div class="flex items-center gap-4 mb-12 scroll-reveal">
            <div class="h-px w-8 bg-brand-accent"></div>
            <h1 class="text-3xl md:text-4xl text-white"
                style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;font-weight:300;">
              Mon panier
            </h1>
            <span class="badge-accent ml-auto text-xs">
              {{ cartService.items().length }} article{{ cartService.items().length > 1 ? 's' : '' }}
            </span>
          </div>

          <div class="grid lg:grid-cols-[1fr_380px] gap-10">

            <!-- Articles -->
            <div class="space-y-4">
              <div *ngFor="let item of cartService.items(); let i = index"
                   class="group flex gap-5 p-5 rounded-2xl border border-brand-border
                          hover:border-brand-border-light transition-all duration-400 scroll-reveal"
                   style="background:rgba(22,22,22,0.5);"
                   [style.animation-delay]="(i * 80) + 'ms'">
                <a routerLink="/produit" class="shrink-0 w-24 h-28 rounded-xl overflow-hidden"
                   style="background:#161616;border:1px solid rgba(30,30,30,0.8);">
                  <img [src]="item.product.mainImage" [alt]="item.product.title"
                       class="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500">
                </a>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <p class="text-brand-muted text-xs tracking-[0.15em] uppercase mb-1">Collection Signature</p>
                      <h3 class="text-white text-base font-medium leading-tight">{{ item.product.title }}</h3>
                    </div>
                    <button (click)="cartService.removeItem(item.product.id)"
                            class="text-brand-muted hover:text-white transition-colors duration-200 shrink-0 mt-0.5"
                            aria-label="Supprimer">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <p class="text-brand-muted text-xs mb-4">Eau de Parfum · 50 ml</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center border rounded-full overflow-hidden"
                         style="border-color:rgba(30,30,30,0.8);">
                      <button (click)="decrement(item.product.id, item.quantity)"
                              class="w-8 h-8 flex items-center justify-center text-brand-muted
                                     hover:text-white hover:bg-brand-surface transition-colors duration-200">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/>
                        </svg>
                      </button>
                      <span class="w-7 text-center text-white text-sm font-medium">{{ item.quantity }}</span>
                      <button (click)="cartService.addItem(item.product)"
                              class="w-8 h-8 flex items-center justify-center text-brand-muted
                                     hover:text-white hover:bg-brand-surface transition-colors duration-200">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                        </svg>
                      </button>
                    </div>
                    <span class="text-white font-medium"
                          style="font-family:'Cormorant Garamond',Georgia,serif;font-size:1.2rem;">
                      {{ (item.product.price * item.quantity) | currency:'EUR':'symbol':'1.0-0' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Récapitulatif commande -->
            <div class="sticky top-24">
              <div class="rounded-3xl p-7 scroll-reveal"
                   style="background:rgba(15,15,15,0.8);border:1px solid rgba(30,30,30,0.8);">
                <div class="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                  <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=700&q=80"
                       alt="NOIRÉ ambiance"
                       class="w-full h-full object-cover opacity-60">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent
                              flex items-end p-4">
                    <p class="text-white text-xs italic leading-relaxed"
                       style="font-family:'Cormorant Garamond',Georgia,serif;">
                      "Une présence. Une signature. Un parfum."
                    </p>
                  </div>
                </div>
                <h2 class="text-white font-medium mb-5 tracking-wide text-sm uppercase">Récapitulatif</h2>
                <div class="space-y-3 mb-5"
                     style="border-bottom:1px solid rgba(30,30,30,0.8);padding-bottom:1.25rem;">
                  <div class="flex justify-between text-sm">
                    <span class="text-brand-muted">Sous-total</span>
                    <span class="text-white">{{ cartService.cart().subtotal | currency:'EUR':'symbol':'1.0-0' }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-brand-muted">Livraison</span>
                    <span class="text-brand-accent text-xs">Offerte</span>
                  </div>
                  <div *ngIf="cartService.cart().discount > 0" class="flex justify-between text-sm">
                    <span class="text-brand-muted">Réduction</span>
                    <span class="text-brand-accent">-{{ cartService.cart().discount | currency:'EUR':'symbol':'1.0-0' }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-baseline mb-6">
                  <span class="text-white font-medium">Total</span>
                  <span class="text-white text-2xl"
                        style="font-family:'Cormorant Garamond',Georgia,serif;">
                    {{ cartService.cart().total | currency:'EUR':'symbol':'1.0-0' }}
                  </span>
                </div>
                <div class="mb-6">
                  <div class="flex gap-2">
                    <input [(ngModel)]="promoInput" placeholder="Code promo"
                           class="input-field flex-1 text-sm py-2.5 px-4"
                           (keyup.enter)="applyPromo()">
                    <button (click)="applyPromo()" class="btn-secondary text-xs py-2.5 px-4 shrink-0">
                      Appliquer
                    </button>
                  </div>
                  <p *ngIf="promoError" class="text-red-400 text-xs mt-1.5">{{ promoError }}</p>
                  <p *ngIf="cartService.cart().discount > 0"
                     class="text-brand-accent text-xs mt-1.5 flex items-center gap-1.5">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Code AURORA10 appliqué (-10%)
                  </p>
                </div>
                <a routerLink="/checkout" class="btn-primary w-full justify-center mb-4 text-sm">
                  Commander — {{ cartService.cart().total | currency:'EUR':'symbol':'1.0-0' }}
                </a>
                <p class="text-center text-brand-muted text-xs flex items-center justify-center gap-1.5">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Paiement 100% sécurisé
                </p>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class CartComponent {
  cartService = inject(CartService);
  promoInput = '';
  promoError = '';

  decrement(productId: string, currentQty: number) {
    if (currentQty <= 1) {
      this.cartService.removeItem(productId);
    } else {
      this.cartService.updateQty(productId, currentQty - 1);
    }
  }

  applyPromo() {
    const result = this.cartService.applyPromo(this.promoInput.trim().toUpperCase());
    if (result) {
      this.promoError = '';
    } else {
      this.promoError = 'Code invalide ou déjà utilisé.';
    }
  }
}
