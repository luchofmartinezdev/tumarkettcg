import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardService } from '../../core/services/cardService';
import { CardPost, TradeType } from '../../core/models/site-config.model';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './card-detail.html'
})
export class CardDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);
  private location = inject(Location);

  public post = signal<CardPost | undefined>(undefined);
  public TradeType = TradeType;

  // Método para volver atrás en el historial
  goBack() {
    this.location.back();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Buscamos la carta en el service
      const foundPost = this.cardService.allPosts().find(p => p.id === id);
      this.post.set(foundPost);
    }
  }

  handleContact() {
    const p = this.post();
    if (!p) return;
    const message = `Hola! Vi tu publicación de "${p.cardName}" en TuMarketTCG y me interesa.`;
    window.open(`https://wa.me/${p.whatsappContact}?text=${encodeURIComponent(message)}`, '_blank');
  }
}