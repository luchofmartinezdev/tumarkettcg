import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardService } from '../../core/services/cardService';
import { CardPost, SellerRating, TradeType } from '../../core/models/site-config.model';
import { StarRatingComponent } from '../../shared/star-rating/star-rating';
import { AuthService } from '../../core/services/auth';
import { RatingService } from '../../core/services/rating';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, StarRatingComponent],
  templateUrl: './card-detail.html'
})
export class CardDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);
  private location = inject(Location);
  private ratingService = inject(RatingService);
  public authService = inject(AuthService);

  public post = signal<CardPost | undefined>(undefined);
  public sellerRatings$: Observable<SellerRating[]> = of([]);
  public TradeType = TradeType;

  // Método para volver atrás en el historial
  goBack() {
    this.location.back();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundPost = this.cardService.allPosts().find(p => p.id === id);
      this.post.set(foundPost);
      if (foundPost?.userId) {
        this.sellerRatings$ = this.ratingService.getRatings(foundPost.userId);
      }
    }
  }

  getAverage(ratings: SellerRating[]): number {
    return this.ratingService.calculateAverage(ratings);
  }

  handleContact() {
    const p = this.post();
    if (!p) return;
    const message = `Hola! Vi tu publicación de "${p.cardName}" en TuMarketTCG y me interesa.`;
    window.open(`https://wa.me/${p.whatsappContact}?text=${encodeURIComponent(message)}`, '_blank');
  }
}