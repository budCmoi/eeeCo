import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { ProductCard } from '@/components/shop/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { SectionIntro } from '@/components/ui/SectionIntro';
import type { Product } from '@/types';

type FeaturedProductsSectionProps = {
  products: Product[];
};

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionIntro
              eyebrow="Featured capsule"
              title="The edit is concise, sharp, and materially focused."
              copy="Selected products surface first, while the grid remains intentionally breathable and tactile."
            />
          </Reveal>

          <Reveal className="md:pb-3">
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-ivory/72 transition-colors hover:text-ivory">
              View full shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}