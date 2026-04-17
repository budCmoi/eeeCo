import { RefObject, useEffect } from 'react';

import { gsap, registerGsapPlugins } from '@/animations/gsap';

export function useImageReveal<T extends HTMLElement>(ref: RefObject<T | null>, delay = 0) {
  useEffect(() => {
    const element = ref.current;

    if (!element || typeof window === 'undefined') {
      return;
    }

    registerGsapPlugins();

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
            once: true
          }
        }
      );
    }, element);

    return () => {
      context.revert();
    };
  }, [delay, ref]);
}