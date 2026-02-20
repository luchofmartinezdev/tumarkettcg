import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/site-config.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Usamos Signals para una reactividad moderna y eficiente
  private cartItems = signal<CartItem[]>([]);
  private isDrawerOpen = signal<boolean>(false);

  items = this.cartItems.asReadonly();
  isOpen = this.isDrawerOpen.asReadonly();

  totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));

  totalPrice = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  toggleDrawer() {
    console.log('Estado previo:', this.isDrawerOpen());
    this.isDrawerOpen.update(v => !v);
    console.log('Nuevo estado:', this.isDrawerOpen());
  }

  addProduct(product: Product) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { ...product, quantity: 1 }];
    });
    this.isDrawerOpen.set(true); // Abrir al agregar
  }

  removeProduct(productId: number) {
    this.cartItems.update(items => items.filter(i => i.id !== productId));
  }

  count() {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  }
}