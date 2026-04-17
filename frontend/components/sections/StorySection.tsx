import Image from 'next/image';
import { useRef } from 'react';

import { useImageReveal } from '@/animations/useImageReveal';
import { useParallax } from '@/animations/useParallax';
import { Reveal } from '@/components/ui/Reveal';
import { STORY_POINTS } from '@/lib/constants';
import type { Product } from '@/types';

type StorySectionProps = {
  products: Product[];
};

export function StorySection({ products }: StorySectionProps) {
  const mainImageRef = useRef<HTMLDivElement>(null);
  const secondaryImageRef = useRef<HTMLDivElement>(null);

  useImageReveal(mainImageRef);
  useImageReveal(secondaryImageRef, 0.12);
  useParallax(mainImageRef, 6);

  return (
    <section className="px-4 py-16 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-24 lg:pr-6">
          {STORY_POINTS.map((point, index) => (
            <Reveal key={point.title} delay={index * 0.05} className="border-t border-white/8 pt-8">
              <p className="eyebrow">{point.eyebrow}</p>
              <h3 className="mt-4 max-w-xl font-display text-4xl leading-none text-ivory md:text-5xl">{point.title}</h3>
              <p className="mt-5 max-w-lg text-sm leading-7 text-ivory/66 md:text-base">{point.copy}</p>
            </Reveal>
          ))}
        </div>

        <div className="lg:sticky lg:top-28">
          <div className="relative min-h-[34rem] rounded-[2.2rem] border border-white/8 bg-white/[0.03] p-4 md:p-5">
            <div ref={mainImageRef} className="relative h-[30rem] overflow-hidden rounded-[1.8rem] md:h-[36rem]">
              <Image
                src={products[1].images[0].src}
                alt={products[1].images[0].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div ref={secondaryImageRef} className="surface-panel absolute bottom-10 left-[-1rem] hidden w-56 overflow-hidden rounded-[1.6rem] p-2 md:block lg:left-[-2rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem]">
                <Image
                  src={products[3].images[0].src}
                  alt={products[3].images[0].alt}
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="surface-panel absolute right-4 top-4 max-w-xs rounded-[1.5rem] p-5 md:right-6 md:top-6">
              <p className="eyebrow">Scroll storytelling</p>
              <p className="mt-4 text-sm leading-7 text-ivory/68">
                Sticky media, reveal masks, and softened parallax keep attention on product atmosphere while preserving performance and readability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}