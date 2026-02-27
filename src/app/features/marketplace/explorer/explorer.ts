import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardService } from '../../../core/services/card';
import { AuthService } from '../../../core/services/auth';
import { CardPost, TradeType } from '../../../core/models/site-config.model';
import { GridCardComponent } from '../../explorer/components/grid-card/grid-card';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule, RouterModule, GridCardComponent],
  templateUrl: './explorer.html',
})
export class ExplorerComponent implements OnInit {
  // Inyecciones
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cardService = inject(CardService);
  public authService = inject(AuthService);

  // Estados reactivos (Signals)
  public currentType = signal<TradeType | null>(null);
  public searchTerm = signal<string>('');

  // Acceso al enum para el HTML
  public TradeType = TradeType;

  ngOnInit() {
    // Escuchamos la 'data' configurada en app.routes.ts
    this.route.data.subscribe(data => {
      if (data['type']) {
        this.currentType.set(data['type'] as TradeType);
      }
    });

    // Lógica para abrir WhatsApp si venimos del login con una acción pendiente
    const pending = this.authService.getPendingContact();
    if (pending && this.authService.currentUser()) {
      this.contactUser(pending.phone, pending.cardName, pending.type);
      this.authService.clearPendingContact();
    }
  }

  // LISTA FILTRADA: Se actualiza sola cuando cambia el search o el tipo
  filteredPosts = computed(() => {
    // 1. Obtenemos los valores actuales de los signals
    const allPosts = this.cardService.allPosts();
    const typeFilter = this.currentType(); // El valor que viene del Banner (VENDO o BUSCO)
    const search = this.searchTerm().toLowerCase().trim();

    return allPosts.filter(post => {
      // 2. Filtro por Tipo (Vendo/Busco)
      // Usamos toString() y toUpperCase() para que no falle si uno es Enum y el otro String
      const matchesType = typeFilter
        ? post.type.toString().toUpperCase() === typeFilter.toString().toUpperCase()
        : true;

      // 3. Filtro por Búsqueda
      const matchesSearch = !search ||
        post.cardName.toLowerCase().includes(search) ||
        post.franchise.toLowerCase().includes(search);

      return matchesType && matchesSearch;
    });
  });

  // Manejo del Input
  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  // Lógica de Contacto "Smart"
  handleContactClick(post: CardPost) {
    if (this.authService.currentUser()) {
      this.contactUser(post.whatsappContact, post.cardName, post.type);
    } else {
      // Guardamos la intención y mandamos al login
      this.authService.setPendingContact({
        phone: post.whatsappContact,
        cardName: post.cardName,
        type: post.type
      });
      this.router.navigate(['/login']);
    }
  }

  // Apertura de WhatsApp
  private contactUser(phone: string, cardName: string, type: TradeType) {
    const message = type === TradeType.VENDO
      ? `Hola! Vi tu publicación en TuMarketTCG y me interesa comprar la carta: ${cardName}`
      : `Hola! Vi que estás buscando la carta ${cardName} en TuMarketTCG y yo la tengo disponible.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}