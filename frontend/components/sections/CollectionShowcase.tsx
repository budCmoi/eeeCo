import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { ArrowRight } from 'lucide-react';

import { useImageReveal } from '@/animations/useImageReveal';
import { useParallax } from '@/animations/useParallax';
import { Reveal } from '@/components/ui/Reveal';
import { SectionIntro } from '@/components/ui/SectionIntro';
import type { Product } from '@/types';

type CollectionShowcaseProps = {
  products: Product[];
};

export function CollectionShowcase({ products }: CollectionShowcaseProps) {
  const largeRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useImageReveal(largeRef);
  useImageReveal(topRef, 0.08);
  useImageReveal(bottomRef, 0.14);
  useParallax(largeRef, 8);

  return (
    <section className="px-4 py-16 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1440px] rounded-[2.5rem] border border-white/8 bg-white/[0.025] px-6 py-10 md:px-10 md:py-12">
        <Reveal>
          <SectionIntro
            eyebrow="Collections"
            title="Large imagery, quiet accents, and deliberate whitespace."
            copy="The layout stays minimal, but not generic. Strong contrast, editorial typography, and rhythm in the grid preserve a high-end presence across devices."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div ref={largeRef} className="relative min-h-[28rem] overflow-hidden rounded-[2rem] md:min-h-[40rem]">
            <Image
              src={products[2].images[0].src}
              alt={products[2].images[0].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 max-w-sm">
              <p className="eyebrow">Edition 02</p>
              <h3 className="mt-3 font-display text-4xl leading-none text-ivory">Fluid evening silhouettes.</h3>
            </div>
          </div>

          <div className="grid gap-5 md:grid-rows-2">
            <div ref={topRef} className="relative min-h-[17rem] overflow-hidden rounded-[1.8rem]">
              <Image
                src={products[5].images[0].src}
                alt={products[5].images[0].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div ref={bottomRef} className="surface-panel flex flex-col justify-between rounded-[1.8rem] p-6 md:p-8">
              <div>
                <p className="eyebrow">Architecture</p>
                <p className="mt-4 max-w-md text-sm leading-7 text-ivory/68">
                  Components are separated by role, motion utilities stay isolated in a dedicated animation layer, and services remain API-ready with mock fallbacks.
                </p>
              </div>

              <Link href="/shop" className="mt-8 inline-flex items-center gap-2 text-sm text-ivory/72 transition-colors hover:text-ivory">
                Browse all products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}