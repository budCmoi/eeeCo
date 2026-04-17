import { RefObject, useEffect } from 'react';

import { gsap, registerGsapPlugins } from '@/animations/gsap';

export function useParallax<T extends HTMLElement>(ref: RefObject<T | null>, intensity = 10) {
  useEffect(() => {
    const element = ref.current;

    if (!element || typeof window === 'undefined') {
      return;
    }

    registerGsapPlugins();

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { yPercent: -intensity },
        {
          yPercent: intensity,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            scrub: true,
            start: 'top bottom',
            end: 'bottom top'
          }
        }
      );
    }, element);

    return () => {
      context.revert();
    };
  }, [intensity, ref]);
}