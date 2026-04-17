import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, ShoppingBag, UserRound, X } from 'lucide-react';

import { cn } from '@/lib/format';
import { getCartCount, useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

const baseLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/account', label: 'Account' }
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8">
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1440px] items-center justify-between rounded-full px-5 py-3 transition-all duration-500 md:px-7',
          isScrolled
            ? 'bg-black/72 text-white shadow-[0_20px_60px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl'
            : 'bg-black/36 text-white shadow-[0_24px_72px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl'
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            className={cn(
              'hidden px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] md:inline-flex',
              isScrolled ? 'text-white/54' : 'text-white/54'
            )}
          >
            Edition 03
          </div>
          <div>
            <span className="block font-display text-[1.55rem] leading-none">EEECO</span>
            <span
              className={cn(
                'hidden text-[0.6rem] uppercase tracking-[0.28em] md:block',
                isScrolled ? 'text-white/46' : 'text-white/46'
              )}
            >
              Motion Commerce
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-white md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors duration-300',
                'hover:text-white',
                router.pathname === link.href ? 'text-white' : 'text-white/76'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors',
              isScrolled ? 'text-white/78 hover:text-white' : 'text-white/78 hover:text-white'
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{cartCount}</span>
          </Link>

          <Link
            href="/account"
            className={cn(
              'hidden rounded-full p-2.5 transition-colors md:inline-flex',
              isScrolled ? 'text-white/78 hover:text-white' : 'text-white/78 hover:text-white'
            )}
          >
            <UserRound className="h-4 w-4" />
          </Link>

          <button
            type="button"
            className={cn(
              'inline-flex rounded-full p-2.5 text-white md:hidden',
              isScrolled ? 'text-white' : 'text-white'
            )}
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-[#050505]/96 text-white backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-6 pb-8 pt-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="text-left">
                  <div className="text-[0.68rem] uppercase tracking-[0.26em] text-white/42">Navigation</div>
                  <div className="mt-2 font-display text-[1.5rem] leading-none text-white">EEECO</div>
                </div>

                <button
                  type="button"
                  className="inline-flex rounded-full bg-white/6 p-2.5 text-white transition-colors hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-between pt-8">
                <nav className="flex flex-col items-start gap-2 text-left">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex w-full items-center justify-between rounded-[1.2rem] px-1 py-4 font-display text-[2.1rem] leading-none text-white transition-colors hover:text-white/72"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  ))}
                </nav>

                <div className="mt-10 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.22em] text-white/40">
                    <span>Edition 03</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>Motion Commerce</span>
                  </div>

                  <div className="mt-5 flex flex-col items-start gap-3 text-left">
                    <Link
                      href="/cart"
                      className="flex items-center gap-3 rounded-full bg-white/6 px-4 py-3 text-sm text-white/82 transition-colors hover:bg-white/10 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Cart</span>
                      <span className="text-white/48">{cartCount}</span>
                    </Link>

                    <Link
                      href="/account"
                      className="flex items-center gap-3 rounded-full bg-white/6 px-4 py-3 text-sm text-white/82 transition-colors hover:bg-white/10 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserRound className="h-4 w-4" />
                      <span>Account</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}