import { PropsWithChildren, useEffect } from 'react';

import Lenis from 'lenis';

import { registerGsapPlugins, ScrollTrigger } from '@/animations/gsap';

type LenisWindow = Window & {
  __lenis?: Lenis;
  __lenisRafId?: number;
};

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const rootWindow = window as LenisWindow;
    const rootElement = document.documentElement;

    registerGsapPlugins();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      return;
    }

    if (rootWindow.__lenisRafId) {
      window.cancelAnimationFrame(rootWindow.__lenisRafId);
      delete rootWindow.__lenisRafId;
    }

    if (rootWindow.__lenis) {
      rootWindow.__lenis.destroy();
      delete rootWindow.__lenis;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    const lenis = new Lenis({
      autoRaf: false,
      wrapper: window,
      content: rootElement,
      eventsTarget: window,
      duration: 1.15,
      lerp: 0.09,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
      syncTouch: true,
      syncTouchLerp: 0.075
    });

    rootWindow.__lenis = lenis;

    lenis.on('scroll', () => ScrollTrigger.update());

    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    const update = (time: number) => {
      lenis.raf(time);
      rootWindow.__lenisRafId = window.requestAnimationFrame(update);
    };

    rootWindow.__lenisRafId = window.requestAnimationFrame(update);

    return () => {
      if (rootWindow.__lenis !== lenis) {
        return;
      }

      if (rootWindow.__lenisRafId) {
        window.cancelAnimationFrame(rootWindow.__lenisRafId);
        delete rootWindow.__lenisRafId;
      }

      lenis.destroy();
      delete rootWindow.__lenis;
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return <>{children}</>;
}