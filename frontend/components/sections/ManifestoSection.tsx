import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { gsap, registerGsapPlugins } from '@/animations/gsap';
import { useParallax } from '@/animations/useParallax';
import type { Product } from '@/types';

type ManifestoSectionProps = {
  products: Product[];
};

const quietLines = [
  'Move slower than the interface expects.',
  'Let the frame breathe before the product sells.',
  'Build desire with sequence, contrast, and restraint.'
];

const loudLines = ['Interactive', 'design motion', 'for luxury', 'commerce'];

export function ManifestoSection({ products }: ManifestoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const quietRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const loudRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useParallax(backgroundRef, 6);

  useEffect(() => {
    if (!sectionRef.current || typeof window === 'undefined') {
      return;
    }

    registerGsapPlugins();

    const context = gsap.context(() => {
      const quietElements = quietRefs.current.filter(Boolean);
      const loudElements = loudRefs.current.filter(Boolean);

      gsap.fromTo(
        quietElements,
        { autoAlpha: 0, yPercent: 120 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.95,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%'
          }
        }
      );

      gsap.fromTo(
        loudElements,
        { autoAlpha: 0, yPercent: 105 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1.05,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%'
          }
        }
      );
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto relative min-h-[86vh] max-w-[1440px] overflow-hidden rounded-[2.8rem] border border-white/8 px-6 py-8 md:px-10 md:py-10">
        <div ref={backgroundRef} className="absolute inset-0">
          <Image
            src={products[2].images[0].src}
            alt={products[2].images[0].alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(195,208,203,0.16),rgba(0,0,0,0.18)_28%,rgba(0,0,0,0.78)_76%)]" />

        <div className="relative z-10 flex min-h-[calc(86vh-4rem)] flex-col justify-between gap-10 md:min-h-[calc(86vh-5rem)]">
          <div className="max-w-lg space-y-2 text-[1rem] font-light leading-[1.2] text-[#d3dfdb] md:text-[1.55rem]">
            {quietLines.map((line, index) => (
              <span
                key={line}
                ref={(element) => {
                  quietRefs.current[index] = element;
                }}
                className="block"
              >
                {line}
              </span>
            ))}
          </div>

          <div className="self-end text-left font-display text-[4rem] leading-[0.82] text-ivory md:text-right md:text-[8.5rem]">
            {loudLines.map((line, index) => (
              <span
                key={line}
                ref={(element) => {
                  loudRefs.current[index] = element;
                }}
                className="block"
              >
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}