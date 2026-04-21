import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, MessageSquare, Menu, PlusCircle, ShoppingBag, UserRound, X } from 'lucide-react';

import { cn } from '@/lib/format';
import { getCartCount, useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

const baseLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/shop', label: 'Boutique' },
  { href: '/account', label: 'Mon compte' }
];

export function SiteHeader() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const cartCount = getCartCount(items);
  const links = user?.role === 'admin' ? [...baseLinks, { href: '/admin-secret', label: 'Admin' }] : baseLinks;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8">
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1440px] items-center justify-between rounded-full px-5 py-3 transition-all duration-500 md:px-7',
          isScrolled
            ? 'bg-black/80 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl'
            : 'bg-black/50 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-display text-[1.45rem] leading-none tracking-tight text-white">EEECO</span>
            <span className="hidden text-[0.55rem] uppercase tracking-[0.28em] text-white/40 md:block">
              Marketplace
            </span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors duration-200 hover:text-white',
                router.pathname === link.href ? 'text-white' : 'text-white/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {user && (
            <>
              <Link
                href="/sell"
                className="hidden items-center gap-1.5 rounded-full bg-green-600/20 px-3.5 py-2 text-xs text-green-light transition-colors hover:bg-green-600/35 md:flex"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Vendre
              </Link>
              <Link
                href="/messages"
                className="rounded-full p-2.5 text-white/60 transition-colors hover:text-white"
                title="Messages"
              >
                <MessageSquare className="h-4 w-4" />
              </Link>
            </>
          )}

          <Link
            href="/cart"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[0.6rem] text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className="hidden rounded-full p-2.5 text-white/60 transition-colors hover:text-white md:inline-flex"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-5 w-5 rounded-full object-cover" />
            ) : (
              <UserRound className="h-4 w-4" />
            )}
          </Link>

          <button
            type="button"
            className="inline-flex rounded-full p-2.5 text-white md:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-canvas/96 text-white backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-6 pb-8 pt-6">
              <div className="flex items-center justify-between border-b border-white/8 pb-5">
                <span className="font-display text-[1.5rem] leading-none">EEECO</span>
                <button
                  type="button"
                  className="rounded-full bg-white/6 p-2.5 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-between pt-8">
                <nav className="flex flex-col gap-1">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between rounded-2xl px-1 py-4 font-display text-[2rem] leading-none text-white transition-colors hover:text-white/70"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                      <ArrowUpRight className="h-5 w-5 text-white/30" />
                    </Link>
                  ))}
                  {user && (
                    <>
                      <Link
                        href="/sell"
                        className="flex items-center justify-between rounded-2xl px-1 py-4 font-display text-[2rem] leading-none text-green-light transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Vendre
                        <PlusCircle className="h-5 w-5" />
                      </Link>
                      <Link
                        href="/messages"
                        className="flex items-center justify-between rounded-2xl px-1 py-4 font-display text-[2rem] leading-none text-white transition-colors hover:text-white/70"
                        onClick={() => setIsOpen(false)}
                      >
                        Messages
                        <MessageSquare className="h-5 w-5 text-white/30" />
                      </Link>
                    </>
                  )}
                </nav>

                <div className="flex items-center gap-4 border-t border-white/8 pt-6">
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 rounded-full bg-white/6 px-4 py-3 text-sm text-white/80"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Panier ({cartCount})
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 rounded-full bg-white/6 px-4 py-3 text-sm text-white/80"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserRound className="h-4 w-4" />
                    Compte
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}