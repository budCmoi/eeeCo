import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import { ProductCard } from '@/components/shop/ProductCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { fetchProducts } from '@/services/products';
import { api } from '@/services/api';
import type { Category, Product, ProductFilters as ProductFiltersType } from '@/types';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Mis en avant' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' }
];

const DELIVERY_OPTIONS = [
  { value: '', label: 'Tous délais' },
  { value: '2', label: '≤ 2 jours' },
  { value: '5', label: '≤ 5 jours' },
  { value: '10', label: '≤ 10 jours' }
];

export default function ShopPage() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<ProductFiltersType>({
    sort: 'featured',
    search: router.query.search as string | undefined,
    category: router.query.category as string | undefined
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    api.get<Category[]>('/categories').then((res) => setCategories(res.data ?? []));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProducts(filters)
      .then((items) => { if (active) setProducts(items); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filters]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput.trim() || undefined }));
  }

  function applyPriceFilter() {
    setFilters((f) => ({
      ...f,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    }));
  }

  function clearFilters() {
    setFilters({ sort: 'featured' });
    setSearchInput('');
    setMinPrice('');
    setMaxPrice('');
  }

  const hasActiveFilters =
    filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.delivery;

  return (
    <>
      <Head>
        <title>Boutique — EEECO</title>
        <meta name="description" content="Découvrez notre sélection de vêtements, chaussures et accessoires." />
      </Head>

      <div className="min-h-screen px-4 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <p className="eyebrow mb-2">Boutique</p>
            <h1 className="font-display text-4xl text-white md:text-6xl">
              {filters.category ? filters.category : 'Tout parcourir'}
            </h1>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative flex max-w-xl items-center">
              <Search className="absolute left-4 h-4 w-4 text-white/30" />
              <input
                ref={searchRef}
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Rechercher un article, une marque…"
                className="input-base pl-11 pr-12"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setFilters((f) => ({ ...f, search: undefined })); }}
                  className="absolute right-4 text-white/30 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters((f) => ({ ...f, category: undefined }))}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                  !filters.category
                    ? 'border-green-600 bg-green-600/20 text-green-light'
                    : 'border-white/10 text-white/50 hover:border-white/25'
                }`}
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters((f) => ({ ...f, category: cat.name }))}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                    filters.category === cat.name
                      ? 'border-green-600 bg-green-600/20 text-green-light'
                      : 'border-white/10 text-white/50 hover:border-white/25'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                  showFilters ? 'border-green-600/50 text-green-light' : 'border-white/10 text-white/50'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtres
                {hasActiveFilters && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[0.55rem] text-white">
                    !
                  </span>
                )}
              </button>

              <select
                value={filters.sort ?? 'featured'}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as ProductFiltersType['sort'] }))}
                className="rounded-full border border-white/10 bg-transparent px-3.5 py-1.5 text-xs text-white/50 outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-surface text-white">
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtres avancés */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="grid gap-5 sm:grid-cols-3">
                    {/* Prix */}
                    <div>
                      <label className="mb-2 block text-xs text-white/50">Prix (€)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="input-base text-xs"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          min="0"
                        />
                        <span className="text-white/30">—</span>
                        <input
                          type="number"
                          placeholder="Max"
                          className="input-base text-xs"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          min="0"
                        />
                        <button
                          onClick={applyPriceFilter}
                          className="flex-shrink-0 rounded-xl border border-green-600/30 px-3 py-2.5 text-xs text-green-light hover:bg-green-600/10"
                        >
                          OK
                        </button>
                      </div>
                    </div>

                    {/* Délai livraison */}
                    <div>
                      <label className="mb-2 block text-xs text-white/50">Délai de livraison</label>
                      <div className="flex flex-wrap gap-2">
                        {DELIVERY_OPTIONS.map((o) => (
                          <button
                            key={o.value}
                            onClick={() => setFilters((f) => ({ ...f, delivery: o.value ? Number(o.value) : undefined }))}
                            className={`rounded-full border px-3 py-1 text-xs transition-all ${
                              (filters.delivery?.toString() ?? '') === o.value
                                ? 'border-green-600 bg-green-600/20 text-green-light'
                                : 'border-white/10 text-white/50'
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reset */}
                    <div className="flex items-end">
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                          Effacer les filtres
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <p className="mb-6 text-xs text-white/35">
            {loading ? 'Chargement…' : `${products.length} résultat${products.length > 1 ? 's' : ''}`}
          </p>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : products.map((product, i) => (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
          </div>

          {!loading && products.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-white/30">Aucun résultat trouvé</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-green-light underline underline-offset-4">
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


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