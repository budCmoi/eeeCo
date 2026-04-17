import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import { motion } from 'framer-motion';
import { Check, ChevronLeft } from 'lucide-react';

import { ProductCard } from '@/components/shop/ProductCard';
import { ProductGalleryLead, ProductGalleryStory } from '@/components/shop/ProductGallery';
import { Button } from '@/components/ui/Button';
import { findProductBySlug, mockProducts } from '@/data/products';
import { formatLabel, formatPrice } from '@/lib/format';
import { useCartStore } from '@/store/cart-store';
import type { Product } from '@/types';

type ProductPageProps = {
  product: Product;
  relatedProducts: Product[];
};

export default function ProductPage({ product, relatedProducts }: ProductPageProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const narrativeBlocks = [
    {
      label: 'Product description',
      title: 'A slower, more premium read of the piece.',
      copy: `${product.description} The product page now gives the garment more breathing room, so material, silhouette, and construction feel intentional instead of compressed into a generic commerce layout.`
    },
    {
      label: 'Construction note',
      title: product.details[0] ?? product.collection,
      copy: `${product.details.slice(1).join(' / ')}. Every detail is framed as part of a more editorial, premium product story.`
    }
  ];
  const servicePanels = [
    { value: product.colors.join(' / '), label: 'palette' },
    { value: formatLabel(product.category), label: 'category' },
    { value: product.collection, label: 'release' },
    { value: `${product.inventory} units`, label: 'inventory' }
  ];

  return (
    <section className="px-4 pb-16 pt-6 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1440px]">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-ivory/64 transition-colors hover:text-ivory">
          <ChevronLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductGalleryLead product={product} activeIndex={activeGalleryIndex} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="rounded-[2.35rem] bg-white/[0.05] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-2xl md:p-8">
              <p className="eyebrow">{product.collection}</p>
              <h1 className="mt-4 font-display text-5xl leading-none text-ivory md:text-6xl">{product.name}</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-ivory/64 md:text-base">{product.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] bg-black/20 px-4 py-4 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.18em] text-ivory/46">Palette</p>
                  <p className="mt-3 text-sm text-ivory/80">{product.colors.join(' / ')}</p>
                </div>
                <div className="rounded-[1.4rem] bg-black/20 px-4 py-4 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.18em] text-ivory/46">Description</p>
                  <p className="mt-3 text-sm text-ivory/80">Premium product page with a slower, editorial pace.</p>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between gap-4 border-b border-white/8 pb-8">
                <div>
                  <p className="text-3xl text-ivory">{formatPrice(product.price)}</p>
                  {product.originalPrice ? <p className="mt-2 text-sm text-ivory/40 line-through">{formatPrice(product.originalPrice)}</p> : null}
                </div>
                <p className="text-sm text-ivory/58">Inventory: {product.inventory}</p>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-ivory/48">Select size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`rounded-full px-4 py-2 text-sm transition-colors ${selectedSize === size ? 'bg-ivory text-black' : 'border border-white/10 text-ivory/72'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => {
                    addItem(product, selectedSize);
                    setAdded(true);
                    window.setTimeout(() => setAdded(false), 1800);
                  }}
                >
                  {added ? (
                    <span className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Added to cart
                    </span>
                  ) : (
                    'Add to cart'
                  )}
                </Button>
                <Link href="/checkout">
                  <Button variant="secondary">Buy now</Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-3 rounded-[1.9rem] bg-white/[0.04] p-6 backdrop-blur-2xl">
                {product.details.map((detail) => (
                  <div key={detail} className="flex items-center gap-3 border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="text-sm text-ivory/68">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-12">
        <ProductGalleryStory
          product={product}
          activeIndex={activeGalleryIndex}
          onActiveIndexChange={setActiveGalleryIndex}
        />
      </div>

      <div className="mx-auto mt-16 max-w-[1440px]">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[2.35rem] bg-white/[0.04] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-2xl md:p-8"
          >
            <p className="eyebrow">Editorial details</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-none text-ivory md:text-5xl">
              More description, more depth, and a premium rhythm around the product.
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {narrativeBlocks.map((block) => (
                <div key={block.label} className="rounded-[1.7rem] bg-black/20 p-5 backdrop-blur-xl">
                  <p className="eyebrow">{block.label}</p>
                  <h3 className="mt-3 font-display text-[2rem] leading-none text-ivory">{block.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-ivory/66 md:text-base">{block.copy}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-4"
          >
            {servicePanels.map((panel) => (
              <div key={panel.label} className="rounded-[1.9rem] bg-white/[0.05] px-6 py-5 shadow-[0_16px_44px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.18em] text-ivory/44">{panel.label}</p>
                <p className="mt-3 font-display text-[2rem] leading-none text-ivory md:text-[2.45rem]">{panel.value}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-20 border-t border-white/8 pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Related products</p>
              <h2 className="mt-3 font-display text-4xl text-ivory md:text-5xl">Continue the look.</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.slug} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async ({ params }) => {
  const slug = String(params?.id ?? '');
  const product = findProductBySlug(slug);

  if (!product) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      product,
      relatedProducts: mockProducts.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3)
    }
  };
};