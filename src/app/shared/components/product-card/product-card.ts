import { Component, Input, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category, Product } from '../../../core/models/site-config.model';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './product-card.html'
})
export class ProductCard {
  @Input() product!: Product;
  private cartService = inject(CartService);

  // Exponemos el Enum para usarlo en comparaciones dentro del HTML
  public CategoryEnum = Category;

  addToCart() {
    if (this.product.inStock) {
      this.cartService.addProduct(this.product);
    }
  }

  // Función para determinar el color del badge según categoría
  getCategoryStyle() {
    switch (this.product.category) {
      case Category.BOOSTER_BOXES: return 'border-yellow-400 text-yellow-400 bg-yellow-400/10';
      case Category.ETB: return 'border-purple-500 text-purple-400 bg-purple-500/10';
      case Category.BOOSTER_PACKS: return 'border-blue-400 text-blue-400 bg-blue-400/10';
      default: return 'border-white/20 text-gray-400 bg-white/5';
    }
  }
}