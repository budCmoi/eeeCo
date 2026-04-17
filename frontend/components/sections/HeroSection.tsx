import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { useParallax } from '@/animations/useParallax';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

type HeroSectionProps = {
  heroProduct: Product;
};

export function HeroSection({ heroProduct }: HeroSectionProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useParallax(mediaRef, 8);
  useParallax(floatingRef, 14);

  return (
    <section className="relative px-4 pb-16 pt-6 md:px-8 md:pb-24">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-[1440px] gap-10 overflow-hidden rounded-[2.5rem] border border-white/8 bg-white/[0.03] px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="relative z-10 flex flex-col justify-between gap-10 py-6 md:py-10">
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="eyebrow"
            >
              Luxury commerce / immersive scroll
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl text-balance font-display text-[3.6rem] leading-[0.92] text-ivory sm:text-[4.6rem] md:text-[5.5rem] lg:text-[7rem]"
            >
              Premium pieces, orchestrated through motion.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.6 }}
              className="max-w-xl text-sm leading-7 text-ivory/68 md:text-base"
            >
              A minimalist fashion storefront shaped by deep contrast, editorial spacing, and fluid scrolling tuned to feel calm, tactile, and exact.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.7 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/shop">
              <Button className="gap-2">
                Shop the edit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/product/${heroProduct.slug}`}>
              <Button variant="secondary">Explore hero piece</Button>
            </Link>
          </motion.div>

          <div className="grid gap-6 border-t border-white/8 pt-6 text-sm text-ivory/68 sm:grid-cols-3">
            <div>
              <p className="text-2xl text-ivory">60fps</p>
              <p className="mt-2">Lenis + ScrollTrigger tuned for restrained motion and high perceived performance.</p>
            </div>
            <div>
              <p className="text-2xl text-ivory">Editorial</p>
              <p className="mt-2">Layered type, long-form sections, and oversized media create an immersive luxury cadence.</p>
            </div>
            <div>
              <p className="text-2xl text-ivory">Responsive</p>
              <p className="mt-2">Layouts collapse cleanly to mobile without losing hierarchy, atmosphere, or purchase flow clarity.</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[28rem] lg:min-h-[42rem]">
          <div ref={mediaRef} className="absolute inset-0 overflow-hidden rounded-[2rem]">
            <Image
              src={heroProduct.images[0].src}
              alt={heroProduct.images[0].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/12" />
          </div>

          <div ref={floatingRef} className="absolute bottom-4 left-4 right-4 surface-panel rounded-[1.6rem] p-5 md:bottom-6 md:left-6 md:max-w-sm">
            <p className="eyebrow">Highlighted object</p>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xl text-ivory">{heroProduct.name}</p>
                <p className="mt-2 text-sm text-ivory/62">{heroProduct.description}</p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-ivory/70">
                {heroProduct.collection}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}