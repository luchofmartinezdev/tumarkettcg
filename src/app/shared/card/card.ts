import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { CardPost, TradeType } from '../../core/models/site-config.model';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite';
import { AuthService } from '../../core/services/auth';
import { ContactService } from '../../core/services/contact'; // 👈 nuevo

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, DatePipe],
  templateUrl: './card.html'
})
export class CardComponent implements OnInit {
  post = input.required<CardPost>();

  public TradeType = TradeType;
  public isFavorite = signal(false);

  private favoriteService = inject(FavoriteService);
  public authService = inject(AuthService);
  private contactService = inject(ContactService); // 👈 nuevo

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) return;
    this.isFavorite.set(await this.favoriteService.isFavorite(user.uid, this.post().id));
  }

  handleContact() {
    this.contactService.handleContact(this.post()); // 👈 unificado
  }

  async toggleFavorite(event: Event) {
    event.stopPropagation();
    const user = this.authService.currentUser();
    if (!user) return;

    if (this.isFavorite()) {
      await this.favoriteService.removeFavoriteByPostId(user.uid, this.post().id);
      this.isFavorite.set(false);
    } else {
      await this.favoriteService.addFavorite(user.uid, {
        postId: this.post().id,
        cardName: this.post().cardName,
        imageUrl: this.post().imageUrl,
        franchise: this.post().franchise,
      });
      this.isFavorite.set(true);
    }
  }
}