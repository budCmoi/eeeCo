import Image from 'next/image';
import { FormEvent, useRef, useState } from 'react';

import { useParallax } from '@/animations/useParallax';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

type PrivateListSectionProps = {
  products: Product[];
};

export function PrivateListSection({ products }: PrivateListSectionProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useParallax(backgroundRef, 7);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
    setEmail('');
  }

  return (
    <section className="px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-14">
      <div className="mx-auto relative min-h-[40rem] max-w-[1440px] overflow-hidden rounded-[2.8rem] border border-white/8 px-6 py-8 md:px-10 md:py-10">
        <div ref={backgroundRef} className="absolute inset-0">
          <Image
            src={products[6].images[0].src}
            alt={products[6].images[0].alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(197,208,202,0.72),rgba(10,10,10,0.16)_42%,rgba(5,5,5,0.84))]" />

        <div className="relative z-10 grid min-h-[calc(40rem-4rem)] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-2xl text-black">
            <p className="eyebrow !text-black/55">Private list</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-none md:text-6xl">
              Enter the inner release note before the rest of the timeline catches up.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-black/72 md:text-base">
              Use this as your cinematic newsletter block: muted image treatment, strong form panel, and copy that feels like access instead of discount marketing.
            </p>

            <div className="mt-8 grid gap-4 text-sm text-black/74 sm:grid-cols-3">
              {['Early drop access', 'Editorial release notes', 'Private capsule alerts'].map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-black/10 bg-white/35 px-4 py-4 backdrop-blur-lg">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="motion-panel self-end rounded-[2rem] p-6 md:p-8">
            <p className="eyebrow">Subscription</p>
            <h3 className="mt-4 max-w-xl font-display text-3xl leading-none text-ivory md:text-5xl">
              Join a quieter, sharper kind of launch list.
            </h3>

            <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Write your email address"
                className="w-full rounded-[1.25rem] border border-white/10 bg-white/[0.06] px-4 py-4 text-sm text-ivory outline-none placeholder:text-ivory/34 focus:border-white/20"
              />
              <Button type="submit">Submit</Button>
            </div>

            <p className="mt-4 text-sm leading-7 text-ivory/60">
              {submitted
                ? 'You are on the private list. Keep the form wired to your email provider when you move this into production.'
                : 'The form is currently a frontend interaction placeholder so the section feels complete during local review.'}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}