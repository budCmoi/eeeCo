import type { ChangeEvent } from 'react';

import { CATEGORIES, SORT_OPTIONS, SIZES } from '@/lib/constants';
import type { ProductFilters as ProductFiltersType } from '@/types';

type ProductFiltersProps = {
  filters: ProductFiltersType;
  onChange: (filters: ProductFiltersType) => void;
  resultCount: number;
};

export function ProductFilters({ filters, onChange, resultCount }: ProductFiltersProps) {
  function update<K extends keyof ProductFiltersType>(key: K, value: ProductFiltersType[K]) {
    onChange({ ...filters, [key]: value });
  }

  function handlePriceChange(key: 'minPrice' | 'maxPrice') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value ? Number(event.target.value) : undefined;
      update(key, nextValue);
    };
  }

  return (
    <div className="surface-panel rounded-[2rem] p-5 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Filter the edit</p>
            <p className="mt-2 text-sm text-ivory/62">{resultCount} pieces available</p>
          </div>

          <label className="block md:max-w-xs md:flex-1">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-ivory/48">Search</span>
            <input
              type="search"
              value={filters.search ?? ''}
              onChange={(event) => update('search', event.target.value || undefined)}
              placeholder="Search by name or collection"
              className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/34 focus:border-white/20"
            />
          </label>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-ivory/48">Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm transition-colors ${!filters.category ? 'bg-ivory text-black' : 'bg-white/[0.04] text-ivory/74'}`}
                onClick={() => update('category', undefined)}
              >
                All
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${filters.category === category ? 'bg-ivory text-black' : 'bg-white/[0.04] text-ivory/74'}`}
                  onClick={() => update('category', category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-ivory/48">Sort</span>
              <select
                value={filters.sort ?? 'featured'}
                onChange={(event) => update('sort', event.target.value as ProductFiltersType['sort'])}
                className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-black text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-ivory/48">Size</span>
              <select
                value={filters.size ?? ''}
                onChange={(event) => update('size', event.target.value || undefined)}
                className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none"
              >
                <option value="" className="bg-black text-white">
                  All sizes
                </option>
                {SIZES.map((size) => (
                  <option key={size} value={size} className="bg-black text-white">
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-ivory/48">Min price</span>
            <input
              type="number"
              min="0"
              value={filters.minPrice ?? ''}
              onChange={handlePriceChange('minPrice')}
              placeholder="0"
              className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none placeholder:text-ivory/34"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-ivory/48">Max price</span>
            <input
              type="number"
              min="0"
              value={filters.maxPrice ?? ''}
              onChange={handlePriceChange('maxPrice')}
              placeholder="2500"
              className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none placeholder:text-ivory/34"
            />
          </label>

          <button
            type="button"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-ivory/74 transition-colors hover:border-white/20 hover:text-ivory"
            onClick={() => onChange({ sort: 'featured' })}
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}