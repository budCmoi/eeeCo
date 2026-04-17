import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import { ProductCard } from '@/components/shop/ProductCard';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { featuredProducts } from '@/data/products';
import { fetchProducts } from '@/services/products';
import type { Product, ProductFilters as ProductFiltersType } from '@/types';

export default function ShopPage() {
  const [filters, setFilters] = useState<ProductFiltersType>({ sort: 'featured' });
  const [products, setProducts] = useState<Product[]>(featuredProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      const nextProducts = await fetchProducts(filters);

      if (active) {
        setProducts(nextProducts);
        setLoading(false);
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <section className="px-4 pb-16 pt-6 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-6 border-b border-white/8 pb-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="eyebrow">Shop</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-none text-ivory md:text-7xl">A premium catalog designed to breathe.</h1>
          </div>
          <p className="max-w-lg text-sm leading-7 text-ivory/64 md:justify-self-end md:text-base">
            Filters, sorting, and hover states stay refined and lightweight while the grid remains highly visual, spacious, and responsive.
          </p>
        </div>

        <div className="mt-8">
          <ProductFilters filters={filters} onChange={setFilters} resultCount={products.length} />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : products.map((product, index) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}