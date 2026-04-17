import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="relative z-10 px-4 pb-10 pt-20 md:px-8">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[2.8rem] border border-white/8 bg-[#0b0c0b] px-6 py-10 md:px-10 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">EEECO / Motion Edition</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-none text-ivory md:text-6xl">
              Scroll slower. Choose sharper. Keep the interface memorable.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-ivory/64 md:text-base">
              The homepage has been redirected toward an interactive, editorial rhythm inspired by luxury drop sites, but rebuilt here with original motion, layout, and copy.
            </p>

            <div className="motion-outline mt-12 select-none font-display text-[20vw] leading-none text-transparent opacity-18 md:text-[10rem]">
              EEECO
            </div>
          </div>

          <div className="grid gap-8 text-sm text-ivory/62 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="eyebrow">Navigate</p>
              <Link href="/">Home</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/account">Account</Link>
            </div>
            <div className="space-y-3">
              <p className="eyebrow">Private routes</p>
              <Link href="/checkout">Checkout</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/admin-secret">Admin Secret</Link>
            </div>
            <div className="space-y-3 sm:col-span-2">
              <p className="eyebrow">Direction</p>
              <p className="max-w-xl leading-7 text-ivory/56">
                Tailwind handles the structure, Framer Motion handles micro-interaction, and GSAP with Lenis carries the scroll language. The result is calmer and more tailored than a generic e-commerce landing page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}