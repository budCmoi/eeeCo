import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';

import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';
import type { Category, Product } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ items: Product[] }>('/products?sort=featured'),
      api.get<{ items: Product[] }>('/products?sort=newest'),
      api.get<Category[]>('/categories')
    ])
      .then(([feat, newest, cats]) => {
        setFeaturedProducts((feat.data.items ?? []).slice(0, 4));
        setNewArrivals((newest.data.items ?? []).slice(0, 4));
        setCategories((cats.data ?? []).slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Background accent */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-green-600/10 blur-[120px]" />
          <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-brown-600/8 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-6"
          >
            Marketplace premium — Mode & lifestyle
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 font-display text-[3.2rem] leading-[0.95] text-white sm:text-[4.5rem] md:text-[6rem]"
          >
            Achetez et vendez{' '}
            <span className="text-green-light">des pièces uniques</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mb-10 max-w-xl text-sm leading-7 text-white/50 md:text-base"
          >
            Une plateforme élégante pour trouver des vêtements, chaussures et accessoires de qualité.
            Vendez vos pièces en quelques minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/shop">
              <Button className="gap-2 rounded-full px-8 py-3">
                Explorer la boutique
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sell">
              <Button variant="secondary" className="rounded-full px-8 py-3">
                Vendre un article
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute bottom-12 left-0 right-0 flex justify-center gap-12"
        >
          {[
            { value: '10k+', label: 'Articles' },
            { value: '2k+', label: 'Vendeurs' },
            { value: '4.9★', label: 'Satisfaction' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Categories ────────────────────────────────────── */}
      <section className="px-6 pb-24 pt-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-10 flex items-end justify-between"
          >
            <div>
              <p className="eyebrow mb-2">Parcourir par</p>
              <h2 className="font-display text-3xl text-white md:text-4xl">Catégories</h2>
            </div>
            <Link href="/shop" className="hidden text-sm text-white/50 transition-colors hover:text-white md:block">
              Tout voir →
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(categories.length > 0
              ? categories
              : Array.from({ length: 6 }, (_, i) => ({ id: String(i), name: '—', slug: '', description: '' }))
            ).map((cat, i) => (
              <motion.div
                key={cat.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group flex h-28 flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] transition-all duration-300 hover:border-green-600/40 hover:bg-green-50"
                >
                  <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                    {cat.name}
                  </span>
                  {cat._count && (
                    <span className="mt-1 text-xs text-white/30">{cat._count.products} articles</span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">Sélection</p>
              <h2 className="font-display text-3xl text-white md:text-4xl">Produits à la une</h2>
            </div>
            <Link href="/shop?sort=featured" className="hidden text-sm text-white/50 hover:text-white md:block">
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/[0.04]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────── */}
      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">Fraîchement arrivé</p>
              <h2 className="font-display text-3xl text-white md:text-4xl">Nouvelles arrivées</h2>
            </div>
            <Link href="/shop?sort=newest" className="hidden text-sm text-white/50 hover:text-white md:block">
              Voir tout →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {newArrivals.map((product, i) => (
              <motion.div
                key={product._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Banner ─────────────────────────────────── */}
      <section className="border-t border-white/8 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Achats sécurisés', desc: 'Paiements chiffrés et protection acheteur' },
            { icon: Truck, title: 'Livraison rapide', desc: 'Expédition en 2 à 5 jours selon le vendeur' },
            { icon: Zap, title: 'Vente en 2 min', desc: 'Publiez vos articles en quelques clics' }
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-600/30 bg-green-600/10">
                <Icon className="h-5 w-5 text-green-light" />
              </div>
              <h3 className="text-sm font-medium text-white">{title}</h3>
              <p className="text-xs leading-6 text-white/40">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Vendre ────────────────────────────────────── */}
      <section className="px-6 pb-24 pt-8 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-green-600/20 bg-green-600/8 px-8 py-16 text-center">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[600px] -translate-x-1/2 rounded-full bg-green-600/15 blur-[80px]" />
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="relative z-10"
            >
              <p className="eyebrow mb-4">Devenez vendeur</p>
              <h2 className="mb-4 font-display text-3xl text-white md:text-5xl">
                Transformez votre garde-robe<br />en revenus
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-sm leading-7 text-white/50">
                Publiez vos articles en quelques minutes et rejoignez des milliers de vendeurs qui
                génèrent des revenus sur EEECO.
              </p>
              <Link href="/sell">
                <Button className="rounded-full px-10 py-3">
                  Commencer à vendre
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
