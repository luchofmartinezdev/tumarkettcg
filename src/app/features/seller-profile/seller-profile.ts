import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardService } from '../../core/services/cardService';
import { AuthService } from '../../core/services/auth';
import { RatingService } from '../../core/services/rating';
import { CardPost, SellerRating, TradeType } from '../../core/models/site-config.model';
import { StarRatingComponent } from '../../shared/star-rating/star-rating';
import { CardComponent } from '../../shared/card/card';
import { Observable, of } from 'rxjs';
import { UserProfileService } from '../../core/services/user-profile';
import { UserProfile } from '../../core/models/site-config.model';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, StarRatingComponent, CardComponent],
  templateUrl: './seller-profile.html'
})
export class SellerProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);
  public authService = inject(AuthService);
  private ratingService = inject(RatingService);private userProfileService = inject(UserProfileService);

  public sellerId = signal<string>('');
  public sellerName = signal<string>('');
  public userProfile = signal<UserProfile | null>(null);

  public ratings$: Observable<SellerRating[]> = of([]);

  // Estado del rating
  public hoveredStar = signal<number>(0);
  public selectedStar = signal<number>(0);
  public canRate = signal<boolean>(false);
  public hasRated = signal<boolean>(false);
  public ratingSubmitted = signal<boolean>(false);

  public TradeType = TradeType;

  // Posts activos del vendedor
  public sellerPosts = computed(() =>
    this.cardService.allPosts().filter(p =>
      p.userId === this.sellerId() && p.active
    )
  );

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (!uid) return;

    this.sellerId.set(uid);
    const profile = await this.userProfileService.getProfile(uid);
    this.userProfile.set(profile);

    // Obtenemos nombre del vendedor desde sus posts
    const post = this.cardService.allPosts().find(p => p.userId === uid);
    if (post) this.sellerName.set(post.userName);

    // Cargamos ratings
    this.ratings$ = this.ratingService.getRatings(uid);

    // Verificamos si el usuario logueado puede calificar
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.uid !== uid) {
      const [contacted, rated] = await Promise.all([
        this.ratingService.hasContacted(currentUser.uid, uid),
        this.ratingService.hasRated(uid, currentUser.uid)
      ]);
      this.canRate.set(contacted && !rated);
      this.hasRated.set(rated);
    }
  }

  async submitRating() {
    const user = this.authService.currentUser();
    if (!user || this.selectedStar() === 0) return;

    await this.ratingService.submitRating(
      this.sellerId(),
      user.uid,
      this.selectedStar()
    );

    this.canRate.set(false);
    this.hasRated.set(true);
    this.ratingSubmitted.set(true);
  }

  getAverage(ratings: SellerRating[]): number {
    return this.ratingService.calculateAverage(ratings);
  }

  handleContact(post: CardPost) {
    const user = this.authService.currentUser();
    if (!user) return;
    const message = post.type === TradeType.VENDO
      ? `Hola! Vi tu publicación en TuMarketTCG y me interesa comprar la carta: ${post.cardName}`
      : `Hola! Vi que estás buscando la carta ${post.cardName} en TuMarketTCG y yo la tengo disponible.`;
    window.open(`https://wa.me/${post.whatsappContact}?text=${encodeURIComponent(message)}`, '_blank');
  }
}