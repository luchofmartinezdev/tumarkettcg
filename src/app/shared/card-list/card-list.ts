import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardPost, TradeType } from '../../core/models/site-config.model';
import { FavoriteService } from '../../core/services/favorite';
import { AuthService } from '../../core/services/auth';
import { ContactService } from '../../core/services/contact'; // 👈 nuevo

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './card-list.html'
})
export class CardListComponent implements OnInit {
  posts = input.required<CardPost[]>();

  public TradeType = TradeType;
  public favoriteIds = signal<Set<string>>(new Set());

  private favoriteService = inject(FavoriteService);
  public authService = inject(AuthService);
  private contactService = inject(ContactService); // 👈 nuevo

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) return;
    const favs = await this.favoriteService.getFavoritesSnapshot(user.uid);
    this.favoriteIds.set(new Set(favs.map(f => f.postId)));
  }

  isFavorite(postId: string): boolean {
    return this.favoriteIds().has(postId);
  }

  async toggleFavorite(event: Event, post: CardPost) {
    event.stopPropagation();
    const user = this.authService.currentUser();
    if (!user) return;

    if (this.isFavorite(post.id)) {
      await this.favoriteService.removeFavoriteByPostId(user.uid, post.id);
      const updated = new Set(this.favoriteIds());
      updated.delete(post.id);
      this.favoriteIds.set(updated);
    } else {
      await this.favoriteService.addFavorite(user.uid, {
        postId: post.id,
        cardName: post.cardName,
        imageUrl: post.imageUrl,
        franchise: post.franchise,
      });
      const updated = new Set(this.favoriteIds());
      updated.add(post.id);
      this.favoriteIds.set(updated);
    }
  }

  handleContact(post: CardPost) {
    this.contactService.handleContact(post); // 👈 unificado
  }
}