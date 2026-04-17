export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL ?? 'http://localhost:3000';

export const CATEGORIES = ['outerwear', 'tailoring', 'dresses', 'knitwear', 'footwear', 'accessories'];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' }
];

export const STORY_POINTS = [
  {
    eyebrow: 'Precision tailoring',
    title: 'Objects designed with restraint.',
    copy: 'Every silhouette is pared back to the essentials, then elevated through material, proportion, and movement.'
  },
  {
    eyebrow: 'Immersive motion',
    title: 'Scrolling becomes part of the narrative.',
    copy: 'Sections reveal with calm timing, sticky frames, and image transitions that feel deliberate instead of decorative.'
  },
  {
    eyebrow: 'Private edition',
    title: 'Limited capsules, built to feel collected.',
    copy: 'Merchandising, product language, and checkout are tuned to read like a luxury launch rather than a generic catalog.'
  }
];