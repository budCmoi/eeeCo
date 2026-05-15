export interface ProductImage {
  id: string;
  src: string;
  alt?: string;
  position: number;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  isDemo: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  mainImage: string;
  images: ProductImage[];
  features: string[];
  benefits: string[];
  specifications: Record<string, string>;
  marketingText?: string;
  status: 'active' | 'draft';
  isActive: boolean;
  ownerId?: string;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}
