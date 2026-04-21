import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

import { cn, formatLabel } from '@/lib/format';
import type { Product } from '@/types';

type ProductGallerySharedProps = {
  product: Product;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

type ImagePanel = {
  label: string;
  title: string;
  copy: string;
  metaLabel: string;
  meta: string;
  detailLabel: string;
  detail: string;
};

type AnimeModule = typeof import('animejs');

function buildImagePanels(product: Product): ImagePanel[] {
  return product.images.map((image, index) => {
    const collectionLabel = product.collection ?? formatLabel(product.category);
    const primaryDetail = product.details[index] ?? product.details[0];
    const secondaryDetail = product.details[(index + 1) % product.details.length] ?? product.description;
    const tertiaryDetail = product.details[(index + 2) % product.details.length] ?? collectionLabel;

    if (index === 0) {
      return {
        label: 'Hero frame',
        title: product.name,
        copy: `${product.description} This opening frame is meant to slow the reading of the garment down, so the shoulder line, length, and overall fall of the piece feel deliberate rather than simply functional. It sets the tone for the rest of the product story and gives the silhouette enough room to register properly on screen.`,
        metaLabel: 'Frame detail',
        meta: collectionLabel,
        detailLabel: 'Construction note',
        detail: `Built around ${primaryDetail.toLowerCase()}, finished with ${secondaryDetail.toLowerCase()}, and balanced by ${tertiaryDetail.toLowerCase()}, this first view focuses on structure before moving into texture and styling.`
      };
    }

    if (index === 1) {
      return {
        label: 'Material focus',
        title: primaryDetail,
        copy: `${secondaryDetail} comes forward here, but the purpose of this frame is really to show how the surface behaves up close. Texture, finish, and light absorption become part of the luxury read, giving more weight to the tactility of the piece and the way it holds presence without needing excess ornament.`,
        metaLabel: 'Palette',
        meta: product.colors.join(' / '),
        detailLabel: 'Material note',
        detail: `The combination of ${primaryDetail.toLowerCase()}, ${secondaryDetail.toLowerCase()}, and ${tertiaryDetail.toLowerCase()} gives the product a cleaner, more composed finish when viewed at close range.`
      };
    }

    return {
      label: 'Wear note',
      title: primaryDetail,
      copy: `Made to sit naturally inside a ${formatLabel(product.category)} wardrobe, this frame shows how the piece keeps its line while moving through a fuller silhouette read. The intention is not only to show the garment from another angle, but to communicate how it lands in motion, how the volume settles, and why the proportions feel premium rather than overworked.`,
      metaLabel: 'Edition sequence',
      meta: `${String(index + 1).padStart(2, '0')} / ${product.images.length}`,
      detailLabel: 'Styling note',
      detail: `Released in a run of ${product.inventory} units, this view reinforces the balance between ${primaryDetail.toLowerCase()}, ${secondaryDetail.toLowerCase()}, and the calmer presence of ${tertiaryDetail.toLowerCase()} in wear.`
    };
  });
}

export function ProductGalleryLead({ product, activeIndex = 0 }: ProductGallerySharedProps) {
  const [origin, setOrigin] = useState('50% 50%');
  const imagePanels = buildImagePanels(product);
  const safeActiveIndex = product.images[activeIndex] ? activeIndex : 0;
  const activeImage = product.images[safeActiveIndex];
  const activePanel = imagePanels[safeActiveIndex] ?? imagePanels[0];

  return (
    <div
      className="group relative aspect-[4/5] overflow-hidden rounded-[2.25rem] bg-[#0f0f0f] shadow-[0_24px_80px_rgba(0,0,0,0.34)]"
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        setOrigin(`${x}% ${y}%`);
      }}
    >
      <Image
        src={activeImage.src}
        alt={activeImage.alt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.12]"
        style={{ transformOrigin: origin }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      <div className="absolute inset-x-5 bottom-5 rounded-[1.6rem] bg-black/25 px-5 py-4 backdrop-blur-2xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{activePanel.label}</p>
            <p className="mt-2 font-display text-[1.8rem] leading-none text-ivory md:text-[2.2rem]">{activePanel.title}</p>
          </div>
          <p className="text-sm text-ivory/54">{String(safeActiveIndex + 1).padStart(2, '0')} / {String(product.images.length).padStart(2, '0')}</p>
        </div>
      </div>
    </div>
  );
}

export function ProductGalleryStory({ product, activeIndex = 0, onActiveIndexChange }: ProductGallerySharedProps) {
  const imagePanels = buildImagePanels(product);
  const animeModuleRef = useRef<AnimeModule | null>(null);
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const revealedFramesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let isMounted = true;

    revealedFramesRef.current = new Set();

    void import('animejs').then((anime) => {
      if (!isMounted) {
        return;
      }

      animeModuleRef.current = anime;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const index = Number((entry.target as HTMLDivElement).dataset.index ?? '-1');

            if (Number.isNaN(index)) {
              return;
            }

            onActiveIndexChange?.(index);

            if (revealedFramesRef.current.has(index)) {
              return;
            }

            revealedFramesRef.current.add(index);
            anime.animate(entry.target, {
              opacity: [0.62, 1],
              scale: [1.14, 1],
              translateY: ['12%', '0%'],
              duration: 1200,
              ease: 'outExpo'
            });
          });
        },
        {
          threshold: 0.38,
          rootMargin: '0px 0px -10% 0px'
        }
      );

      mediaRefs.current.forEach((node, index) => {
        if (!node) {
          return;
        }

        node.dataset.index = String(index);
        observer?.observe(node);
      });
    });

    return () => {
      isMounted = false;
      observer?.disconnect();
    };
  }, [onActiveIndexChange, product.slug]);

  const animateMedia = (index: number, scale: number, translateY: string) => {
    const anime = animeModuleRef.current;
    const node = mediaRefs.current[index];

    if (!anime || !node) {
      return;
    }

    anime.animate(node, {
      scale,
      translateY,
      duration: 650,
      ease: 'outCubic'
    });
  };

  return (
    <div className="grid gap-8">
      {product.images.map((image, index) => (
        <motion.article
          key={image.src}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => {
            onActiveIndexChange?.(index);
            animateMedia(index, 1.04, '-1.5%');
          }}
          onMouseLeave={() => animateMedia(index, 1, '0%')}
          onViewportEnter={() => onActiveIndexChange?.(index)}
          className={cn(
            'group grid min-h-[100svh] w-full gap-8 rounded-[2.8rem] bg-white/[0.05] px-5 py-6 shadow-[0_22px_64px_rgba(0,0,0,0.22)] backdrop-blur-2xl md:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-center lg:gap-12 lg:px-10',
            activeIndex === index ? 'bg-white/[0.09]' : 'hover:bg-white/[0.06]'
          )}
        >
          <div
            className={cn(
              'relative min-h-[62vh] overflow-hidden rounded-[2.2rem] bg-[#111111] shadow-[0_28px_80px_rgba(0,0,0,0.28)] lg:h-[84vh] lg:min-h-0',
              index % 2 === 1 && 'lg:order-2'
            )}
          >
            <div
              ref={(node) => {
                mediaRefs.current[index] = node;
              }}
              className="relative h-full w-full will-change-transform"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />
          </div>

          <div className={cn('flex flex-col justify-center gap-6 lg:px-8', index % 2 === 1 && 'lg:order-1')}>
            <div>
              <p className="eyebrow">{imagePanels[index].label}</p>
              <h3 className="mt-3 max-w-3xl font-display text-[2.4rem] leading-[0.92] text-ivory md:text-[3.2rem] lg:text-[4.3rem]">
                {imagePanels[index].title}
              </h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ivory/66 md:text-[1.02rem]">
                {imagePanels[index].copy}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.7rem] bg-black/18 px-5 py-5 shadow-[0_16px_44px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.18em] text-ivory/42">{imagePanels[index].metaLabel}</p>
                <p className="mt-3 text-base text-ivory/82">{imagePanels[index].meta}</p>
              </div>
              <div className="rounded-[1.7rem] bg-black/18 px-5 py-5 shadow-[0_16px_44px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.18em] text-ivory/42">{imagePanels[index].detailLabel}</p>
                <p className="mt-3 text-base leading-7 text-ivory/82">{imagePanels[index].detail}</p>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}