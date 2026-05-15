import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Cart, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'aurora_cart';

  private _items = signal<CartItem[]>(this.load());
  private _promoCode = signal<string | null>(null);
  private _discount = signal<number>(0);

  items = this._items.asReadonly();
  itemCount = computed(() => this._items().reduce((s, i) => s + i.quantity, 0));

  cart = computed<Cart>(() => {
    const items = this._items();
    const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const shipping = subtotal >= 80 ? 0 : 4.99;
    const discount = this._discount();
    return { items, subtotal, shipping, discount, total: subtotal + shipping - discount };
  });

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._items()));
  }

  addItem(product: Product, quantity = 1) {
    this._items.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...items, { product, quantity }];
    });
    this.save();
  }

  updateQty(productId: string, quantity: number) {
    if (quantity <= 0) { this.removeItem(productId); return; }
    this._items.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
    this.save();
  }

  removeItem(productId: string) {
    this._items.update(items => items.filter(i => i.product.id !== productId));
    this.save();
  }

  clearCart() {
    this._items.set([]);
    this._promoCode.set(null);
    this._discount.set(0);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  applyPromo(code: string): boolean {
    if (code === 'AURORA10') {
      const disc = this.cart().subtotal * 0.1;
      this._discount.set(disc);
      this._promoCode.set(code);
      return true;
    }
    return false;
  }

  getPromoCode(): string | null {
    return this._promoCode();
  }
}
