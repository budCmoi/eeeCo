import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { Order } from '../../core/models/user.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-brand-dark py-12">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">

        <!-- Header profil -->
        <div class="flex items-center gap-4 mb-10">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-yellow to-brand-orange
                      flex items-center justify-center text-brand-dark font-relicta text-2xl font-bold">
            {{ auth.currentUser()?.name?.charAt(0) | uppercase }}
          </div>
          <div>
            <h1 class="font-relicta text-3xl text-brand-light">{{ auth.currentUser()?.name }}</h1>
            <p class="text-brand-muted">{{ auth.currentUser()?.email }}</p>
          </div>
          <button (click)="auth.logout()" class="ml-auto btn-ghost text-sm text-red-400 hover:text-red-300">
            Déconnexion
          </button>
        </div>

        <!-- Onglets -->
        <div class="flex flex-wrap gap-1 bg-brand-surface rounded-2xl p-1 mb-8">
          <button *ngFor="let t of tabs" (click)="activeTab = t.id"
                  class="py-2 px-5 rounded-xl text-sm font-medium transition-all duration-200"
                  [class.bg-brand-card]="activeTab === t.id"
                  [class.text-brand-light]="activeTab === t.id"
                  [class.text-brand-muted]="activeTab !== t.id">
            {{ t.label }}
          </button>
        </div>

        <!-- ─── COMMANDES ─── -->
        <div *ngIf="activeTab === 'orders'">
          <div *ngIf="orders.length === 0 && !ordersLoading" class="text-center py-16">
            <div class="text-5xl mb-4">📦</div>
            <p class="text-brand-muted">Aucune commande pour l'instant.</p>
            <a routerLink="/produit" class="btn-primary mt-6 inline-flex">Découvrir le produit</a>
          </div>
          <div class="space-y-4">
            <div *ngFor="let order of orders" class="card-glass p-5">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-brand-yellow font-mono font-semibold text-sm">#{{ order.id }}</span>
                  <p class="text-brand-muted text-xs mt-0.5">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
                <span class="badge-yellow">{{ order.status }}</span>
                <span class="font-relicta text-xl text-brand-yellow">
                  {{ order.total | currency:'EUR':'symbol':'1.2-2' }}
                </span>
              </div>
              <div class="divider !my-3"></div>
              <div class="flex gap-3 flex-wrap">
                <div *ngFor="let item of order.items" class="flex items-center gap-2">
                  <p class="text-brand-light text-sm">{{ item.product?.title || 'Article' }}</p>
                  <span class="text-brand-muted text-xs">x{{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── PROFIL ─── -->
        <div *ngIf="activeTab === 'profile'" class="card-glass p-6 max-w-lg">
          <h2 class="text-brand-light font-semibold text-lg mb-5">Informations personnelles</h2>
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Prénom</label>
                <input formControlName="firstName" class="input-field">
              </div>
              <div>
                <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Nom</label>
                <input formControlName="lastName" class="input-field">
              </div>
            </div>
            <div>
              <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Email</label>
              <input formControlName="email" type="email" class="input-field">
            </div>
            <button type="submit" class="btn-primary">Sauvegarder</button>
            <p *ngIf="profileSaved" class="text-green-400 text-sm">✓ Profil mis à jour</p>
          </form>
        </div>

        <!-- ─── ADMIN CMS ─── (si owner du produit ou admin) -->
        <div *ngIf="activeTab === 'cms' && auth.isAdmin()">
          <h2 class="text-brand-light font-semibold text-xl mb-6">Gestion du produit</h2>
          <div *ngIf="!product && !productLoading" class="text-center py-12">
            <p class="text-brand-muted mb-4">Aucun produit actif.</p>
          </div>
          <div *ngIf="product" class="card-glass p-6">
            <div class="flex items-center gap-4 mb-6">
              <img [src]="product.mainImage" [alt]="product.title"
                   class="w-20 h-20 rounded-xl object-contain bg-brand-card">
              <div>
                <h3 class="text-brand-light text-lg font-semibold">{{ product.title }}</h3>
                <span class="badge-yellow text-xs">{{ product.status }}</span>
              </div>
              <div class="ml-auto text-right">
                <p class="font-relicta text-2xl text-brand-yellow">{{ product.price | currency:'EUR' }}</p>
              </div>
            </div>

            <form [formGroup]="cmsForm" (ngSubmit)="saveProduct()" class="space-y-4">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Titre</label>
                  <input formControlName="title" class="input-field">
                </div>
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Prix (€)</label>
                  <input formControlName="price" type="number" step="0.01" class="input-field">
                </div>
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Prix barré (€)</label>
                  <input formControlName="compareAtPrice" type="number" step="0.01" class="input-field">
                </div>
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Statut</label>
                  <select formControlName="status" class="input-field">
                    <option value="active">Actif</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Description courte</label>
                <textarea formControlName="shortDescription" rows="2" class="input-field resize-none"></textarea>
              </div>
              <div>
                <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Description longue</label>
                <textarea formControlName="longDescription" rows="4" class="input-field resize-none"></textarea>
              </div>
              <div>
                <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Texte marketing</label>
                <input formControlName="marketingText" class="input-field">
              </div>
              <button type="submit" class="btn-primary">
                Sauvegarder les modifications
              </button>
              <p *ngIf="cmsSaved" class="text-green-400 text-sm">✓ Produit mis à jour</p>
            </form>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  private profileService = inject(ProfileService);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  activeTab = 'orders';
  orders: Order[] = [];
  ordersLoading = false;
  product: Product | null = null;
  productLoading = false;
  profileSaved = false;
  cmsSaved = false;

  tabs = [
    { id: 'orders', label: 'Mes commandes' },
    { id: 'profile', label: 'Mon profil' },
    ...(this.auth.isAdmin() ? [{ id: 'cms', label: '⚙️ Gestion produit' }] : []),
  ];

  profileForm = this.fb.group({
    firstName: [this.auth.currentUser()?.firstName || ''],
    lastName: [this.auth.currentUser()?.lastName || ''],
    email: [this.auth.currentUser()?.email || ''],
  });

  cmsForm = this.fb.group({
    title: [''],
    price: [0],
    compareAtPrice: [null as number | null],
    status: ['active'],
    shortDescription: [''],
    longDescription: [''],
    marketingText: [''],
  });

  ngOnInit() {
    this.loadOrders();
    if (this.auth.isAdmin()) this.loadProduct();
  }

  loadOrders() {
    this.ordersLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (o) => { this.orders = o; this.ordersLoading = false; },
      error: () => { this.ordersLoading = false; }
    });
  }

  loadProduct() {
    this.productLoading = true;
    this.productService.getActive().subscribe({
      next: (p) => {
        this.product = p;
        this.cmsForm.patchValue({
          title: p.title,
          price: p.price,
          compareAtPrice: p.compareAtPrice || null,
          status: p.status,
          shortDescription: p.shortDescription,
          longDescription: p.longDescription,
          marketingText: p.marketingText,
        });
        this.productLoading = false;
      },
      error: () => { this.productLoading = false; }
    });
  }

  saveProfile() {
    this.profileService.updateProfile(this.profileForm.value as any).subscribe({
      next: () => { this.profileSaved = true; setTimeout(() => this.profileSaved = false, 3000); },
      error: () => {}
    });
  }

  saveProduct() {
    if (!this.product) return;
    this.productService.update(this.product.id, this.cmsForm.value as any).subscribe({
      next: () => { this.cmsSaved = true; setTimeout(() => this.cmsSaved = false, 3000); },
      error: () => {}
    });
  }
}
