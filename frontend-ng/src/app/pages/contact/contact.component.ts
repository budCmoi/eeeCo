import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-brand-dark py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">

        <!-- Header -->
        <div class="text-center mb-16 scroll-reveal">
          <div class="badge-yellow mb-4 mx-auto w-fit">💬 Contactez-nous</div>
          <h1 class="section-title mb-4">Nous sommes là pour vous</h1>
          <p class="section-subtitle max-w-xl mx-auto">
            Une question sur Aurora Essence ? Notre équipe répond en moins de 24h.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-start">

          <!-- Formulaire -->
          <div class="card-glass p-8 scroll-reveal">
            <h2 class="text-brand-light font-semibold text-xl mb-6">Envoyer un message</h2>

            <div *ngIf="sent" class="text-center py-12">
              <div class="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full
                          flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="text-brand-light text-xl font-semibold mb-2">Message envoyé !</h3>
              <p class="text-brand-muted">Nous vous répondrons sous 24h.</p>
              <button (click)="sent = false" class="btn-ghost mt-4 text-sm text-brand-yellow">
                Envoyer un autre message
              </button>
            </div>

            <form *ngIf="!sent" [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Prénom</label>
                  <input formControlName="name" class="input-field" placeholder="Marie">
                  <p *ngIf="f['name'].invalid && f['name'].touched" class="text-red-400 text-xs mt-1">Requis</p>
                </div>
                <div>
                  <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Email</label>
                  <input formControlName="email" type="email" class="input-field" placeholder="vous@email.com">
                  <p *ngIf="f['email'].invalid && f['email'].touched" class="text-red-400 text-xs mt-1">Email invalide</p>
                </div>
              </div>
              <div>
                <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Sujet</label>
                <select formControlName="subject" class="input-field">
                  <option value="">Choisir un sujet</option>
                  <option value="commande">Ma commande</option>
                  <option value="produit">Question produit</option>
                  <option value="retour">Retour / Échange</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label class="text-brand-muted text-xs uppercase tracking-wider mb-1.5 block">Message</label>
                <textarea formControlName="message" rows="5"
                          class="input-field resize-none"
                          placeholder="Décrivez votre demande..."></textarea>
                <p *ngIf="f['message'].invalid && f['message'].touched" class="text-red-400 text-xs mt-1">
                  Message trop court (min. 20 caractères)
                </p>
              </div>
              <button type="submit" [disabled]="loading"
                      class="btn-primary w-full justify-center py-3">
                <span *ngIf="!loading">Envoyer le message</span>
                <span *ngIf="loading">Envoi en cours…</span>
              </button>
            </form>
          </div>

          <!-- Infos contact + FAQ -->
          <div class="space-y-6">

            <!-- Coordonnées démo -->
            <div class="card-glass p-6 scroll-reveal">
              <h3 class="text-brand-light font-semibold mb-4">Nos coordonnées (démo)</h3>
              <div class="space-y-3">
                <div class="flex items-center gap-3 text-sm">
                  <div class="w-8 h-8 bg-brand-yellow/10 rounded-lg flex items-center justify-center text-brand-yellow">
                    📧
                  </div>
                  <span class="text-brand-muted">contact&#64;aurora-essence.fr</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <div class="w-8 h-8 bg-brand-yellow/10 rounded-lg flex items-center justify-center text-brand-yellow">
                    📞
                  </div>
                  <span class="text-brand-muted">+33 1 23 45 67 89</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <div class="w-8 h-8 bg-brand-yellow/10 rounded-lg flex items-center justify-center text-brand-yellow">
                    📍
                  </div>
                  <span class="text-brand-muted">12 rue du Luxe, 75001 Paris, France</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <div class="w-8 h-8 bg-brand-yellow/10 rounded-lg flex items-center justify-center text-brand-yellow">
                    🕒
                  </div>
                  <span class="text-brand-muted">Lun–Ven 9h–18h</span>
                </div>
              </div>
            </div>

            <!-- FAQ -->
            <div class="card-glass p-6 scroll-reveal">
              <h3 class="text-brand-light font-semibold mb-4">Questions fréquentes</h3>
              <div class="space-y-4">
                <div *ngFor="let faq of faqs; let i = index">
                  <button (click)="openFaq = openFaq === i ? null : i"
                          class="w-full text-left flex items-center justify-between py-2">
                    <span class="text-brand-light text-sm font-medium">{{ faq.q }}</span>
                    <svg class="w-4 h-4 text-brand-muted transition-transform duration-200 shrink-0"
                         [class.rotate-180]="openFaq === i"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <div *ngIf="openFaq === i" class="text-brand-muted text-sm pb-2 animate-fade-up">
                    {{ faq.a }}
                  </div>
                  <div class="divider !my-0" *ngIf="i < faqs.length - 1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);

  sent = false;
  loading = false;
  openFaq: number | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(20)]],
  });

  get f() { return this.form.controls; }

  faqs = [
    { q: 'Quels sont les délais de livraison ?', a: '2 à 5 jours ouvrés en France métropolitaine. Livraison express disponible.' },
    { q: 'Puis-je retourner le produit ?', a: 'Oui, 30 jours pour retourner le produit non utilisé. Retour gratuit.' },
    { q: 'Aurora Essence est-il cruelty-free ?', a: 'Absolument. Aucun test sur les animaux. Certifié Leaping Bunny.' },
    { q: 'Comment conserver le parfum ?', a: 'À l\'abri de la lumière et de la chaleur, dans son coffret d\'origine.' },
    { q: 'Le produit est-il disponible en magasin ?', a: 'Uniquement en ligne pour le moment. Livraison dans toute l\'Europe.' },
  ];

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.contactService.send(this.form.value as any).subscribe({
      next: () => { this.sent = true; this.loading = false; this.form.reset(); },
      error: () => { this.sent = true; this.loading = false; } // Démo: simuler succès
    });
  }
}
