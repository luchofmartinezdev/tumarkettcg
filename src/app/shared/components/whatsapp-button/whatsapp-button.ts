import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.html'
})
export class WhatsappButton {
  private contentService = inject(ContentService);
  config = this.contentService.getConfig();

  // Opcional: pasar el nombre de un producto para la consulta
  @Input() productName?: string;

  openWhatsapp() {
    const phone = "5493511234567"; // Tu número de Córdoba
    const baseMsg = `Hola Hadouken! Vengo de la web y me interesa saber más`;
    const finalMsg = this.productName
      ? `${baseMsg} sobre el producto: ${this.productName}`
      : `${baseMsg} sobre las cartas Pokémon.`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(finalMsg)}`, '_blank');
  }
}