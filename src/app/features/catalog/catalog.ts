import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardService } from '../../core/services/cardService';
import { AuthService } from '../../core/services/auth';
import { CardPost, SortOption, TradeType } from '../../core/models/site-config.model';
import { SortBarComponent } from '../../shared/sort-bar/sort-bar';
import { CardGridComponent } from '../../shared/card-grid/card-grid';
import { CardListComponent } from '../../shared/card-list/card-list';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, CardGridComponent, CardListComponent, SortBarComponent],
  templateUrl: './catalog.html',
})
export class CatalogComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cardService = inject(CardService);
  public authService = inject(AuthService);

  public currentType = signal<TradeType | null>(null);
  public searchTerm = signal<string>('');
  public currentSort = signal<SortOption>(SortOption.RECENT);
  public viewMode = signal<'grid' | 'list'>('grid'); // 👈 nuevo

  public TradeType = TradeType;

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['type']) {
        this.currentType.set(data['type'] as TradeType);
      }
    });

    const pending = this.authService.getPendingContact();
    if (pending && this.authService.currentUser()) {
      this.contactUser(pending.phone, pending.cardName, pending.type);
      this.authService.clearPendingContact();
    }
  }

  handleSort(option: SortOption) {
    this.currentSort.set(option);
  }

  setViewMode(mode: 'grid' | 'list') { // 👈 nuevo
    this.viewMode.set(mode);
  }

  filteredPosts = computed(() => {
    const allPosts = this.cardService.allPosts();
    const typeFilter = this.currentType();
    const search = this.searchTerm().toLowerCase().trim();

    return allPosts.filter(post => {
      const matchesType = typeFilter
        ? post.type.toString().toUpperCase() === typeFilter.toString().toUpperCase()
        : true;
      const matchesSearch = !search ||
        post.cardName.toLowerCase().includes(search) ||
        post.franchise.toLowerCase().includes(search);
      return matchesType && matchesSearch;
    });
  });

  orderedPosts = computed(() => {
    const posts = [...this.filteredPosts()];
    const sort = this.currentSort();

    if (sort === SortOption.AZ) return posts.sort((a, b) => a.cardName.localeCompare(b.cardName));
    if (sort === SortOption.ZA) return posts.sort((a, b) => b.cardName.localeCompare(a.cardName));

    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  handleContactClick(post: CardPost) {
    if (this.authService.currentUser()) {
      this.contactUser(post.whatsappContact, post.cardName, post.type);
    } else {
      this.authService.setPendingContact({
        phone: post.whatsappContact,
        cardName: post.cardName,
        type: post.type
      });
      this.router.navigate(['/login']);
    }
  }

  private contactUser(phone: string, cardName: string, type: TradeType) {
    const message = type === TradeType.VENDO
      ? `Hola! Vi tu publicación en TuMarketTCG y me interesa comprar la carta: ${cardName}`
      : `Hola! Vi que estás buscando la carta ${cardName} en TuMarketTCG y yo la tengo disponible.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  }
}