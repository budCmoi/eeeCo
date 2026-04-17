import type { Order, Product } from '@/types';

export const mockProducts: Product[] = [
  {
    _id: 'prod-aurora-coat',
    slug: 'aurora-coat',
    name: 'Aurora Wool Coat',
    category: 'outerwear',
    collection: 'Edition 01',
    price: 1290,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Ivory', 'Charcoal'],
    description: 'A floor-skimming wool coat cut with architectural shoulders and a calm, elongated drape.',
    details: ['Italian wool blend', 'Satin lining', 'Concealed placket', 'Made in limited release'],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Aurora coat front view'
      },
      {
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
        alt: 'Aurora coat detail'
      },
      {
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
        alt: 'Aurora coat back view'
      }
    ],
    featured: true,
    newArrival: true,
    inventory: 8
  },
  {
    _id: 'prod-noir-blazer',
    slug: 'noir-tailored-blazer',
    name: 'Noir Tailored Blazer',
    category: 'tailoring',
    collection: 'Edition 01',
    price: 940,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    description: 'Sharp lapels, softened structure, and a compact silhouette intended to anchor the uniform.',
    details: ['Wool suiting fabric', 'Horn buttons', 'Interior welt pocket', 'Half-canvas construction'],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Noir blazer portrait'
      },
      {
        src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Noir blazer detail'
      },
      {
        src: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80',
        alt: 'Noir blazer side profile'
      }
    ],
    featured: true,
    inventory: 12
  },
  {
    _id: 'prod-silk-column',
    slug: 'silk-column-dress',
    name: 'Silk Column Dress',
    category: 'dresses',
    collection: 'Edition 02',
    price: 1180,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Moon', 'Ink'],
    description: 'Liquid silk lines the body in a clean column, finished with a quiet open back and precise straps.',
    details: ['Double-faced silk', 'Bias cut', 'Invisible side zip', 'Dry clean only'],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Silk dress full look'
      },
      {
        src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Silk dress texture'
      },
      {
        src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Silk dress side view'
      }
    ],
    newArrival: true,
    inventory: 6
  },
  {
    _id: 'prod-cashmere-knit',
    slug: 'cashmere-knit-ivory',
    name: 'Cashmere Knit Ivory',
    category: 'knitwear',
    collection: 'Edition 02',
    price: 520,
    originalPrice: 680,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Ivory'],
    description: 'A compact cashmere layer spun for warmth without weight, finished with elongated cuffs.',
    details: ['100% cashmere', 'Ribbed funnel neck', 'Relaxed shoulder line', 'Hand-finished seams'],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cashmere knit close-up'
      },
      {
        src: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cashmere knit editorial'
      },
      {
        src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cashmere knit styling'
      }
    ],
    inventory: 15
  },
  {
    _id: 'prod-monolith-boots',
    slug: 'monolith-boots',
    name: 'Monolith Boots',
    category: 'footwear',
    collection: 'Edition 03',
    price: 860,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    description: 'Dense leather ankle boots with a sculpted toe and stacked heel developed for a sharper stride.',
    details: ['Polished leather upper', 'Leather sole', 'Side zip closure', 'Made in Portugal'],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        alt: 'Monolith boots product shot'
      },
      {
        src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
        alt: 'Monolith boots detail'
      },
      {
        src: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80',
        alt: 'Monolith boots editorial'
      }
    ],
    featured: true,
    inventory: 11
  },
  {
    _id: 'prod-leather-tote',
    slug: 'leather-tote-09',
    name: 'Leather Tote 09',
    category: 'accessories',
    collection: 'Edition 03',
    price: 740,
    sizes: ['OS'],
    colors: ['Black', 'Stone'],
    description: 'A quiet daily tote in structured leather with hidden magnet closure and integrated interior pouch.',
    details: ['Structured calf leather', 'Detachable pouch', 'Magnetic top closure', 'Protective metal feet'],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
        alt: 'Leather tote front view'
      },
      {
        src: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
        alt: 'Leather tote detail'
      },
      {
        src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Leather tote styling'
      }
    ],
    inventory: 9
  },
  {
    _id: 'prod-contour-trouser',
    slug: 'contour-trouser',
    name: 'Contour Trouser',
    category: 'tailoring',
    collection: 'Edition 03',
    price: 610,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Graphite'],
    description: 'High-rise tailoring with a long break and softly sculpted leg line for day-to-evening balance.',
    details: ['Virgin wool twill', 'Extended tab closure', 'Pressed front crease', 'Partially lined'],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        alt: 'Contour trouser look'
      },
      {
        src: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80',
        alt: 'Contour trouser detail'
      },
      {
        src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Contour trouser movement'
      }
    ],
    inventory: 14
  },
  {
    _id: 'prod-studio-shirt',
    slug: 'studio-poplin-shirt',
    name: 'Studio Poplin Shirt',
    category: 'tailoring',
    collection: 'Edition 02',
    price: 390,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White'],
    description: 'An oversized poplin shirt with a sharp point collar and subtle elongated cuff proportions.',
    details: ['Italian poplin', 'Mother-of-pearl buttons', 'Curved hem', 'Relaxed silhouette'],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
        alt: 'Studio shirt front view'
      },
      {
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
        alt: 'Studio shirt detail'
      },
      {
        src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Studio shirt styling'
      }
    ],
    inventory: 20
  }
];

export const featuredProducts = mockProducts.filter((product) => product.featured).slice(0, 4);

export const mockOrderHistory: Order[] = [
  {
    _id: 'ord-2026-001',
    createdAt: '2026-03-14T12:45:00.000Z',
    items: [
      {
        product: mockProducts[0],
        quantity: 1,
        size: 'M'
      },
      {
        product: mockProducts[4],
        quantity: 1,
        size: 'L'
      }
    ],
    subtotal: 2150,
    shipping: 0,
    total: 2150,
    status: 'shipped'
  },
  {
    _id: 'ord-2026-002',
    createdAt: '2026-04-01T17:10:00.000Z',
    items: [
      {
        product: mockProducts[5],
        quantity: 1,
        size: 'OS'
      }
    ],
    subtotal: 740,
    shipping: 25,
    total: 765,
    status: 'processing'
  }
];

export function findProductBySlug(slug: string) {
  return mockProducts.find((product) => product.slug === slug);
}