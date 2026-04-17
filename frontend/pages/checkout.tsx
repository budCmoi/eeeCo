import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';
import { createCheckoutSession } from '@/services/checkout';
import { useAuthStore } from '@/store/auth-store';
import { getCartSubtotal, useCartStore } from '@/store/cart-store';
import type { Address } from '@/types';

const initialAddress: Address = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  country: '',
  postalCode: ''
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const [address, setAddress] = useState<Address>({ ...initialAddress, email: user?.email ?? '' });
  const [submitting, setSubmitting] = useState(false);
  const subtotal = getCartSubtotal(items);
  const shipping = useMemo(() => (subtotal > 1000 ? 0 : items.length > 0 ? 25 : 0), [items.length, subtotal]);
  const total = subtotal + shipping;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!items.length) {
      return;
    }

    setSubmitting(true);

    const response = await createCheckoutSession({ items, address });

    if (response.mode === 'demo') {
      clearCart();
      await router.push('/account?payment=demo-success');
      return;
    }

    if (response.url) {
      window.location.href = response.url;
      return;
    }

    setSubmitting(false);
  }

  return (
    <section className="px-4 pb-16 pt-6 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
            <p className="eyebrow">Checkout</p>
            <h1 className="mt-4 font-display text-5xl text-ivory md:text-6xl">Secure checkout with Stripe.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-ivory/64 md:text-base">
              The backend exposes a Stripe Checkout session endpoint. Without keys configured, the flow gracefully falls back to demo mode for local exploration.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ['firstName', 'First name'],
                ['lastName', 'Last name'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['address1', 'Address line 1'],
                ['address2', 'Address line 2'],
                ['city', 'City'],
                ['country', 'Country'],
                ['postalCode', 'Postal code']
              ].map(([key, label]) => (
                <label key={key} className={key === 'address1' || key === 'address2' ? 'sm:col-span-2' : ''}>
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-ivory/48">{label}</span>
                  <input
                    required={key !== 'address2'}
                    value={address[key as keyof Address] ?? ''}
                    onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none placeholder:text-ivory/30 focus:border-white/20"
                  />
                </label>
              ))}
            </div>

            <Button className="mt-8" type="submit" disabled={submitting || !items.length}>
              {submitting ? 'Redirecting to Stripe...' : 'Complete purchase'}
            </Button>
          </form>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 md:p-8">
              <p className="eyebrow">Order summary</p>
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.slug}-${item.size}`} className="flex items-center justify-between gap-4 border-b border-white/8 pb-4 last:border-b-0">
                    <div>
                      <p className="text-sm text-ivory">{item.product.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ivory/46">{item.size} / x{item.quantity}</p>
                    </div>
                    <p className="text-sm text-ivory/78">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-white/8 pt-4 text-sm text-ivory/68">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-base text-ivory">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}