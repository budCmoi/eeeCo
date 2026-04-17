import { mockProducts } from '@/data/products';
import type { Product, ProductFilters } from '@/types';

import { api } from '@/services/api';

function filterLocalProducts(products: Product[], filters: ProductFilters = {}) {
  let nextProducts = [...products];

  if (filters.category) {
    nextProducts = nextProducts.filter((product) => product.category === filters.category);
  }

  if (filters.size) {
    nextProducts = nextProducts.filter((product) => product.sizes.includes(filters.size as string));
  }

  if (filters.search) {
    const query = filters.search.toLowerCase();
    nextProducts = nextProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.collection.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }

  if (typeof filters.minPrice === 'number') {
    nextProducts = nextProducts.filter((product) => product.price >= filters.minPrice!);
  }

  if (typeof filters.maxPrice === 'number') {
    nextProducts = nextProducts.filter((product) => product.price <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case 'price-asc':
      nextProducts.sort((left, right) => left.price - right.price);
      break;
    case 'price-desc':
      nextProducts.sort((left, right) => right.price - left.price);
      break;
    case 'newest':
      nextProducts.sort((left, right) => Number(right.newArrival) - Number(left.newArrival));
      break;
    default:
      nextProducts.sort((left, right) => Number(right.featured) - Number(left.featured));
      break;
  }

  return nextProducts;
}

export async function fetchProducts(filters: ProductFilters = {}) {
  try {
    const { data } = await api.get<Product[] | { items: Product[] }>('/products', { params: filters });
    return Array.isArray(data) ? data : data.items;
  } catch {
    return filterLocalProducts(mockProducts, filters);
  }
}

export async function fetchProduct(slug: string) {
  try {
    const { data } = await api.get<Product>(`/products/${slug}`);
    return data;
  } catch {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function fetchRelatedProducts(product: Product) {
  const products = await fetchProducts({ category: product.category, sort: 'featured' });

  return products.filter((candidate) => candidate.slug !== product.slug).slice(0, 3);
}