import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-dark">

      <!-- ─── Hero ─── -->
      <section class="relative py-28 overflow-hidden">
        <div class="absolute inset-0" style="background:radial-gradient(ellipse at 60% 40%, rgba(194,200,91,0.05) 0%, transparent 60%);"></div>
        <div class="relative max-w-4xl mx-auto px-6 text-center">
          <div class="flex items-center justify-center gap-4 mb-8">
            <div class="h-px w-16 bg-brand-accent/50"></div>
            <span class="text-brand-accent text-xs tracking-[0.3em] uppercase">L'identité</span>
            <div class="h-px w-16 bg-brand-accent/50"></div>
          </div>
          <h1 class="text-5xl md:text-7xl text-white mb-7 scroll-reveal"
              style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;font-weight:300;letter-spacing:0.04em;line-height:1.1;">
            Il n'existe qu'un<br>
            <span style="color:#C2C85B;">seul parfum.</span>
          </h1>
          <p class="text-brand-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto scroll-reveal animation-delay-100">
            Parce que choisir, c'est déjà affirmer quelque chose de soi.
            NOIRÉ est né de cette idée : une signature unique, construite
            pour durer — pas pour plaire à tous.
          </p>
        </div>
      </section>

      <!-- ─── Image immersive ─── -->
      <section class="py-4 px-6">
        <div class="max-w-5xl mx-auto">
          <div class="relative aspect-[21/8] rounded-3xl overflow-hidden scroll-reveal">
            <img src="https://images.unsplash.com/photo-1547005327-b56b06bf4040?w=1400&q=85"
                 alt="Atmosphère NOIRÉ"
                 class="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity duration-700">
            <div class="absolute inset-0 bg-gradient-to-r from-brand-dark/70 via-transparent to-brand-dark/70"></div>
          </div>
        </div>
      </section>

      <!-- ─── L'histoire ─── -->
      <section class="py-24 max-w-6xl mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-16 items-start">
          <div class="scroll-reveal">
            <div class="flex items-center gap-3 mb-8">
              <div class="h-px w-8 bg-brand-accent"></div>
              <span class="text-brand-accent text-xs tracking-[0.25em] uppercase">Origine</span>
            </div>
            <h2 class="section-title mb-7">
              Né d'un refus<br>du superflu.
            </h2>
            <div class="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>
                NOIRÉ n'est pas une marque de parfumerie parmi d'autres.
                C'est une prise de position. À une époque où l'abondance
                remplace la profondeur, nous avons fait l'inverse : un seul
                produit, conçu sans compromis, pensé pour durer.
              </p>
              <p>
                La fragrance s'est construite autour d'une question simple :
                qu'est-ce qu'un parfum mémorable ? Pas celui qu'on reconnaît
                dans la rue. Celui qu'on retrouve dans un souvenir, une présence,
                une pièce qu'on vient de quitter.
              </p>
              <p>
                Chaque composant a été sélectionné pour sa cohérence avec
                l'ensemble. Rien n'a été ajouté par commodité. Rien ne manque
                non plus.
              </p>
            </div>
          </div>

          <div class="scroll-reveal animation-delay-200">
            <div class="flex items-center gap-3 mb-8">
              <div class="h-px w-8 bg-brand-accent"></div>
              <span class="text-brand-accent text-xs tracking-[0.25em] uppercase">Philosophie</span>
            </div>
            <h2 class="section-title mb-7">
              La rareté comme<br>choix délibéré.
            </h2>
            <div class="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>
                Nous ne sortons pas de nouvelles références chaque saison.
                Nous n'avons pas de collection capsule, pas d'édition limitée
                par marketing. La rareté de NOIRÉ n'est pas artificielle :
                elle est le résultat direct de l'exigence.
              </p>
              <p>
                Le flacon en verre noir brossé, rechargeable, a été pensé
                pour traverser le temps. Il ne s'impose pas sur une étagère —
                il y appartient.
              </p>
              <p>
                Nous croyons qu'un parfum qui mérite d'être porté chaque jour
                n'a pas besoin de justifier sa présence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Citation centrale ─── -->
      <section class="py-20" style="background:#0F0F0F;border-top:1px solid rgba(30,30,30,0.8);border-bottom:1px solid rgba(30,30,30,0.8);">
        <div class="max-w-3xl mx-auto px-6 text-center scroll-reveal">
          <div class="w-6 h-6 mx-auto mb-8 opacity-40">
            <svg viewBox="0 0 24 24" fill="none" stroke="#C2C85B" stroke-width="1">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
            </svg>
          </div>
          <blockquote class="text-white text-2xl md:text-3xl font-light leading-relaxed mb-6"
                      style="font-family:'Relicta Light','Relicta','Cormorant Garamond',Georgia,serif;letter-spacing:0.02em;">
            Un parfum ne devrait pas s'expliquer.
            Il devrait simplement rester.
          </blockquote>
          <div class="flex items-center justify-center gap-3">
            <div class="h-px w-8 bg-brand-accent/40"></div>
            <span class="text-brand-accent text-xs tracking-[0.2em] uppercase">NOIRÉ</span>
            <div class="h-px w-8 bg-brand-accent/40"></div>
          </div>
        </div>
      </section>

      <!-- ─── Ce que nous sommes ─── -->
      <section class="py-24 max-w-6xl mx-auto px-6">
        <div class="text-center mb-16 scroll-reveal">
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="h-px w-8 bg-brand-accent"></div>
            <span class="text-brand-accent text-xs tracking-[0.25em] uppercase">L'approche</span>
            <div class="h-px w-8 bg-brand-accent"></div>
          </div>
          <h2 class="section-title">Ce que NOIRÉ représente</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div *ngFor="let p of pillars; let i = index"
               class="p-6 rounded-2xl border border-brand-border scroll-reveal
                      hover:border-brand-border-light transition-all duration-400"
               style="background:rgba(22,22,22,0.4);"
               [style.animation-delay]="(i * 100) + 'ms'">
            <div class="w-8 h-8 rounded-lg border border-brand-accent/20 flex items-center justify-center mb-5"
                 style="background:rgba(194,200,91,0.06);">
              <span class="text-brand-accent text-xs font-medium">{{ i + 1 < 10 ? '0' + (i + 1) : (i + 1) }}</span>
            </div>
            <h3 class="text-white font-medium mb-2 text-sm">{{ p.title }}</h3>
            <p class="text-brand-muted text-xs leading-relaxed">{{ p.text }}</p>
          </div>
        </div>
      </section>

      <!-- ─── CTA ─── -->
      <section class="py-20" style="background:#0F0F0F;">
        <div class="max-w-xl mx-auto px-6 text-center scroll-reveal">
          <h2 class="section-title mb-5">Prêt à découvrir<br>votre signature ?</h2>
          <p class="text-brand-muted text-sm mb-8">
            Une seule occasion de rencontrer un parfum qui vous correspond vraiment.
          </p>
          <a routerLink="/produit" class="btn-primary inline-flex">Découvrir NOIRÉ</a>
        </div>
      </section>

    </div>
  `
})
export class AboutComponent {
  pillars = [
    { title: 'Un seul produit', text: "Pas de collection, pas de catalogue. Une fragrance conçue pour être la seule dont vous ayez besoin." },
    { title: 'Formulation exigeante', text: "Chaque matière première est sélectionnée pour sa qualité intrinsèque, pas pour son coût ou sa disponibilité." },
    { title: 'Tenue garantie', text: "10 à 12 heures de projection stable, sans saturation olfactive. Un sillage présent, jamais envahissant." },
    { title: 'Flacon rechargeable', text: "Un geste concret vers la durabilité. Le flacon est pensé pour durer, pas pour être remplacé." },
    { title: 'Transparence totale', text: "Nous publions la composition complète de la fragrance. Aucun ingrédient caché, aucune formule opaque." },
    { title: 'Identité singulière', text: "NOIRÉ n'appartient à aucune tendance. Il précède celles qui viennent, et survit à celles qui passent." },
  ];
}

