import Image from 'next/image';
import Link from 'next/link';
import { startTransition, useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';

import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

type RunwayCarouselSectionProps = {
  products: Product[];
};

type CardSlot = {
  x: string;
  y: string;
  scale: number;
  opacity: number;
  rotate: number;
  zIndex: number;
};

const slotMap: Record<string, CardSlot> = {
  '-2': { x: '-126%', y: '8%', scale: 0.68, opacity: 0.1, rotate: -10, zIndex: 0 },
  '-1': { x: '-58%', y: '3%', scale: 0.84, opacity: 0.38, rotate: -6, zIndex: 1 },
  '0': { x: '0%', y: '0%', scale: 1, opacity: 1, rotate: 0, zIndex: 3 },
  '1': { x: '58%', y: '-1%', scale: 0.84, opacity: 0.38, rotate: 6, zIndex: 1 },
  '2': { x: '126%', y: '-6%', scale: 0.68, opacity: 0.1, rotate: 10, zIndex: 0 }
};

function normalizeRelativePosition(index: number, activeIndex: number, length: number) {
  let relative = index - activeIndex;
  const maxOffset = Math.floor(length / 2);

  if (relative > maxOffset) {
    relative -= length;
  }

  if (relative < -maxOffset) {
    relative += length;
  }

  return relative;
}

export function RunwayCarouselSection({ products }: RunwayCarouselSectionProps) {
  const runwayProducts = useMemo(() => products.slice(0, 5), [products]);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % runwayProducts.length);
      });
    }, 4800);

    return () => {
      window.clearInterval(interval);
    };
  }, [runwayProducts.length]);

  const activeProduct = runwayProducts[activeIndex];

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[2.8rem] border border-white/8 bg-white/[0.025] px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-10 lg:items-stretch">
          <div className="relative min-h-[30rem] overflow-hidden rounded-[2.3rem] border border-white/8 bg-[#090a0a] md:min-h-[38rem]">
            <div className="absolute left-5 top-4 text-[20vw] font-display leading-none text-white/5 md:left-8 md:text-[10rem]">
              {String(activeIndex + 1).padStart(2, '0')}
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(195,208,203,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />

            {runwayProducts.map((product, index) => {
              const relative = normalizeRelativePosition(index, activeIndex, runwayProducts.length);
              const slot = slotMap[String(relative)] ?? { x: '0%', y: '0%', scale: 0.5, opacity: 0, rotate: 0, zIndex: 0 };

              return (
                <motion.div
                  key={product.slug}
                  animate={{
                    x: slot.x,
                    y: slot.y,
                    scale: slot.scale,
                    opacity: slot.opacity,
                    rotate: slot.rotate
                  }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  style={{ zIndex: slot.zIndex }}
                  className="absolute left-1/2 top-[42%] w-[70vw] max-w-[20rem] -translate-x-1/2 -translate-y-1/2 sm:top-[41%] md:top-[38%] md:max-w-[22rem]"
                >
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="motion-panel overflow-hidden rounded-[1.8rem] p-3">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt}
                          fill
                          sizes="(max-width: 768px) 70vw, 352px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            <div className="absolute bottom-4 right-4 z-20 md:bottom-6 md:right-6">
              <div className="rounded-full border border-white/10 bg-black/28 px-4 py-3 text-sm text-ivory/82 backdrop-blur-md">
                {formatPrice(activeProduct.price)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}