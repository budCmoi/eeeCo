import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

type EditionArchiveSectionProps = {
  products: Product[];
};

const editionDescriptions = {
  'Edition 01': {
    number: '01',
    title: 'Tailoring with colder precision.',
    description:
      'Edition 01 is clean, sharp, and slightly severe. It sets the tone with stronger structure, denser blacks, and silhouettes that feel cut rather than relaxed.'
  },
  'Edition 02': {
    number: '02',
    title: 'Evening softness without losing edge.',
    description:
      'Edition 02 loosens the line just enough. It leans into liquid surfaces, open drape, and quieter sensuality, while keeping the overall system minimal and exact.'
  },
  'Edition 03': {
    number: '03',
    title: 'Grounded essentials with a heavier stride.',
    description:
      'Edition 03 introduces leather, utility, and stronger accessories. The palette stays neutral, but the posture becomes more assertive and more directional.'
  }
} as const;

export function EditionArchiveSection({ products }: EditionArchiveSectionProps) {
  const editions = useMemo(() => {
    return Object.entries(editionDescriptions).map(([collection, meta]) => ({
      ...meta,
      collection,
      products: products.filter((product) => product.collection === collection)
    }));
  }, [products]);

  const [activeIndex, setActiveIndex] = useState(editions.length - 1);
  const activeEdition = editions[activeIndex];
  const primaryProduct = activeEdition.products[0];
  const secondaryProducts = activeEdition.products.slice(1, 5);

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px] rounded-[2.8rem] border border-white/8 bg-white/[0.025] px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Edition archive</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-none text-ivory md:text-6xl">
              A switchable drop system with a campaign view.
            </h2>
          </div>

          <div className="flex flex-row-reverse items-center gap-8 text-[1.9rem] font-display text-ivory/32 md:text-[3rem]">
            {[...editions].reverse().map((edition) => {
              const index = editions.findIndex((candidate) => candidate.collection === edition.collection);

              return (
                <button
                  key={edition.collection}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={index === activeIndex ? 'text-ivory' : 'transition-colors hover:text-ivory/72'}
                >
                  {edition.number}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeEdition.collection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-6 lg:grid-cols-[0.54fr_0.46fr]"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-black/20">
              <div className="relative aspect-[4/5] md:aspect-[4/4.8]">
                <Image
                  src={primaryProduct.images[0].src}
                  alt={primaryProduct.images[0].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.5))]" />
              </div>

              <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl">
                <p className="eyebrow">{activeEdition.collection}</p>
                <p className="mt-3 text-xl text-ivory">{primaryProduct.name}</p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-3">
                {secondaryProducts.map((product) => (
                  <div key={product.slug} className="relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/20">
                    <div className="relative aspect-[4/5]">
                      <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="motion-panel rounded-[1.8rem] p-6 md:p-7">
                <p className="eyebrow">Edition {activeEdition.number}</p>
                <h3 className="mt-4 font-display text-3xl leading-none text-ivory md:text-5xl">{activeEdition.title}</h3>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-ivory/66 md:text-base">{activeEdition.description}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/shop">
                    <Button>View the shop</Button>
                  </Link>
                  <Link href={`/product/${primaryProduct.slug}`}>
                    <Button variant="secondary">Open featured product</Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}