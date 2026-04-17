import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export function CtaSection() {
  return (
    <section className="px-4 pb-16 pt-8 md:px-8 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[2.6rem] border border-white/8 bg-[#111111] px-6 py-12 md:px-10 md:py-16">
        <Reveal className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow">Final call</p>
            <h2 className="mt-4 max-w-4xl font-display text-4xl leading-none text-ivory md:text-6xl">
              Built for limited drops, premium capsules, and modern luxury commerce.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-ivory/64 md:text-base">
              The stack is ready for production wiring: Stripe, MongoDB, Google OAuth, Cloudinary uploads, and role-protected admin workflows.
            </p>
          </div>

          <div className="surface-panel rounded-[1.8rem] p-5 md:p-6">
            <p className="text-sm text-ivory/72">Launch a curated purchase journey with premium scroll and scalable backend foundations.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop">
                <Button fullWidth>Open shop</Button>
              </Link>
              <Link href="/admin-secret">
                <Button fullWidth variant="secondary">Open admin panel</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}