import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product, ProductImage } from '../../core/models/product.model';

/* ── Données de démonstration ─────────────────────────────────────────────── */
const DEMO_PRODUCT: Product = {
  id: 'demo',
  slug: 'noire-signature',
  title: 'NOIRÉ — Signature',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  shortDescription: "Une fragrance entre l'ombre et la lumière. Ni douce, ni brutale. Simplement présente.",
  longDescription: "Il y a des parfums que l'on oublie dès que l'on sort. Et puis il y a NOIRÉ.\n\nConçu pour les esprits qui n'ont pas besoin de parler fort pour être entendus, NOIRÉ s'ouvre sur des notes de bois fumé et de poivre noir. Une ouverture directe, caractérielle. Le cœur révèle ensuite un iris poudré d'une délicatesse rare, mêlé à un vétiver terreux et profond.\n\nEn fond, l'ambre gris et le musc blanc posent une base enveloppante qui persiste des heures après. Un seul parfum. Parce que l'essentiel n'a pas besoin d'être multiple pour être complet.",
  price: 145,
  compareAtPrice: 190,
  stock: 12,
  mainImage: 'https://images.unsplash.com/photo-1594913985966-4bb55e7b66e4?w=900&q=85',
  images: [
    { id: 'i1', position: 0, src: 'https://images.unsplash.com/photo-1594913985966-4bb55e7b66e4?w=900&q=85', alt: 'Flacon NOIRÉ face' },
    { id: 'i2', position: 1, src: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6a?w=900&q=85', alt: 'Lifestyle parfum' },
    { id: 'i3', position: 2, src: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=900&q=85', alt: 'Ambiance sombre' },
    { id: 'i4', position: 3, src: 'https://images.unsplash.com/photo-1587653915936-5bb71a6ee85a?w=900&q=85', alt: 'Détail goulot' },
    { id: 'i5', position: 4, src: 'https://images.unsplash.com/photo-1547005327-b56b06bf4040?w=900&q=85', alt: 'Ambiance luxe' },
  ],
  features: [
    'Bois fumé & iris poudré en ouverture',
    'Cœur de vétiver et ambre gris',
    'Tenue 10–12 heures garantie',
    'Flacon en verre noir brossé',
    'Sans alcool dénaturé',
    'Formulation clean & traçable',
  ],
  benefits: [
    "Un sillage durable qui ne s'impose jamais",
    'Une formulation douce pour les peaux sensibles',
    'Packaging sobre, rechargeable sur demande',
  ],
  specifications: {
    'Contenance': '50 ml',
    'Concentration': 'Eau de Parfum — 18%',
    'Famille olfactive': 'Boisé oriental',
    'Notes de tête': 'Bois fumé, poivre noir',
    'Notes de cœur': 'Iris, vétiver',
    'Notes de fond': 'Ambre gris, musc blanc',
    'Flacon': 'Verre noir brossé, rechargeable',
    'Disponibilité': 'Stock limité',
  },
  marketingText: "L'élégance n'a pas besoin de parler fort. NOIRÉ est là pour ceux qui savent.",
  status: 'active',
  isActive: true,
  reviews: [
    { id: '1', author: 'Camille R.', rating: 5, comment: "Un parfum qui ne ressemble à rien d'autre. Tient toute la journée sans jamais devenir envahissant.", avatar: 'https://i.pravatar.cc/48?img=47', isDemo: true, createdAt: '2024-01-01' },
    { id: '2', author: 'Antoine M.', rating: 5, comment: "Je ne pensais pas qu'un seul parfum pouvait me suffire pour toute une année. C'est fait.", avatar: 'https://i.pravatar.cc/48?img=11', isDemo: true, createdAt: '2024-01-01' },
    { id: '3', author: 'Léa D.', rating: 5, comment: 'Sobre, intense, mémorable. Le flacon est une œuvre à lui seul.', avatar: 'https://i.pravatar.cc/48?img=32', isDemo: true, createdAt: '2024-01-01' },
    { id: '4', author: 'Samir B.', rating: 5, comment: 'Exactement ce que je cherchais : ni sucré, ni banal. Un parfum adulte.', avatar: 'https://i.pravatar.cc/48?img=60', isDemo: true, createdAt: '2024-01-01' },
  ],
};

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-dark">

      <!-- Loading skeleton -->
      <div *ngIf="loading" class="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">
        <div class="aspect-[4/5] rounded-3xl animate-pulse" style="background:#161616;"></div>
        <div class="space-y-5 pt-4">
          <div class="h-4 rounded-xl animate-pulse w-1/4" style="background:#161616;"></div>
          <div class="h-14 rounded-xl animate-pulse w-3/4" style="background:#161616;"></div>
          <div class="h-20 rounded-xl animate-pulse" style="background:#161616;"></div>
        </div>
      </div>

      <ng-container *ngIf="product && !loading">

        <!-- ─── Hero produit ─── -->
        <section class="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          <!-- Galerie images sticky -->
          <div class="sticky top-24">
            <div class="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 group"
                 style="background:#0F0F0F;border:1px solid rgba(30,30,30,0.8);">
              <div class="absolute inset-0" style="background:radial-gradient(ellipse at center, rgba(194,200,91,0.06) 0%, transparent 60%);"></div>
              <img [src]="activeImage?.src || product.mainImage"
                   [alt]="activeImage?.alt || product.title"
                   class="relative w-full h-full object-contain p-8 lg:p-12
                          transition-all duration-700 group-hover:scale-[1.03]">
            </div>
            <div class="grid grid-cols-5 gap-2" *ngIf="product.images?.length">
              <button (click)="setImage(null)"
                      class="aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300"
                      [style.border-color]="!activeImage ? '#C2C85B' : 'rgba(30,30,30,0.8)'">
                <img [src]="product.mainImage" [alt]="product.title" class="w-full h-full object-cover">
              </button>
              <button *ngFor="let img of product.images.slice(0,4)"
                      (click)="setImage(img)"
                      class="aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300"
                      [style.border-color]="activeImage === img ? '#C2C85B' : 'rgba(30,30,30,0.8)'">
                <img [src]="img.src" [alt]="img.alt || product.title"
                     class="w-full h-full object-cover hover:scale-110 transition-transform duration-400">
              </button>
            </div>
          </div>

          <!-- Infos produit -->
          <div class="animate-fade-up">
            <div class="flex items-center gap-3 mb-6">
              <div class="h-px w-8 bg-brand-accent"></div>
              <span class="text-brand-accent text-xs tracking-[0.25em] uppercase">Collection Signature</span>
            </div>
            <h1 class="text-4xl md:text-5xl text-white mb-5"
                style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;font-weight:300;letter-spacing:0.04em;">
              {{ product.title }}
            </h1>
            <p class="text-brand-muted text-base leading-relaxed mb-7">{{ product.shortDescription }}</p>
            <div class="flex items-center gap-3 mb-7" *ngIf="product.reviews?.length">
              <div class="flex gap-0.5 text-brand-accent">
                <span *ngFor="let s of [1,2,3,4,5]" class="text-sm">★</span>
              </div>
              <span class="text-white text-sm font-medium">5.0</span>
              <span class="text-brand-muted text-sm">— {{ product.reviews.length }} avis</span>
            </div>
            <div class="flex items-baseline gap-4 mb-8">
              <span style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;font-size:2.8rem;color:#F0EFE8;font-weight:300;line-height:1;">
                {{ product.price | currency:'EUR':'symbol':'1.0-0' }}
              </span>
              <span *ngIf="product.compareAtPrice" class="text-brand-muted text-xl line-through">
                {{ product.compareAtPrice | currency:'EUR':'symbol':'1.0-0' }}
              </span>
              <span *ngIf="discount > 0" class="badge-accent text-xs">-{{ discount }}%</span>
            </div>

            <!-- Sélecteur quantité + CTA -->
            <div class="flex items-stretch gap-3 mb-6">
              <div class="flex items-center border rounded-full overflow-hidden"
                   style="border-color:rgba(30,30,30,0.8);">
                <button (click)="qty > 1 ? (qty = qty - 1) : qty"
                        class="w-11 h-11 flex items-center justify-center text-brand-muted
                               hover:text-white transition-colors duration-200 hover:bg-brand-surface">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/>
                  </svg>
                </button>
                <span class="w-8 text-center text-white text-sm font-medium">{{ qty }}</span>
                <button (click)="qty < 10 ? (qty = qty + 1) : qty"
                        class="w-11 h-11 flex items-center justify-center text-brand-muted
                               hover:text-white transition-colors duration-200 hover:bg-brand-surface">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
              <button (click)="addToCart()" class="flex-1 btn-primary text-sm">
                Ajouter au panier
              </button>
            </div>

            <p *ngIf="product.stock && product.stock < 20" class="text-xs text-brand-muted mb-6 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-brand-accent inline-block"></span>
              Plus que {{ product.stock }} flacons disponibles
            </p>

            <!-- Badges livraison -->
            <div class="grid grid-cols-2 gap-2 mb-8">
              <div class="flex items-center gap-3 px-4 py-3 rounded-xl"
                   style="background:rgba(22,22,22,0.5);border:1px solid rgba(30,30,30,0.8);">
                <span class="text-base">🚚</span>
                <p class="text-brand-muted text-xs leading-tight">Livraison offerte<br>dès 80€</p>
              </div>
              <div class="flex items-center gap-3 px-4 py-3 rounded-xl"
                   style="background:rgba(22,22,22,0.5);border:1px solid rgba(30,30,30,0.8);">
                <span class="text-base">🔄</span>
                <p class="text-brand-muted text-xs leading-tight">Retours gratuits<br>30 jours</p>
              </div>
            </div>

            <!-- Accordéon specs -->
            <div style="border-top:1px solid rgba(30,30,30,0.8);">
              <button (click)="showSpecs = !showSpecs"
                      class="w-full flex items-center justify-between py-4 text-left">
                <span class="text-white text-sm font-medium tracking-wide">Composition & détails</span>
                <svg class="w-4 h-4 text-brand-muted transition-transform duration-300"
                     [class.rotate-180]="showSpecs"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div *ngIf="showSpecs" class="pb-5 animate-fade-up">
                <dl class="space-y-2.5">
                  <div *ngFor="let spec of getSpecs()" class="flex gap-4 text-sm"
                       style="border-bottom:1px solid rgba(22,22,22,0.8);padding-bottom:0.6rem;">
                    <dt class="text-brand-muted w-36 shrink-0 text-xs uppercase tracking-wider">{{ spec.key }}</dt>
                    <dd class="text-brand-light text-sm">{{ spec.value }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <!-- ─── Pyramide olfactive ─── -->
        <section class="py-20" style="background:#0F0F0F;">
          <div class="max-w-7xl mx-auto px-6">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
              <div class="scroll-reveal">
                <div class="flex items-center gap-3 mb-8">
                  <div class="h-px w-8 bg-brand-accent"></div>
                  <span class="text-brand-accent text-xs tracking-[0.25em] uppercase">Olfactif</span>
                </div>
                <h2 class="section-title mb-10">La pyramide<br>olfactive</h2>
                <div class="space-y-8">
                  <div *ngFor="let note of olfNotes; let i = index">
                    <div class="flex justify-between items-baseline mb-2.5">
                      <span class="text-white text-sm font-medium">{{ note.label }}</span>
                      <span class="text-brand-muted text-xs">{{ note.notes }}</span>
                    </div>
                    <div class="h-[1px] w-full" style="background:rgba(30,30,30,0.8);">
                      <div class="h-[1px] bg-brand-accent transition-all duration-1000"
                           [style.width]="note.width"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="scroll-reveal animation-delay-200">
                <div class="relative aspect-[3/4] rounded-3xl overflow-hidden" style="background:#161616;">
                  <img src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6a?w=900&q=85"
                       alt="Ambiance NOIRÉ"
                       class="w-full h-full object-cover opacity-75 hover:opacity-100
                              hover:scale-105 transition-all duration-700">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div class="absolute bottom-8 left-8 right-8">
                    <p class="text-white text-base italic font-light leading-relaxed"
                       style="font-family:'Cormorant Garamond',Georgia,serif;">
                      "Un seul parfum peut suffire à définir une présence."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ─── Description & storytelling ─── -->
        <section class="py-20 max-w-7xl mx-auto px-6" *ngIf="product.longDescription">
          <div class="grid lg:grid-cols-2 gap-16">
            <div class="scroll-reveal">
              <div class="flex items-center gap-3 mb-8">
                <div class="h-px w-8 bg-brand-accent"></div>
                <span class="text-brand-accent text-xs tracking-[0.25em] uppercase">L'histoire</span>
              </div>
              <h2 class="section-title mb-7">La fragrance<br>derrière le flacon</h2>
              <div class="space-y-4">
                <p *ngFor="let para of getLongDescParagraphs()"
                   class="text-brand-muted text-sm leading-relaxed">{{ para }}</p>
              </div>
            </div>
            <div *ngIf="product.benefits?.length" class="scroll-reveal animation-delay-200">
              <div class="flex items-center gap-3 mb-8">
                <div class="h-px w-8 bg-brand-accent"></div>
                <span class="text-brand-accent text-xs tracking-[0.25em] uppercase">L'essentiel</span>
              </div>
              <h2 class="section-title mb-7">Ce qui compte</h2>
              <ul class="space-y-5">
                <li *ngFor="let b of product.benefits; let i = index"
                    class="flex items-start gap-4 scroll-reveal"
                    [style.animation-delay]="(i * 100) + 'ms'">
                  <div class="w-6 h-6 rounded-full border border-brand-accent/30
                              flex items-center justify-center shrink-0 mt-0.5">
                    <svg class="w-2.5 h-2.5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span class="text-brand-muted text-sm leading-relaxed">{{ b }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- ─── Galerie ─── -->
        <section class="py-20" style="background:#0F0F0F;">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-14 scroll-reveal">
              <h2 class="section-title">Dans chaque détail</h2>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div *ngFor="let img of product.images || []; let i = index"
                   class="group relative overflow-hidden rounded-2xl cursor-pointer scroll-reveal"
                   [class.aspect-square]="true"
                   [style.animation-delay]="(i * 100) + 'ms'"
                   (click)="setImage(img)">
                <img [src]="img.src" [alt]="img.alt || product.title"
                     class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-400
                            flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-400
                              w-10 h-10 rounded-full border border-white/50 flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ─── Avis clients ─── -->
        <section class="py-20 max-w-7xl mx-auto px-6" *ngIf="product.reviews?.length">
          <div class="text-center mb-14 scroll-reveal">
            <div class="flex items-center justify-center gap-1 mb-4">
              <span *ngFor="let s of [1,2,3,4,5]" class="text-brand-accent text-xl">★</span>
            </div>
            <h2 class="section-title mb-3">Avis clients</h2>
            <p class="text-brand-muted text-sm">{{ product.reviews.length }} avis vérifiés — Note 5.0/5</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div *ngFor="let review of product.reviews; let i = index"
                 class="p-6 rounded-2xl border border-brand-border scroll-reveal
                        hover:border-brand-border-light transition-all duration-400"
                 style="background:rgba(22,22,22,0.4);"
                 [style.animation-delay]="(i * 100) + 'ms'">
              <div class="flex items-center gap-3 mb-4">
                <img [src]="review.avatar || 'https://i.pravatar.cc/40?img=' + (i+1)"
                     [alt]="review.author"
                     class="w-10 h-10 rounded-full object-cover border border-brand-border">
                <div class="flex-1">
                  <p class="text-white text-sm font-medium">{{ review.author }}</p>
                  <div class="flex gap-0.5 text-brand-accent text-xs mt-0.5">
                    <span *ngFor="let s of getStars(review.rating)">★</span>
                  </div>
                </div>
                <span class="text-brand-muted text-xs">Achat vérifié ✓</span>
              </div>
              <p class="text-brand-muted text-sm leading-relaxed italic">"{{ review.comment }}"</p>
            </div>
          </div>
        </section>

        <!-- ─── Livraison/retour/paiement ─── -->
        <section class="py-16" style="background:#0F0F0F;border-top:1px solid rgba(30,30,30,0.8);">
          <div class="max-w-4xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center scroll-reveal">
                <div class="w-12 h-12 rounded-full border border-brand-border mx-auto mb-4
                            flex items-center justify-center">
                  <svg class="w-5 h-5 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <h3 class="text-white text-sm font-medium mb-2">Paiement sécurisé</h3>
                <p class="text-brand-muted text-xs">Carte, Apple Pay, Google Pay</p>
              </div>
              <div class="text-center scroll-reveal animation-delay-100">
                <div class="w-12 h-12 rounded-full border border-brand-border mx-auto mb-4
                            flex items-center justify-center">
                  <svg class="w-5 h-5 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <h3 class="text-white text-sm font-medium mb-2">Livraison offerte</h3>
                <p class="text-brand-muted text-xs">Dès 80€ — suivi inclus</p>
              </div>
              <div class="text-center scroll-reveal animation-delay-200">
                <div class="w-12 h-12 rounded-full border border-brand-border mx-auto mb-4
                            flex items-center justify-center">
                  <svg class="w-5 h-5 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <h3 class="text-white text-sm font-medium mb-2">Retours 30 jours</h3>
                <p class="text-brand-muted text-xs">Remboursement complet garanti</p>
              </div>
            </div>
          </div>
        </section>

      </ng-container>

      <!-- Toast confirmation -->
      <div *ngIf="showToast"
           class="fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl
                  flex items-center gap-3 animate-fade-up shadow-glow"
           style="background:rgba(22,22,22,0.95);border:1px solid rgba(194,200,91,0.25);backdrop-filter:blur(12px);">
        <div class="w-7 h-7 rounded-full bg-brand-accent/15 border border-brand-accent/30
                    flex items-center justify-center">
          <svg class="w-3.5 h-3.5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div>
          <p class="text-white text-sm font-medium">Ajouté au panier</p>
          <p class="text-brand-muted text-xs">{{ qty > 1 ? qty + ' flacons' : '1 flacon' }}</p>
        </div>
        <a routerLink="/panier" class="ml-2 text-brand-accent text-xs hover:underline">Voir →</a>
      </div>
    </div>
  `
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: Product | null = null;
  loading = true;
  showToast = false;
  activeImage: ProductImage | null = null;
  qty = 1;
  showSpecs = false;

  olfNotes = [
    { label: 'Notes de tête', notes: 'Bois fumé · Poivre noir', width: '55%' },
    { label: 'Notes de cœur', notes: 'Iris · Vétiver', width: '78%' },
    { label: 'Notes de fond', notes: 'Ambre gris · Musc blanc', width: '95%' },
  ];

  get discount(): number {
    if (!this.product?.compareAtPrice || !this.product.price) return 0;
    return Math.round((1 - this.product.price / this.product.compareAtPrice) * 100);
  }

  ngOnInit() {
    this.productService.getActive().subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => { this.product = DEMO_PRODUCT; this.loading = false; }
    });
  }

  setImage(img: ProductImage | null) {
    this.activeImage = img;
  }

  addToCart() {
    if (!this.product) return;
    for (let i = 0; i < this.qty; i++) {
      this.cartService.addItem(this.product);
    }
    this.showToast = true;
    setTimeout(() => { this.showToast = false; this.qty = 1; }, 2800);
  }

  getSpecs(): { key: string; value: string }[] {
    if (!this.product?.specifications) return [];
    return Object.entries(this.product.specifications).map(([key, value]) => ({ key, value: String(value) }));
  }

  getStars(rating: number): number[] {
    return Array(Math.min(5, Math.max(0, rating))).fill(0);
  }

  getLongDescParagraphs(): string[] {
    if (!this.product?.longDescription) return [];
    return this.product.longDescription.split('\n\n').filter(p => p.trim().length > 0);
  }
}
