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
import { extractShortId } from '../../shared/utils/slug';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../core/models/site-config.model';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, StarRatingComponent, CardComponent, FormsModule],
  templateUrl: './seller-profile.html'
})
export class SellerProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);
  public authService = inject(AuthService);
  private ratingService = inject(RatingService); private userProfileService = inject(UserProfileService);

  public sellerId = signal<string>('');
  public sellerName = signal<string>('');
  public userProfile = signal<UserProfile | null>(null);

  public ratings$: Observable<SellerRating[]> = of([]);

  // Estado del rating
  public hoveredStar = signal<number>(0);
  public selectedStar = signal<number>(0);
  public comment = signal<string>('');
  public canRate = signal<boolean>(false);
  public hasRated = signal<boolean>(false);
  public ratingSubmitted = signal<boolean>(false);
  public userRating = signal<SellerRating | null>(null);
  public isEditingRating = signal<boolean>(false);

  public TradeType = TradeType;

  // Posts activos del vendedor
  public sellerPosts = computed(() =>
    this.cardService.allPosts().filter(p =>
      p.userId === this.sellerId() && p.active
    )
  );

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    const shortId = extractShortId(slug);

    // Buscamos el uid desde los posts del vendedor
    const post = this.cardService.allPosts().find(p =>
      p.userId.startsWith(shortId) ||
      (p.userSlug && p.userSlug === slug)
    );

    // Alternativa: buscar en Firestore por slug
    let profile = await this.userProfileService.getProfileBySlug(slug);

    // Si no lo encontramos por slug, asumimos que el parámetro "slug" podría ser directamente el UID (o derivamos del post)
    let uid = profile?.uid || post?.userId;

    // Si no teníamos profile pero sí tenemos UID, lo buscamos directamente
    if (!profile && uid) {
      profile = await this.userProfileService.getProfile(uid);
      if (profile) {
        uid = profile.uid;
      }
    }

    if (!uid) return;

    this.sellerId.set(uid);
    this.sellerName.set(profile?.displayName || post?.userName || '');
    this.userProfile.set(profile);
    this.ratings$ = this.ratingService.getRatings(uid);

    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.uid !== uid) {
      const [contacted, existingRating] = await Promise.all([
        this.ratingService.hasContacted(currentUser.uid, uid),
        this.ratingService.getUserRating(uid, currentUser.uid)
      ]);
      this.canRate.set(contacted);
      this.hasRated.set(!!existingRating);
      this.userRating.set(existingRating);
    }
  }

  startEditing() {
    const existing = this.userRating();
    if (existing) {
      this.selectedStar.set(existing.stars);
      this.hoveredStar.set(existing.stars);
      this.comment.set(existing.comment || '');
      this.isEditingRating.set(true);
      this.ratingSubmitted.set(false);
    }
  }

  cancelEditing() {
    this.isEditingRating.set(false);
    this.selectedStar.set(0);
    this.comment.set('');
  }

  async submitRating() {
    const user = this.authService.currentUser();
    if (!user || this.selectedStar() === 0) return;

    const existing = this.userRating();

    if (existing && existing.id) {
      await this.ratingService.updateRating(
        this.sellerId(),
        existing.id,
        this.selectedStar(),
        this.comment()
      );
      // Actualizar el estado local
      this.userRating.set({
        ...existing,
        stars: this.selectedStar(),
        comment: this.comment()
      });
    } else {
      await this.ratingService.submitRating(
        this.sellerId(),
        user.uid,
        user.displayName ?? 'Usuario anónimo',
        user.photoURL ?? undefined,
        this.selectedStar(),
        this.comment()
      );
    }

    this.hasRated.set(true);
    this.isEditingRating.set(false);
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

  getSocialLink(type: 'ig' | 'tw' | 'fb', value: string): string {
    if (value.startsWith('http')) return value;
    const clean = value.replace('@', '');
    if (type === 'ig') return `https://instagram.com/${clean}`;
    if (type === 'tw') return `https://twitter.com/${clean}`;
    if (type === 'fb') return `https://facebook.com/${clean}`;
    return value;
  }
}