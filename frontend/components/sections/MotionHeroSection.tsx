import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { gsap, registerGsapPlugins } from '@/animations/gsap';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

type MotionHeroSectionProps = {
  products: Product[];
};

type HeroSlide = {
  product: Product;
  imageIndex: number;
  description: string;
  ctaLabel: string;
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
      description: 'A calm frame with a clean silhouette.',
      ctaLabel: 'Open Aurora'
    },
    {
      product: pickProduct('noir-tailored-blazer', 1),
      imageIndex: 0,
      description: 'Sharper tailoring with a quieter rhythm.',
      ctaLabel: 'Open Noir'
    },
    {
      product: pickProduct('silk-column-dress', 2),
      imageIndex: 0,
      description: 'A lighter scene with soft evening movement.',
      ctaLabel: 'Open Silk'
    },
    {
      product: pickProduct('monolith-boots', 4),
      imageIndex: 2,
      description: 'A denser product focus with stronger contrast.',
      ctaLabel: 'Open Boots'
    },
    {
      product: pickProduct('leather-tote-09', 5),
      imageIndex: 0,
      description: 'Quiet utility with a more grounded mood.',
      ctaLabel: 'Open Tote'
    },
    {
      product: pickProduct('contour-trouser', 6),
      imageIndex: 0,
      description: 'A precise closing look with forward motion.',
      ctaLabel: 'Open Contour'
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

export function MotionHeroSection({ products }: MotionHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
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

      timeline.to(mediaRef.current, { scale: 1.02, yPercent: 5 }, 0);
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

          <div className="flex items-end rounded-[1.35rem] bg-[#131515] p-5 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`cta-${activeProduct.slug}-${activeSlideIndex}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <p className="max-w-sm text-sm leading-6 text-ivory/66 sm:text-[0.95rem]">
                  {activeSlide.description}
                </p>
                <Link href={`/product/${activeProduct.slug}`}>
                  <Button variant="secondary" className="gap-2 !border-0">
                    {activeSlide.ctaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}