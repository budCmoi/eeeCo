export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isBilling: boolean;
  isShipping: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay';
  label: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  isDemo: boolean;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    mainImage: string;
    slug: string;
  };
}

export interface Order {
  id: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentMethod: string;
  status: 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  isDemo: boolean;
  items: OrderItem[];
  address: Record<string, string>;
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  orders?: Order[];
  product?: {
    id: string;
    title: string;
    isActive: boolean;
    status: string;
    price: number;
    mainImage: string;
  } | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
