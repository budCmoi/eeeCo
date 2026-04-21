type RecordLike = Record<string, unknown>;

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductSnapshotInput = {
  id?: string;
  _id?: string;
  slug?: string;
  name?: string;
  category?: string;
  collection?: string;
  price?: number;
  originalPrice?: number;
  sizes?: string[];
  colors?: string[];
  description?: string;
  details?: string[];
  images?: unknown;
  featured?: boolean;
  newArrival?: boolean;
  inventory?: number;
};

export type CheckoutItemInput = {
  productId?: string;
  slug?: string;
  name?: string;
  price?: number;
  quantity: number;
  size: string;
  image?: string;
  product?: ProductSnapshotInput;
};

export type StoredOrderItem = {
  productId?: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image?: string;
  product: ProductSnapshot;
};

export type OrderAddress = {
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

export type ProductSnapshot = {
  id: string;
  _id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: string[];
  description: string;
  details: string[];
  images: ProductImage[];
  featured: boolean;
  newArrival: boolean;
  inventory: number;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is RecordLike {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pickString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function pickNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function pickStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

export function isUuid(value: string) {
  return uuidPattern.test(value);
}

export function normalizeProductImages(value: unknown): ProductImage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<ProductImage[]>((images, entry) => {
    if (!isRecord(entry)) {
      return images;
    }

    const src = pickString(entry.src);
    const alt = pickString(entry.alt);

    if (!src || !alt) {
      return images;
    }

    images.push({ src, alt });
    return images;
  }, []);
}

export function buildProductSnapshot(input: ProductSnapshotInput & { productId?: string; image?: string }): ProductSnapshot {
  const productId = pickString(input.id) || pickString(input._id) || pickString(input.productId);
  const images = normalizeProductImages(input.images);
  const fallbackImage = pickString(input.image)
    ? [{ src: pickString(input.image), alt: pickString(input.name, 'Product image') }]
    : [];

  return {
    id: productId,
    _id: productId,
    slug: pickString(input.slug),
    name: pickString(input.name),
    category: pickString(input.category),
    collection: pickString(input.collection),
    price: pickNumber(input.price),
    originalPrice: typeof input.originalPrice === 'number' ? input.originalPrice : undefined,
    sizes: pickStringArray(input.sizes),
    colors: pickStringArray(input.colors),
    description: pickString(input.description),
    details: pickStringArray(input.details),
    images: images.length > 0 ? images : fallbackImage,
    featured: Boolean(input.featured),
    newArrival: Boolean(input.newArrival),
    inventory: Math.trunc(pickNumber(input.inventory))
  };
}

export function normalizeCheckoutItems(items: CheckoutItemInput[]) {
  return items.map((item) => {
    const nestedProduct = isRecord(item.product) ? item.product : undefined;
    const product = buildProductSnapshot({
      ...(nestedProduct ?? {}),
      productId: item.productId,
      slug: item.slug ?? nestedProduct?.slug,
      name: item.name ?? nestedProduct?.name,
      price: typeof item.price === 'number' ? item.price : nestedProduct?.price,
      image: item.image
    });

    return {
      productId: product.id || item.productId,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: Math.trunc(item.quantity),
      size: item.size,
      image: item.image || product.images[0]?.src,
      product
    } satisfies StoredOrderItem;
  });
}

export function hasCompleteOrderItems(items: StoredOrderItem[]) {
  return items.length > 0 && items.every((item) => item.slug && item.name && item.size && item.quantity > 0 && item.price >= 0);
}

export function normalizeOrderAddress(value: unknown): OrderAddress {
  const address = isRecord(value) ? value : {};

  return {
    firstName: pickString(address.firstName),
    lastName: pickString(address.lastName),
    email: pickString(address.email),
    phone: pickString(address.phone),
    address1: pickString(address.address1),
    address2: pickString(address.address2) || undefined,
    city: pickString(address.city),
    country: pickString(address.country),
    postalCode: pickString(address.postalCode)
  };
}

export function parseStoredOrderItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return normalizeCheckoutItems(
    value.reduce<CheckoutItemInput[]>((items, entry) => {
      if (!isRecord(entry)) {
        return items;
      }

      items.push({
        productId: pickString(entry.productId) || undefined,
        slug: pickString(entry.slug) || undefined,
        name: pickString(entry.name) || undefined,
        price: typeof entry.price === 'number' ? entry.price : undefined,
        quantity: pickNumber(entry.quantity),
        size: pickString(entry.size),
        image: pickString(entry.image) || undefined,
        product: isRecord(entry.product) ? (entry.product as ProductSnapshotInput) : undefined
      });

      return items;
    }, [])
  );
}

export function serializeProduct(product: {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  collection?: string | null;
  price: number;
  originalPrice: number | null;
  sizes: string[];
  colors: string[];
  description: string;
  details: string[];
  images?: Array<{ src: string; alt: string | null }>;
  featured: boolean;
  newArrival: boolean;
  inventory: number;
  deliveryDays?: number;
  sellerId?: string | null;
  seller?: { id: string; name: string; avatar: string | null } | null;
  category?: { name: string; slug: string } | null;
}) {
  return {
    id: product.id,
    _id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.categoryName,
    collection: product.collection ?? '',
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    sizes: product.sizes,
    colors: product.colors,
    description: product.description,
    details: product.details,
    images: (product.images ?? []).map((img) => ({ src: img.src, alt: img.alt ?? product.name })),
    featured: product.featured,
    newArrival: product.newArrival,
    inventory: product.inventory,
    deliveryDays: product.deliveryDays ?? 5,
    seller: product.seller
      ? {
          id: product.seller.id,
          name: product.seller.name,
          avatar: product.seller.avatar ?? undefined
        }
      : undefined,
    categorySlug: product.category?.slug
  };
}

export function serializeUser(user: {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'user' | 'admin';
  bio?: string | null;
  phone?: string | null;
  isSeller?: boolean;
}) {
  return {
    id: user.id,
    _id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? undefined,
    role: user.role,
    bio: user.bio ?? undefined,
    phone: user.phone ?? undefined,
    isSeller: user.isSeller ?? false
  };
}

export function serializeOrder(order: {
  id: string;
  items?: unknown;
  address: unknown;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  stripeSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: order.id,
    _id: order.id,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: parseStoredOrderItems(order.items ?? []).map((item) => ({
      product: item.product,
      quantity: item.quantity,
      size: item.size
    })),
    address: normalizeOrderAddress(order.address),
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    stripeSessionId: order.stripeSessionId ?? undefined
  };
}