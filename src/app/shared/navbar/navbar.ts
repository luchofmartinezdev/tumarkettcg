import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CardService } from '../../core/services/cardService';
import { TradeType } from '../../core/models/site-config.model';
import { ThemeService } from '../../core/services/theme';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class Navbar {

  public authService = inject(AuthService);
  private cardService = inject(CardService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  public searchTerm = signal('');
  public showResults = signal(false);
  public showUserMenu = signal(false);
  public showPublishMenu = signal(false);

  public TradeType = TradeType;

  public quickResults = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (term.length < 3) return [];
    return this.cardService.allPosts()
      .filter(post =>
        post.cardName.toLowerCase().includes(term) ||
        post.franchise.toLowerCase().includes(term)
      );
  });

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#user-menu-wrapper')) {
      this.showUserMenu.set(false);
    }
    if (!target.closest('#publish-menu-wrapper')) {
      this.showPublishMenu.set(false);
    }
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
  }

  togglePublishMenu() {
    this.showPublishMenu.update(v => !v);
  }

  onSearchInput(term: string) {
    this.searchTerm.set(term);
    this.showResults.set(term.length >= 3);
  }

  goToPost(id: string) {
    if (!id) return;
    this.router.navigate(['/card', id]);
    this.searchTerm.set('');
    this.showResults.set(false);
  }

  viewAll() {
    const term = this.searchTerm();
    this.router.navigate(['/buscar'], { queryParams: { q: term } });
    this.showResults.set(false);
  }

  closeResults() {
    setTimeout(() => this.showResults.set(false), 200);
  }

  navigateTo(path: string) {
    this.showUserMenu.set(false);
    this.showPublishMenu.set(false);
    this.router.navigate([path]);
  }

  logout() {
    this.showUserMenu.set(false);
    this.authService.logout();
    this.router.navigate(['/']);
  }
}