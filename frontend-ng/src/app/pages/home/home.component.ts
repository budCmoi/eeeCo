import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

/* ── Données de démonstration (fallback si API non disponible) ─────────────── */
const DEMO_PRODUCT: Product = {
  id: 'demo',
  slug: 'noire-signature',
  title: 'NOIRÉ — Signature',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  shortDescription: "Une fragrance unique entre l'ombre et la lumière. Ni douce, ni brutale. Simplement présente.",
  longDescription: `Il y a des parfums qui s'oublient. Et puis il y a NOIRÉ.\n\nConçu pour les esprits qui n'ont pas besoin de parler fort pour être entendus. Noiré s'ouvre sur des notes de bois fumé et d'iris poudré, avant de se révéler dans un cœur de vétiver et d'ambre gris. Le sillage persiste. La mémoire reste.`,
  price: 145,
  compareAtPrice: 190,
  stock: 12,
  mainImage: 'https://images.unsplash.com/photo-1594913985966-4bb55e7b66e4?w=800&q=80',
  images: [
    { id: 'i1', position: 0, src: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6a?w=800&q=80', alt: 'Flacon NOIRÉ — vue face' },
    { id: 'i2', position: 1, src: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80', alt: 'Ambiance sombre' },
    { id: 'i3', position: 2, src: 'https://images.unsplash.com/photo-1587653915936-5bb71a6ee85a?w=800&q=80', alt: 'Détail du flacon' },
    { id: 'i4', position: 3, src: 'https://images.unsplash.com/photo-1600612253971-1c9e0e2b3b4f?w=800&q=80', alt: 'Notes olfactives' },
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
    'Packaging sobre, rechargeable',
  ],
  specifications: {
    'Contenance': '50 ml',
    'Concentration': 'Eau de Parfum — 18%',
    'Famille olfactive': 'Boisé oriental',
    'Notes de tête': 'Bois fumé, poivre noir',
    'Notes de cœur': 'Iris, vétiver',
    'Notes de fond': 'Ambre gris, musc blanc',
    'Flacon': 'Verre noir brossé, rechargeable',
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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- ─── HERO ─────────────────────────────────────────────────────────── -->
    <section class="relative min-h-[95vh] flex items-center overflow-hidden">

      <!-- Image hero background -->
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1600&q=80"
             alt=""
             class="w-full h-full object-cover opacity-15"
             aria-hidden="true">
        <div class="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-brand-dark/60"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">

        <!-- Texte hero -->
        <div>
          <!-- Label discret -->
          <div class="flex items-center gap-3 mb-10 animate-fade-in">
            <div class="h-px w-12 bg-brand-accent"></div>
            <span class="text-brand-accent text-xs tracking-[0.3em] uppercase font-medium">Signature 2026</span>
          </div>

          <!-- Titre principal -->
          <h1 class="animate-fade-up mb-8" style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;font-weight:300;font-size:clamp(2.8rem,6vw,5.5rem);line-height:1.05;letter-spacing:0.02em;">
            <span class="block text-white">Une présence.</span>
            <span class="block text-white">Une signature.</span>
            <span class="block text-gradient-accent animation-delay-200 animate-fade-up">Un parfum.</span>
          </h1>

          <p class="text-brand-muted text-base md:text-lg leading-relaxed mb-10 max-w-md animate-fade-up animation-delay-300">
            {{ product?.shortDescription || 'Une fragrance entre l'ombre et la lumière. Ni douce, ni brutale. Simplement présente.' }}
          </p>

          <!-- Prix -->
          <div class="flex items-baseline gap-4 mb-10 animate-fade-up animation-delay-400" *ngIf="product">
            <span style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;font-size:2.4rem;color:#F0EFE8;font-weight:300;">
              {{ product.price | currency:'EUR':'symbol':'1.0-0' }}
            </span>
            <span *ngIf="product.compareAtPrice" class="text-brand-muted text-xl line-through">
              {{ product.compareAtPrice | currency:'EUR':'symbol':'1.0-0' }}
            </span>
            <span *ngIf="product.compareAtPrice" class="badge-accent text-xs">
              -{{ discount }}%
            </span>
          </div>

          <!-- CTA — UNIQUEMENT "Découvrir", PAS "Ajouter au panier" -->
          <div class="flex flex-wrap gap-4 animate-fade-up animation-delay-500">
            <a routerLink="/produit" class="btn-secondary text-sm px-10 py-3">
              Découvrir
            </a>
          </div>

          <!-- Micro-badges discrets -->
          <div class="flex flex-wrap gap-6 mt-10 text-xs text-brand-muted animate-fade-in animation-delay-700">
            <span class="flex items-center gap-2">
              <span class="w-1 h-1 rounded-full bg-brand-accent inline-block"></span>
              Livraison offerte dès 80€
            </span>
            <span class="flex items-center gap-2">
              <span class="w-1 h-1 rounded-full bg-brand-accent inline-block"></span>
              30 jours pour changer d'avis
            </span>
          </div>
        </div>

        <!-- Image produit hero -->
        <div class="relative flex justify-center items-center animate-fade-in animation-delay-300">
          <div class="relative w-64 h-64 md:w-[400px] md:h-[500px]">
            <!-- Glow derrière -->
            <div class="absolute inset-0 rounded-full blur-3xl animate-glow-pulse"
                 style="background:radial-gradient(ellipse, rgba(194,200,91,0.12) 0%, transparent 70%);"></div>
            <img *ngIf="product"
                 [src]="product.mainImage"
                 [alt]="product.title"
                 class="relative w-full h-full object-contain animate-float drop-shadow-2xl
                        hover:scale-[1.03] transition-transform duration-700 cursor-pointer"
                 routerLink="/produit">
            <!-- Skeleton -->
            <div *ngIf="!product && loading"
                 class="w-full h-full rounded-3xl animate-pulse"
                 style="background:rgba(22,22,22,0.6);"></div>
          </div>

          <!-- Badge flottant stock -->
          <div *ngIf="product && product.stock && product.stock < 20"
               class="absolute top-6 right-6 glass px-3 py-2 text-xs animate-fade-in animation-delay-700">
            <span class="text-brand-accent">● </span>
            <span class="text-brand-muted">{{ product.stock }} flacons restants</span>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                  text-brand-muted animate-float">
        <span class="text-[10px] tracking-[0.3em] uppercase">Défiler</span>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>

    <!-- ─── LIGNE CHIFFRES ─────────────────────────────────────────────── -->
    <section class="py-14" style="border-top:1px solid rgba(30,30,30,0.8);border-bottom:1px solid rgba(30,30,30,0.8);">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div *ngFor="let stat of stats" class="text-center scroll-reveal">
            <div class="mb-1" style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;font-size:2rem;color:#C2C85B;font-weight:300;">
              {{ stat.value }}
            </div>
            <div class="text-brand-muted text-xs tracking-wider uppercase">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── GALERIE LIFESTYLE ─────────────────────────────────────────── -->
    <section class="py-24 max-w-7xl mx-auto px-6">
      <div class="text-center mb-16 scroll-reveal">
        <div class="flex items-center justify-center gap-4 mb-4">
          <div class="h-px flex-1 max-w-12" style="background:rgba(194,200,91,0.3);"></div>
          <span class="text-brand-accent text-xs tracking-[0.3em] uppercase">L'univers NOIRÉ</span>
          <div class="h-px flex-1 max-w-12" style="background:rgba(194,200,91,0.3);"></div>
        </div>
        <h2 class="section-title">Dans les moindres détails</h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div *ngFor="let img of galleryImages; let i = index"
             class="group relative overflow-hidden rounded-2xl scroll-reveal"
             [style.animation-delay]="(i * 120) + 'ms'"
             [style.aspect-ratio]="i === 0 ? '3/5' : '3/4'">
          <img [src]="img.src" [alt]="img.alt"
               class="w-full h-full object-cover transition-transform duration-700
                      group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
        </div>
      </div>
    </section>

    <!-- ─── SECTION PRODUIT CENTRAL ──────────────────────────────────── -->
    <section class="py-24" style="background:#0F0F0F;">
      <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

        <!-- Texte côté gauche -->
        <div class="scroll-reveal">
          <div class="flex items-center gap-3 mb-8">
            <div class="h-px w-8 bg-brand-accent"></div>
            <span class="text-brand-accent text-xs tracking-[0.25em] uppercase">Le parfum</span>
          </div>
          <h2 class="section-title mb-6">
            L'élégance n'a pas<br>besoin de parler fort.
          </h2>
          <p class="text-brand-muted text-base leading-relaxed mb-6">
            NOIRÉ n'est pas un parfum comme les autres. C'est une présence. Une empreinte.
            Fabriqué avec des matières premières d'exception, il s'ouvre sur des notes boisées
            profondes avant de se révéler dans un sillage ambré, persistant, discret mais inoubliable.
          </p>
          <p class="text-brand-muted text-base leading-relaxed mb-10">
            Un seul parfum. Parce que la clarté est une forme de luxe.
          </p>
          <a routerLink="/produit" class="btn-secondary">Voir le produit</a>
        </div>

        <!-- Notes olfactives côté droit -->
        <div class="scroll-reveal animation-delay-200">
          <div class="space-y-6">
            <div *ngFor="let note of olfactoryNotes; let i = index"
                 class="flex items-start gap-5 group">
              <div class="w-12 h-12 rounded-full border border-brand-border/60
                          flex items-center justify-center shrink-0 text-lg
                          group-hover:border-brand-accent/40 transition-colors duration-400">
                {{ note.icon }}
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-white text-sm font-medium tracking-wide">{{ note.label }}</span>
                  <span class="text-brand-muted text-xs">{{ note.notes }}</span>
                </div>
                <div class="h-px w-full" style="background:rgba(30,30,30,0.8);">
                  <div class="h-px bg-gradient-to-r from-brand-accent to-transparent transition-all duration-700"
                       [style.width.%]="note.intensity"
                       [style.animation-delay]="(i * 200) + 'ms'"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURES ──────────────────────────────────────────────────── -->
    <section class="py-24 max-w-7xl mx-auto px-6" *ngIf="product?.features?.length">
      <div class="text-center mb-16 scroll-reveal">
        <h2 class="section-title mb-4">Ce qui fait la différence</h2>
        <p class="section-subtitle max-w-xl mx-auto">
          NOIRÉ est pensé dans ses moindres détails — de la formulation au flacon.
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let feat of product?.features; let i = index"
             class="group px-6 py-5 rounded-2xl border border-brand-border scroll-reveal
                    hover:border-brand-accent/30 transition-all duration-400"
             style="background:rgba(22,22,22,0.5);"
             [style.animation-delay]="(i * 80) + 'ms'">
          <div class="w-8 h-8 rounded-full border border-brand-accent/25
                      flex items-center justify-center mb-4 group-hover:border-brand-accent/60
                      transition-colors duration-400">
            <svg class="w-3.5 h-3.5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p class="text-brand-light text-sm font-medium leading-relaxed">{{ feat }}</p>
        </div>
      </div>
    </section>

    <!-- ─── AVIS ───────────────────────────────────────────────────────── -->
    <section class="py-24" style="background:#0F0F0F;">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16 scroll-reveal">
          <div class="flex items-center justify-center gap-1 mb-4">
            <span *ngFor="let s of [1,2,3,4,5]"
                  class="text-brand-accent text-xl">★</span>
          </div>
          <h2 class="section-title mb-3">Ce qu'ils disent</h2>
          <p class="text-brand-muted text-sm">{{ product?.reviews?.length || 4 }} avis vérifiés</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div *ngFor="let review of (product?.reviews || []); let i = index"
               class="p-6 rounded-2xl border border-brand-border scroll-reveal
                      hover:border-brand-border-light transition-all duration-400"
               style="background:rgba(22,22,22,0.4);"
               [style.animation-delay]="(i * 100) + 'ms'">
            <div class="flex items-center gap-3 mb-4">
              <img [src]="review.avatar || 'https://i.pravatar.cc/40?img=' + (i+1)"
                   [alt]="review.author"
                   class="w-9 h-9 rounded-full object-cover">
              <div>
                <p class="text-white text-sm font-medium">{{ review.author }}</p>
                <div class="flex gap-0.5 text-brand-accent text-xs mt-0.5">
                  <span *ngFor="let s of getStars(review.rating)">★</span>
                </div>
              </div>
            </div>
            <p class="text-brand-muted text-sm leading-relaxed italic">"{{ review.comment }}"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA FINAL ─────────────────────────────────────────────────── -->
    <section class="py-32 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6a?w=1400&q=80"
             alt="" class="w-full h-full object-cover opacity-8" aria-hidden="true">
        <div class="absolute inset-0 bg-brand-dark/90"></div>
      </div>
      <div class="relative z-10 max-w-2xl mx-auto px-6 text-center scroll-reveal">
        <div class="flex items-center justify-center gap-4 mb-8">
          <div class="h-px w-12 bg-brand-accent/40"></div>
          <span class="text-brand-accent text-xs tracking-[0.3em] uppercase">L'essentiel</span>
          <div class="h-px w-12 bg-brand-accent/40"></div>
        </div>
        <h2 class="section-title mb-6">{{ product?.marketingText || "L'élégance n'a pas besoin de parler fort." }}</h2>
        <p class="section-subtitle mb-12">
          Découvrez NOIRÉ dans ses moindres détails. Le flacon, la fragrance, l'expérience.
        </p>
        <a routerLink="/produit" class="btn-secondary text-sm px-12 py-3">
          Voir le produit
        </a>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: Product | null = null;
  loading = true;

  stats = [
    { value: '4.9★', label: 'Note moyenne' },
    { value: '+2 400', label: 'Clients satisfaits' },
    { value: '12h', label: 'Tenue garantie' },
    { value: '100%', label: 'Satisfaction' },
  ];

  galleryImages = [
    { src: 'https://images.unsplash.com/photo-1594913985966-4bb55e7b66e4?w=700&q=80', alt: 'Flacon NOIRÉ' },
    { src: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', alt: 'Ambiance luxe' },
    { src: 'https://images.unsplash.com/photo-1587653915936-5bb71a6ee85a?w=600&q=80', alt: 'Détail parfum' },
    { src: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6a?w=600&q=80', alt: 'Lifestyle parfum' },
    { src: 'https://images.unsplash.com/photo-1547005327-b56b06bf4040?w=600&q=80', alt: 'Ambiance sombre' },
  ];

  olfactoryNotes = [
    { icon: '🌑', label: 'Notes de tête', notes: 'Bois fumé · Poivre noir', intensity: 60 },
    { icon: '🌿', label: 'Notes de cœur', notes: 'Iris · Vétiver', intensity: 80 },
    { icon: '✦', label: 'Notes de fond', notes: 'Ambre gris · Musc blanc', intensity: 95 },
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

  getStars(rating: number): number[] {
    return Array(Math.min(rating, 5)).fill(0);
  }
}

