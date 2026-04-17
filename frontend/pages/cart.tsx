import Image from 'next/image';
import Link from 'next/link';

import { Minus, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';
import { getCartSubtotal, useCartStore } from '@/store/cart-store';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = getCartSubtotal(items);
  const shipping = subtotal > 1000 ? 0 : items.length > 0 ? 25 : 0;
  const total = subtotal + shipping;

  if (!items.length) {
    return (
      <section className="px-4 pb-16 pt-6 md:px-8 md:pb-24">
        <div className="mx-auto max-w-[980px] rounded-[2.4rem] border border-white/8 bg-white/[0.03] px-6 py-14 text-center md:px-10 md:py-20">
          <p className="eyebrow">Cart</p>
          <h1 className="mt-4 font-display text-5xl text-ivory md:text-6xl">Your cart is currently empty.</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-ivory/66 md:text-base">
            Use the premium product pages to add pieces, adjust sizing, and continue into the checkout flow.
          </p>
          <Link href="/shop" className="mt-8 inline-block">
            <Button>Browse the shop</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-16 pt-6 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="eyebrow">Cart</p>
            <h1 className="mt-4 font-display text-5xl text-ivory md:text-6xl">Curated pieces, ready for checkout.</h1>

            <div className="mt-10 space-y-4">
              {items.map((item) => (
                <div key={`${item.product.slug}-${item.size}`} className="grid gap-4 rounded-[1.8rem] border border-white/8 bg-white/[0.02] p-4 md:grid-cols-[180px_1fr] md:p-5">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                    <Image src={item.product.images[0].src} alt={item.product.images[0].alt} fill sizes="180px" className="object-cover" />
                  </div>

                  <div className="flex flex-col justify-between gap-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-lg text-ivory">{item.product.name}</p>
                        <p className="mt-1 text-sm text-ivory/58">Size {item.size}</p>
                        <p className="mt-1 text-sm text-ivory/58">{item.product.collection}</p>
                      </div>
                      <p className="text-sm text-ivory/82">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/8 px-3 py-2">
                        <button type="button" onClick={() => updateQuantity(item.product.slug, item.size, item.quantity - 1)}>
                          <Minus className="h-4 w-4 text-ivory/72" />
                        </button>
                        <span className="min-w-8 text-center text-sm text-ivory">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.product.slug, item.size, item.quantity + 1)}>
                          <Plus className="h-4 w-4 text-ivory/72" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.slug, item.size)}
                        className="inline-flex items-center gap-2 text-sm text-ivory/58 transition-colors hover:text-ivory"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
              <p className="eyebrow">Summary</p>
              <div className="mt-8 space-y-4 text-sm text-ivory/70">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/8 pt-4 text-base text-ivory">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link href="/checkout" className="block">
                  <Button fullWidth>Proceed to checkout</Button>
                </Link>
                <Link href="/shop" className="block">
                  <Button fullWidth variant="secondary">Continue shopping</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}