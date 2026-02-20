import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../core/models/site-config.model';
import { ContentService } from '../../core/services/content';
import { CartService } from '../../core/services/cart';
import { WhatsappButton } from '../../shared/components/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, WhatsappButton],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);

  product?: Product;

  private cartService = inject(CartService);

  addToCart() {
    if (this.product) {
      this.cartService.addProduct(this.product);
    }
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.contentService.getConfig().featuredProducts.find(p => p.id === id);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
  }
}