import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-brand-dark py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">

        <h1 class="font-relicta text-3xl text-brand-light mb-2">Finaliser la commande</h1>
        <p class="text-brand-muted mb-10">Commande démo — Aucun vrai paiement effectué</p>

        <div class="grid lg:grid-cols-3 gap-8">

          <!-- Formulaire -->
          <form [formGroup]="form" (ngSubmit)="submit()" class="lg:col-span-2 space-y-8">

            <!-- Livraison -->
            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-5 flex items-center gap-2">
                <span class="w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark text-xs font-bold">1</span>
                Adresse de livraison
              </h2>
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Prénom</label>
                  <input formControlName="firstName" class="input-field" placeholder="Marie">
                  <p *ngIf="f['firstName'].invalid && f['firstName'].touched"
                     class="text-red-400 text-xs mt-1">Requis</p>
                </div>
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Nom</label>
                  <input formControlName="lastName" class="input-field" placeholder="Dupont">
                  <p *ngIf="f['lastName'].invalid && f['lastName'].touched"
                     class="text-red-400 text-xs mt-1">Requis</p>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Adresse</label>
                  <input formControlName="address" class="input-field" placeholder="12 rue de la Paix">
                  <p *ngIf="f['address'].invalid && f['address'].touched"
                     class="text-red-400 text-xs mt-1">Requis</p>
                </div>
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Code postal</label>
                  <input formControlName="postalCode" class="input-field" placeholder="75001">
                </div>
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Ville</label>
                  <input formControlName="city" class="input-field" placeholder="Paris">
                </div>
              </div>
            </div>

            <!-- Paiement -->
            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-5 flex items-center gap-2">
                <span class="w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark text-xs font-bold">2</span>
                Méthode de paiement (démo)
              </h2>

              <div class="space-y-3">
                <button type="button"
                        *ngFor="let method of paymentMethods"
                        (click)="selectedPayment = method.id"
                        class="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200"
                        [ngClass]="selectedPayment === method.id
                          ? 'border-brand-yellow bg-yellow-900/10'
                          : 'border-brand-border'">
                  <span class="text-2xl">{{ method.icon }}</span>
                  <div class="text-left">
                    <p class="text-brand-light font-medium text-sm">{{ method.name }}</p>
                    <p class="text-brand-muted text-xs">{{ method.description }}</p>
                  </div>
                  <div *ngIf="selectedPayment === method.id"
                       class="ml-auto w-5 h-5 bg-brand-yellow rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                </button>
              </div>

              <!-- Champs carte démo -->
              <div *ngIf="selectedPayment === 'card'" class="mt-4 space-y-3">
                <input placeholder="Numéro de carte (démo)" class="input-field" value="4242 4242 4242 4242" readonly>
                <div class="grid grid-cols-2 gap-3">
                  <input placeholder="MM/AA" class="input-field" value="12/27" readonly>
                  <input placeholder="CVV" class="input-field" value="123" readonly>
                </div>
                <p class="text-brand-muted text-xs">
                  ℹ️ Mode démo — aucune vraie transaction effectuée
                </p>
              </div>
            </div>

            <!-- Bouton commander -->
            <button type="submit" [disabled]="loading"
                    class="btn-primary w-full text-lg py-4 justify-center
                           disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!loading">Passer la commande — {{ cartService.cart().total | currency:'EUR':'symbol':'1.2-2' }}</span>
              <span *ngIf="loading" class="flex items-center gap-2">
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Traitement en cours…
              </span>
            </button>
          </form>

          <!-- Récapitulatif -->
          <div class="card-glass p-6 h-fit sticky top-24">
            <h2 class="text-brand-light font-semibold text-lg mb-5">Récapitulatif</h2>

            <div class="space-y-3 mb-6">
              <div *ngFor="let item of cartService.items()" class="flex gap-3">
                <img [src]="item.product.mainImage" [alt]="item.product.title"
                     class="w-12 h-12 rounded-lg object-contain bg-brand-card">
                <div class="flex-1 min-w-0">
                  <p class="text-brand-light text-sm font-medium truncate">{{ item.product.title }}</p>
                  <p class="text-brand-muted text-xs">x{{ item.quantity }}</p>
                </div>
                <p class="text-brand-yellow text-sm font-semibold shrink-0">
                  {{ (item.product.price * item.quantity) | currency:'EUR':'symbol':'1.2-2' }}
                </p>
              </div>
            </div>

            <div class="divider !my-3"></div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-brand-muted">Sous-total</span>
                <span class="text-brand-light">{{ cartService.cart().subtotal | currency:'EUR':'symbol':'1.2-2' }}</span>
              </div>
              <div *ngIf="cartService.cart().discount > 0" class="flex justify-between">
                <span class="text-green-400">Réduction</span>
                <span class="text-green-400">-{{ cartService.cart().discount | currency:'EUR':'symbol':'1.2-2' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-muted">Livraison</span>
                <span [class.text-green-400]="cartService.cart().shipping === 0" class="text-brand-light">
                  {{ cartService.cart().shipping === 0 ? 'Offerte' : (cartService.cart().shipping | currency:'EUR':'symbol':'1.2-2') }}
                </span>
              </div>
              <div class="divider !my-2"></div>
              <div class="flex justify-between">
                <span class="text-brand-light font-semibold">Total</span>
                <span class="font-relicta text-xl text-brand-yellow">
                  {{ cartService.cart().total | currency:'EUR':'symbol':'1.2-2' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loading = false;
  selectedPayment = 'card';

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    postalCode: [''],
    city: [''],
  });

  get f() { return this.form.controls; }

  paymentMethods = [
    { id: 'card', name: 'Carte bancaire', icon: '💳', description: 'Visa, Mastercard, CB' },
    { id: 'apple_pay', name: 'Apple Pay', icon: '🍎', description: 'Paiement rapide avec Face ID' },
    { id: 'google_pay', name: 'Google Pay', icon: '🌐', description: 'Paiement rapide avec Google' },
  ];

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const items = this.cartService.items().map(i => ({
      productId: i.product.id,
      quantity: i.quantity,
      price: i.product.price,
    }));

    const shippingAddress = `${this.f['address'].value}, ${this.f['postalCode'].value} ${this.f['city'].value}`;

    this.orderService.createDemo({
      items,
      shippingAddress,
      paymentMethod: this.selectedPayment,
      promoCode: this.cartService.getPromoCode() || undefined,
    }).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.router.navigate(['/confirmation'], { queryParams: { orderId: order.id } });
      },
      error: () => {
        this.loading = false;
        // Pour la démo, on simule un succès
        this.cartService.clearCart();
        this.router.navigate(['/confirmation'], { queryParams: { orderId: 'demo-' + Date.now() } });
      }
    });
  }
}
