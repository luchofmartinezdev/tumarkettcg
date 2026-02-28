import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../../../core/services/favorite';
import { AuthService } from '../../../../core/services/auth';
import { FavoriteRecord } from '../../../../core/models/site-config.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-profile-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-favorites.html'
})
export class ProfileFavoritesComponent implements OnInit {
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  public favorites$: Observable<FavoriteRecord[]> = of([]);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.favorites$ = this.favoriteService.getFavorites(user.uid);
    }
  }

  removeFavorite(favoriteId: string) {
    const user = this.authService.currentUser();
    if (user) this.favoriteService.removeFavorite(user.uid, favoriteId);
  }
}