import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardService } from '../../core/services/cardService';
import { AuthService } from '../../core/services/auth';
import { CardPost, SortOption, TradeType } from '../../core/models/site-config.model';
import { SortBarComponent } from '../../shared/sort-bar/sort-bar';
import { CardGridComponent } from '../../shared/card-grid/card-grid';
import { CardListComponent } from '../../shared/card-list/card-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule, CardGridComponent, CardListComponent, SortBarComponent],
  templateUrl: './search-results.html'
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cardService = inject(CardService);
  public authService = inject(AuthService);

  public searchTerm = signal<string>('');
  public currentSort = signal<SortOption>(SortOption.RECENT);
  public viewMode = signal<'grid' | 'list'>('grid');

  public TradeType = TradeType;

  ngOnInit() {
    // Leemos el query param ?q= cada vez que cambia
    this.route.queryParams.subscribe(params => {
      this.searchTerm.set(params['q'] ?? '');
    });
  }

  handleSort(option: SortOption) {
    this.currentSort.set(option);
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }

  filteredPosts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return [];

    return this.cardService.allPosts().filter(post =>
      post.cardName.toLowerCase().includes(term) ||
      post.franchise.toLowerCase().includes(term)
    );
  });

  orderedPosts = computed(() => {
    const posts = [...this.filteredPosts()];
    const sort = this.currentSort();

    if (sort === SortOption.AZ) return posts.sort((a, b) => a.cardName.localeCompare(b.cardName));
    if (sort === SortOption.ZA) return posts.sort((a, b) => b.cardName.localeCompare(a.cardName));

    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  handleContactClick(post: CardPost) {
    if (this.authService.currentUser()) {
      const message = post.type === TradeType.VENDO
        ? `Hola! Vi tu publicación en TuMarketTCG y me interesa comprar la carta: ${post.cardName}`
        : `Hola! Vi que estás buscando la carta ${post.cardName} en TuMarketTCG y yo la tengo disponible.`;
      window.open(`https://wa.me/${post.whatsappContact}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      this.authService.setPendingContact({
        phone: post.whatsappContact,
        cardName: post.cardName,
        type: post.type
      });
      this.router.navigate(['/login']);
    }
  }
}