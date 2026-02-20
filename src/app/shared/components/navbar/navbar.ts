import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content';
import { CartService } from '../../../core/services/cart';
import { Router, RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  goToHome() {
    this.router.navigate(['/']);
  }

  public contentService = inject(ContentService);
  public cartService = inject(CartService); 
  private router = inject(Router);

  config = this.contentService.getConfig();

  // Signal para controlar la visibilidad del desplegable
  showSuggestions = signal(false);

  // Computado para las sugerencias rápidas
  suggestions = computed(() => {
    const term = this.contentService.searchTerm().toLowerCase();
    // Solo busca si tiene 3 o más caracteres
    if (term.length < 3) return [];

    return this.contentService.getConfig().featuredProducts
      .filter(p => p.name.toLowerCase().includes(term))
      .slice(0, 5); // Limitamos a 5 sugerencias para no romper el diseño
  });

  onSearch(event: Event) {
    const element = event.target as HTMLInputElement;
    this.contentService.searchTerm.set(element.value);
    this.showSuggestions.set(element.value.length >= 3);
  }

  selectProduct(id: number) {
    this.showSuggestions.set(false);
    this.router.navigate(['/producto', id]);
  }

  toggleCart() {
    this.cartService.toggleDrawer();
  }

  count() {
    return this.cartService.count();
  }

  onBlur() {
    // El delay de 200ms es para permitir que el evento (click) 
    // en la sugerencia se dispare antes de que el menú desaparezca
    setTimeout(() => {
      this.showSuggestions.set(false);
    }, 200);
  }
}