import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer style="background:#0F0F0F;border-top:1px solid rgba(30,30,30,0.8);" class="mt-20">
      <div class="max-w-7xl mx-auto px-6 py-14">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">

          <!-- Brand -->
          <div>
            <a routerLink="/" class="inline-block mb-5 select-none">
              <span style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;
                           font-weight:300;letter-spacing:0.22em;font-size:1.4rem;color:#fff;">
                NOIR<span style="color:#C2C85B;">É</span>
              </span>
            </a>
            <p class="text-brand-muted text-sm leading-relaxed max-w-xs">
              Un seul parfum. Une seule vision. L'élégance distillée dans chaque flacon,
              pensée pour ceux qui n'ont pas besoin d'en dire plus.
            </p>
          </div>

          <!-- Liens -->
          <div>
            <h4 class="text-white text-[10px] font-medium mb-5 tracking-[0.2em] uppercase">Navigation</h4>
            <ul class="space-y-3">
              <li><a routerLink="/" class="text-brand-muted hover:text-brand-accent text-sm transition-colors duration-200">Accueil</a></li>
              <li><a routerLink="/produit" class="text-brand-muted hover:text-brand-accent text-sm transition-colors duration-200">Produit</a></li>
              <li><a routerLink="/a-propos" class="text-brand-muted hover:text-brand-accent text-sm transition-colors duration-200">À Propos</a></li>
              <li><a routerLink="/contact" class="text-brand-muted hover:text-brand-accent text-sm transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          <!-- Infos -->
          <div>
            <h4 class="text-white text-[10px] font-medium mb-5 tracking-[0.2em] uppercase">Informations</h4>
            <ul class="space-y-3">
              <li><a routerLink="/mentions-legales" class="text-brand-muted hover:text-brand-accent text-sm transition-colors duration-200">Mentions légales</a></li>
              <li><a routerLink="/mentions-legales" class="text-brand-muted hover:text-brand-accent text-sm transition-colors duration-200">Confidentialité</a></li>
              <li><a routerLink="/mentions-legales" class="text-brand-muted hover:text-brand-accent text-sm transition-colors duration-200">CGV</a></li>
              <li><p class="text-brand-muted text-sm">contact&#64;noire-parfum.fr</p></li>
            </ul>
          </div>
        </div>

        <div class="h-px my-10" style="background:linear-gradient(90deg,transparent,rgba(30,30,30,0.8),transparent);"></div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-brand-muted text-xs tracking-wider">
            © {{ year }} NOIRÉ — Tous droits réservés
          </p>
          <div class="flex items-center gap-4 text-brand-muted text-xs">
            <span>💳 Paiement sécurisé</span>
            <span style="color:rgba(30,30,30,0.8);">·</span>
            <span>🚚 Livraison dès 80€</span>
            <span style="color:rgba(30,30,30,0.8);">·</span>
            <span>🔄 Retours 30j</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}

