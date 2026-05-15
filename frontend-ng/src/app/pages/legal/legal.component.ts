import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-dark py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">

        <!-- Onglets -->
        <div class="flex gap-1 bg-brand-surface rounded-2xl p-1 mb-10 w-fit">
          <button *ngFor="let t of tabs" (click)="activeTab = t.id"
                  class="py-2 px-5 rounded-xl text-sm font-medium transition-all duration-200"
                  [class.bg-brand-card]="activeTab === t.id"
                  [class.text-brand-light]="activeTab === t.id"
                  [class.text-brand-muted]="activeTab !== t.id">
            {{ t.label }}
          </button>
        </div>

        <!-- Mentions légales -->
        <div *ngIf="activeTab === 'mentions'" class="prose-aurora animate-fade-up">
          <h1 class="font-relicta text-3xl text-brand-light mb-8">Mentions légales</h1>
          <div class="space-y-8 text-brand-muted">

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">Éditeur du site</h2>
              <p>Aurora Essence SAS (démo)</p>
              <p>12 rue du Luxe, 75001 Paris, France</p>
              <p>Email : contact&#64;aurora-essence.fr</p>
              <p>SIRET : 000 000 000 00000 (démo)</p>
              <p>Capital social : 10 000 € (démo)</p>
            </div>

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">Hébergement</h2>
              <p>Render Inc. — 525 Brannan St, San Francisco, CA 94107, USA</p>
            </div>

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">Propriété intellectuelle</h2>
              <p>L'ensemble des contenus présents sur ce site (textes, images, design) sont la propriété exclusive d'Aurora Essence ou de ses partenaires. Toute reproduction est interdite sans autorisation préalable.</p>
            </div>
          </div>
        </div>

        <!-- Confidentialité -->
        <div *ngIf="activeTab === 'privacy'" class="animate-fade-up">
          <h1 class="font-relicta text-3xl text-brand-light mb-8">Politique de confidentialité</h1>
          <div class="space-y-6 text-brand-muted">

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">Données collectées</h2>
              <p class="leading-relaxed">Nous collectons uniquement les données nécessaires au bon fonctionnement du service : nom, email, adresse de livraison, historique de commandes.</p>
              <p class="mt-3 leading-relaxed">Ces données ne sont jamais vendues ni partagées avec des tiers à des fins commerciales.</p>
            </div>

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">Cookies</h2>
              <p class="leading-relaxed">Ce site utilise des cookies techniques essentiels au fonctionnement (session, panier). Aucun cookie de tracking publicitaire n'est utilisé.</p>
            </div>

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">Vos droits (RGPD)</h2>
              <p class="leading-relaxed">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Contactez-nous à contact&#64;aurora-essence.fr.</p>
            </div>
          </div>
        </div>

        <!-- CGV -->
        <div *ngIf="activeTab === 'cgv'" class="animate-fade-up">
          <h1 class="font-relicta text-3xl text-brand-light mb-8">Conditions Générales de Vente</h1>
          <div class="space-y-6 text-brand-muted">

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">1. Objet</h2>
              <p class="leading-relaxed">Les présentes CGV régissent les ventes effectuées sur aurora-essence.fr. Toute commande implique l'acceptation des présentes conditions.</p>
            </div>

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">2. Prix</h2>
              <p class="leading-relaxed">Les prix sont indiqués en euros TTC. Les frais de livraison sont offerts pour toute commande supérieure à 80€, sinon 4,99€.</p>
            </div>

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">3. Délai de rétractation</h2>
              <p class="leading-relaxed">Conformément à la loi Hamon, vous disposez de 30 jours à compter de la réception pour exercer votre droit de rétractation. Retour gratuit garanti.</p>
            </div>

            <div class="card-glass p-6">
              <h2 class="text-brand-light font-semibold text-lg mb-3">4. Mode démo</h2>
              <p class="leading-relaxed">Ce site est une démonstration. Aucune transaction réelle n'est effectuée. Aucun paiement n'est débité.</p>
            </div>
          </div>
        </div>

        <div class="mt-10">
          <a routerLink="/" class="btn-ghost text-sm text-brand-muted hover:text-brand-yellow">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  `
})
export class LegalComponent {
  activeTab = 'mentions';
  tabs = [
    { id: 'mentions', label: 'Mentions légales' },
    { id: 'privacy', label: 'Confidentialité' },
    { id: 'cgv', label: 'CGV' },
  ];
}
