import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ContentService } from '../../../../core/services/content';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html'
})
export class Hero {
  public contentService = inject(ContentService);
  
  // Podemos vincular el botón de "Explorar" para que scrollee a la grilla
  scrollToProducts() {
    const element = document.getElementById('products-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}