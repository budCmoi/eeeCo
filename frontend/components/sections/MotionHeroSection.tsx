import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { gsap, registerGsapPlugins } from '@/animations/gsap';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

type MotionHeroSectionProps = {
  products: Product[];
};

type HeroSlide = {
  product: Product;
  imageIndex: number;
  eyebrow: string;
  title: string;
  copy: string;
  description: string;
  ctaLabel: string;
  detailTitle: string;
  detailCopy: string;
  metrics: Array<{
    value: string;
    label: string;
  }>;
};

function buildHeroSlides(products: Product[]): HeroSlide[] {
  if (!products.length) {
    return [];
  }

  const fallback = products[0];
  const pickProduct = (slug: string, fallbackIndex: number) => products.find((product) => product.slug === slug) ?? products[fallbackIndex] ?? fallback;

  return [
    {
      product: pickProduct('aurora-coat', 0),
      imageIndex: 0,
      eyebrow: 'Edition 01 / opening silhouette',
      title: 'A slower opening silhouette.',
      copy: 'Aurora opens the homepage with a long, calm volume. The frame stays generous so the first impression feels clean instead of overloaded.',
      description: 'A calm frame with a clean silhouette.',
      ctaLabel: 'Open Aurora',
      detailTitle: 'Soft volume, clean entry.',
      detailCopy: 'A broad coat, a darker backdrop, and a slower rhythm give the first frame enough space to breathe on every screen size.',
      metrics: [
        { value: '06', label: 'slides' },
        { value: '9.8s', label: 'cadence' },
        { value: 'Aurora', label: 'look' }
      ]
    },
    {
      product: pickProduct('noir-tailored-blazer', 1),
      imageIndex: 0,
      eyebrow: 'Tailoring study / sharper pace',
      title: 'Tailoring with a sharper line.',
      copy: 'The blazer tightens the mood and brings more structure into the sequence. It keeps the rotation crisp without making the page feel busy.',
      description: 'Sharper tailoring with a quieter rhythm.',
      ctaLabel: 'Open Noir',
      detailTitle: 'Structure after softness.',
      detailCopy: 'A more compact cut resets the pace and keeps the hero balanced between softness, precision, and product clarity.',
      metrics: [
        { value: 'Tailoring', label: 'focus' },
        { value: 'Sharp', label: 'tone' },
        { value: 'Edition 01', label: 'drop' }
      ]
    },
    {
      product: pickProduct('silk-column-dress', 2),
      imageIndex: 0,
      eyebrow: 'Evening line / fluid contrast',
      title: 'Fluid evening contrast.',
      copy: 'A softer frame shifts the sequence out of pure tailoring. That change keeps the homepage lighter and easier to read in motion.',
      description: 'A lighter scene with soft evening movement.',
      ctaLabel: 'Open Silk',
      detailTitle: 'Lighter line, calmer frame.',
      detailCopy: 'The silk scene introduces vertical calm and cleaner light so the loop does not stay stuck in one visual temperature.',
      metrics: [
        { value: 'Fluid', label: 'movement' },
        { value: 'Soft light', label: 'material' },
        { value: 'Edition 02', label: 'drop' }
      ]
    },
    {
      product: pickProduct('monolith-boots', 4),
      imageIndex: 2,
      eyebrow: 'Accessory cut / grounded detail',
      title: 'Closer focus on product.',
      copy: 'A tighter accessory frame gives the hero a stronger product beat. It breaks the rhythm in a way that feels simple and intentional.',
      description: 'A denser product focus with stronger contrast.',
      ctaLabel: 'Open Boots',
      detailTitle: 'A denser interruption.',
      detailCopy: 'Boots compress the image, add contrast, and stop the rotation from feeling like the same silhouette over and over.',
      metrics: [
        { value: 'Accessory', label: 'type' },
        { value: 'Leather', label: 'surface' },
        { value: 'Portugal', label: 'origin' }
      ]
    },
    {
      product: pickProduct('leather-tote-09', 5),
      imageIndex: 0,
      eyebrow: 'Daily object / luxury utility',
      title: 'Quiet utility, cleaner rhythm.',
      copy: 'The tote brings in an object-led moment and gives the loop a quieter luxury beat. That keeps the page varied without adding clutter.',
      description: 'Quiet utility with a more grounded mood.',
      ctaLabel: 'Open Tote',
      detailTitle: 'Object-first scene building.',
      detailCopy: 'This frame shifts attention toward finish, scale, and everyday use so the rotation feels broader and more believable.',
      metrics: [
        { value: 'Quiet', label: 'mood' },
        { value: 'Structured', label: 'shape' },
        { value: 'Edition 03', label: 'drop' }
      ]
    },
    {
      product: pickProduct('contour-trouser', 6),
      imageIndex: 0,
      eyebrow: 'Motion frame / closing stride',
      title: 'A moving lookbook finish.',
      copy: 'The closing scene leans back into movement and proportion. It gives the loop a cleaner exit before it returns to the opening look.',
      description: 'A precise closing look with forward motion.',
      ctaLabel: 'Open Contour',
      detailTitle: 'Controlled motion at the end.',
      detailCopy: 'The trouser closes the sequence with a more directional stride so the restart feels deliberate rather than repetitive.',
      metrics: [
        { value: 'Looped', label: 'behavior' },
        { value: 'Forward', label: 'mood' },
        { value: 'Graphite', label: 'tone' }
      ]
    }
  ];
}

function getSlideImage(slide: HeroSlide) {
  return slide.product.images[slide.imageIndex] ?? slide.product.images[0];
}

const heroImageTransition = {
  duration: 2.2,
  ease: [0.22, 1, 0.36, 1] as const
};

const heroContentTransition = {
  duration: 1.2,
  ease: [0.22, 1, 0.36, 1] as const
};

export function MotionHeroSection({ products }: MotionHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = buildHeroSlides(products);

  useEffect(() => {
    if (activeSlideIndex < slides.length) {
      return;
    }

    setActiveSlideIndex(0);
  }, [activeSlideIndex, slides.length]);

  useEffect(() => {
    if (typeof window === 'undefined' || slides.length <= 1 || isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 9800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused, slides.length]);

  useEffect(() => {
    if (!sectionRef.current || typeof window === 'undefined') {
      return;
    }

    registerGsapPlugins();

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.35
        }
      });

      timeline
        .to(mediaRef.current, { scale: 1.02, yPercent: 5 }, 0)
        .to(introRef.current, { yPercent: -4 }, 0)
        .to(detailsRef.current, { yPercent: -2 }, 0.05);
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  if (!slides.length) {
    return null;
  }

  const activeSlide = slides[activeSlideIndex] ?? slides[0];
  const activeProduct = activeSlide.product;
  const primaryImage = getSlideImage(activeSlide);

  return (
    <section
      ref={sectionRef}
      className="relative px-4 md:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-4 rounded-[1.8rem] bg-[#0c0d0d] p-4 shadow-[0_24px_72px_rgba(0,0,0,0.28)] md:p-5 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
          <div ref={mediaRef} className="relative min-h-[21rem] overflow-hidden rounded-[1.35rem] bg-[#111111] sm:min-h-[27rem] lg:min-h-[36rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeProduct.slug}-${activeSlideIndex}`}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={heroImageTransition}
                className="absolute inset-0"
              >
                <Image
                  src={primaryImage.src}
                  alt={primaryImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col justify-end rounded-[1.35rem] bg-[#131515] p-5 sm:p-6 lg:justify-between lg:p-8">
            <div ref={introRef} className="relative hidden lg:block">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`copy-${activeProduct.slug}-${activeSlideIndex}`}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={heroContentTransition}
                >
                  <p className="eyebrow">{activeSlide.eyebrow}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.66rem] uppercase tracking-[0.18em] text-ivory/46 sm:gap-4">
                    <span>{activeProduct.name}</span>
                    <span className="h-1 w-1 rounded-full bg-ivory/20" />
                    <span>{activeProduct.collection}</span>
                    <span className="h-1 w-1 rounded-full bg-ivory/20" />
                    <span>{formatPrice(activeProduct.price)}</span>
                  </div>

                  <p className="mt-5 max-w-[14ch] text-balance font-display text-[1.55rem] leading-[0.96] text-ivory xl:text-[2.35rem]">
                    {activeSlide.title}
                  </p>

                  <p className="mt-4 max-w-[34rem] text-[0.92rem] leading-6 text-ivory/70 xl:text-[0.96rem] xl:leading-7">
                    {activeSlide.copy}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-7 lg:mt-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`cta-${activeProduct.slug}-${activeSlideIndex}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4 lg:hidden"
                >
                  <p className="max-w-sm text-sm leading-6 text-ivory/66 sm:text-[0.95rem]">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <Link href={`/product/${activeProduct.slug}`}>
                <Button variant="secondary" className="gap-2 !border-0">
                  {activeSlide.ctaLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`detail-${activeProduct.slug}-${activeSlideIndex}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={heroContentTransition}
                  className="mt-6 hidden rounded-[1.2rem] bg-black/18 p-4 lg:block xl:p-5"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-ivory/44">Scene set</p>
                  <p className="mt-3 text-[1rem] leading-tight text-ivory xl:text-[1.14rem]">{activeSlide.detailTitle}</p>
                  <p className="mt-3 text-sm leading-6 text-ivory/64">{activeSlide.detailCopy}</p>
                </motion.div>
              </AnimatePresence>

              <div ref={detailsRef} className="mt-6 hidden grid-cols-2 gap-3 lg:grid xl:grid-cols-3">
                {activeSlide.metrics.map((item) => (
                  <div key={item.label} className="rounded-[1rem] bg-black/16 px-4 py-4">
                    <p className="text-[1.05rem] leading-none text-ivory xl:text-[1.18rem]">{item.value}</p>
                    <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-ivory/44">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}