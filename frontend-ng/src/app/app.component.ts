import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CanvasBgComponent } from './shared/components/canvas-bg/canvas-bg.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, SidebarComponent, FooterComponent, CanvasBgComponent],
  template: `
    <!-- Canvas Three.js background -->
    <app-canvas-bg />

    <!-- Layout principal -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <app-navbar (toggleSidebar)="sidebarOpen = !sidebarOpen" />
      <app-sidebar [open]="sidebarOpen" (close)="sidebarOpen = false" />

      <!-- Overlay sidebar mobile -->
      <div
        *ngIf="sidebarOpen"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
        (click)="sidebarOpen = false"
      ></div>

      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  private lenis: any;
  private gsapScrollTrigger: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    this.initScrollReveal();
    if (isPlatformBrowser(this.platformId)) {
      await this.initLenis();
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.checkScrollReveal();
  }

  private async initLenis() {
    try {
      const LenisModule = await import('@studio-freight/lenis');
      const Lenis = (LenisModule as any).default || LenisModule;
      this.lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });
      const raf = (time: number) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    } catch (e) {
      // Lenis optionnel
    }
  }

  private initScrollReveal() {
    setTimeout(() => this.checkScrollReveal(), 150);
  }

  private checkScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal:not(.revealed)');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('revealed');
      }
    });
  }

  ngOnDestroy() {
    this.lenis?.destroy();
  }
}

