export type ProductImage = {
  src: string;
  alt: string;
};

export type Seller = {
  id: string;
  name: string;
  avatar?: string;
};

export type Product = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug?: string;
  collection?: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: string[];
  description: string;
  details: string[];
  images: ProductImage[];
  featured?: boolean;
  newArrival?: boolean;
  inventory: number;
  deliveryDays?: number;
  seller?: Seller;
};

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
};

export type Address = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  country: string;
  postalCode: string;
};

export type OrderStatus = 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  _id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
};

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  bio?: string;
  phone?: string;
  isSeller?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  _count?: { products: number };
};

export type ProductFilters = {
  category?: string;
  size?: string;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  delivery?: number;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  sender: { id: string; name: string; avatar?: string };
  readAt: string | null;
  createdAt: string;
};

export type Conversation = {
  id: string;
  subject?: string;
  participants: { id: string; name: string; avatar?: string; email: string }[];
  lastMessage?: Message | null;
  lastMessageAt?: string;
};
