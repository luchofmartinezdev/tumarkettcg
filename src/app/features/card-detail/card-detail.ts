import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardService } from '../../core/services/cardService';
import { CardPost, SellerRating, TradeType } from '../../core/models/site-config.model';
import { StarRatingComponent } from '../../shared/star-rating/star-rating';
import { AuthService } from '../../core/services/auth';
import { RatingService } from '../../core/services/rating';
import { FavoriteService } from '../../core/services/favorite';
import { extractShortId } from '../../shared/utils/slug';
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
  private favoriteService = inject(FavoriteService);
  public authService = inject(AuthService);

  public post = signal<CardPost | undefined>(undefined);
  public sellerRatings$: Observable<SellerRating[]> = of([]);
  public isFavorite = signal(false);
  public TradeType = TradeType;

  goBack() { this.location.back(); }

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    const shortId = extractShortId(slug);

    // Buscamos el post cuyo ID empiece con el shortId
    const foundPost = this.cardService.allPosts().find(p =>
      p.id.startsWith(shortId) || p.slug === slug
    );

    this.post.set(foundPost);

    if (foundPost?.userId) {
      this.sellerRatings$ = this.ratingService.getRatings(foundPost.userId);
    }

    const user = this.authService.currentUser();
    if (user && foundPost) {
      this.isFavorite.set(await this.favoriteService.isFavorite(user.uid, foundPost.id));
    }
  }

  async toggleFavorite() {
    const user = this.authService.currentUser();
    const p = this.post();
    if (!user || !p) return;

    if (this.isFavorite()) {
      await this.favoriteService.removeFavoriteByPostId(user.uid, p.id);
      this.isFavorite.set(false);
    } else {
      await this.favoriteService.addFavorite(user.uid, {
        postId: p.id,
        cardName: p.cardName,
        imageUrl: p.imageUrl,
        franchise: p.franchise,
      });
      this.isFavorite.set(true);
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