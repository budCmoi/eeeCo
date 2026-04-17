import { RefObject, useEffect } from 'react';

import { gsap, registerGsapPlugins, ScrollTrigger } from '@/animations/gsap';

type ScrollRevealOptions = {
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
  once?: boolean;
};

export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { y = 48, delay = 0, duration = 1, start = 'top 84%', once = true }: ScrollRevealOptions = {}
) {
  useEffect(() => {
    const element = ref.current;

    if (!element || typeof window === 'undefined') {
      return;
    }

    registerGsapPlugins();

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y
        },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start,
            once
          }
        }
      );
    }, element);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [delay, duration, once, ref, start, y]);
}