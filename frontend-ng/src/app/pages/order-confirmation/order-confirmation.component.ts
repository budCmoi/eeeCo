import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-dark flex items-center justify-center py-20 px-4">
      <div class="max-w-lg w-full text-center animate-fade-up">

        <!-- Icône succès -->
        <div class="relative w-28 h-28 mx-auto mb-8">
          <div class="absolute inset-0 bg-brand-yellow/20 rounded-full animate-glow-pulse"></div>
          <div class="relative w-full h-full bg-brand-surface border-2 border-brand-yellow rounded-full
                      flex items-center justify-center">
            <svg class="w-12 h-12 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>

        <div class="badge-green mx-auto mb-4 w-fit">Commande confirmée</div>
        <h1 class="font-relicta text-4xl md:text-5xl text-brand-light mb-4">
          Merci pour votre commande !
        </h1>
        <p class="text-brand-muted text-lg mb-2">
          Votre Aurora Essence est en cours de préparation.
        </p>
        <p *ngIf="orderId" class="text-brand-muted text-sm mb-8">
          Référence : <span class="text-brand-yellow font-mono font-semibold">#{{ orderId }}</span>
        </p>

        <!-- Steps de livraison -->
        <div class="card-glass p-6 mb-8 text-left">
          <h3 class="text-brand-light font-semibold mb-4">Suivi de commande</h3>
          <div class="space-y-4">
            <div *ngFor="let step of steps; let i = index"
                 class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                   [class.bg-brand-yellow]="i === 0"
                   [class.text-brand-dark]="i === 0"
                   [class.bg-brand-surface]="i > 0"
                   [class.text-brand-muted]="i > 0"
                   [class.border]="i > 0"
                   [class.border-brand-border]="i > 0">
                {{ i === 0 ? '✓' : (i + 1) }}
              </div>
              <div>
                <p class="text-sm font-medium"
                   [class.text-brand-yellow]="i === 0"
                   [class.text-brand-muted]="i > 0">{{ step.title }}</p>
                <p class="text-xs text-brand-muted">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mode démo info -->
        <div class="bg-brand-yellow/5 border border-brand-yellow/20 rounded-2xl p-4 mb-8 text-sm">
          <p class="text-brand-yellow font-medium mb-1">🎭 Mode Démonstration</p>
          <p class="text-brand-muted">
            Aucun vrai paiement n'a été effectué. Cette commande est simulée à des fins de démonstration.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a routerLink="/profil" class="btn-secondary">
            Voir mes commandes
          </a>
          <a routerLink="/" class="btn-primary">
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  `
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  orderId: string | null = null;

  steps = [
    { title: 'Commande confirmée', desc: 'Nous avons bien reçu votre commande' },
    { title: 'En préparation', desc: 'Votre parfum est en cours d\'emballage — 1-2 jours' },
    { title: 'Expédié', desc: 'Votre colis est en route — 2-3 jours' },
    { title: 'Livré', desc: 'À votre porte !' },
  ];

  ngOnInit() {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');
  }
}
