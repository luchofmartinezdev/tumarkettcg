import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-cart-drawer',
  imports: [CommonModule, CurrencyPipe], templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawer {
  // Inyectamos el servicio como público para que el HTML acceda a los Signals
  public cartService = inject(CartService);

  // Método para cerrar el drawer y limpiar estados si fuera necesario
  close() {
    this.cartService.toggleDrawer();
  }

  // Lógica para proceder al pago (puedes vincularlo a una ruta de checkout luego)
  proceedToCheckout() {
    console.log('Iniciando checkout para:', this.cartService.items());
    this.close();
  }
}
