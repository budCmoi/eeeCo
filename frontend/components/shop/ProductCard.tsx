import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.28 }} className="group">
      <Link href={`/product/${product.slug}`} className="block overflow-hidden rounded-[1.7rem] border border-white/8 bg-white/[0.02] p-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-[#101010]">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {product.newArrival ? (
            <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/88">
              New
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-ivory/48">{product.collection}</p>
            <h3 className="mt-2 text-lg text-ivory">{product.name}</h3>
            <p className="mt-2 text-sm text-ivory/58">{product.category}</p>
          </div>
          <p className="text-sm text-ivory/82">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.article>
  );
}