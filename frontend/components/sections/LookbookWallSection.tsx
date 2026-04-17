import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

type LookbookWallSectionProps = {
  products: Product[];
};

type LookbookTileProps = {
  product: Product;
  large?: boolean;
};

function LookbookTile({ product, large }: LookbookTileProps) {
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.35 }} className="group">
      <Link href={`/product/${product.slug}`} className="block overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] p-3 md:p-4">
        <div className={`relative overflow-hidden rounded-[1.5rem] ${large ? 'aspect-[16/12] md:aspect-[7/8]' : 'aspect-[4/5]'}`}>
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes={large ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.56))]" />

          <div className="absolute inset-x-4 bottom-4 rounded-[1.35rem] border border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ivory/48">{product.collection}</p>
                <p className="mt-2 text-sm text-ivory md:text-base">{product.name}</p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-ivory/72">
                {formatPrice(product.price)}
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function LookbookWallSection({ products }: LookbookWallSectionProps) {
  const duoProducts = products.slice(1, 3);
  const lineupProducts = products.slice(3, 7);

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Curated pieces</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-none text-ivory md:text-6xl">
              Hero cards first, dense lineup after.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-ivory/62 md:text-right md:text-base">
            The composition borrows the energy of a campaign landing page: large image blocks to set tone, followed by a tighter product wall with stronger hover intent.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {duoProducts.map((product) => (
            <LookbookTile key={product.slug} product={product} large />
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {lineupProducts.map((product) => (
            <LookbookTile key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}