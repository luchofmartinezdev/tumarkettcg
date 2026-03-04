import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardService } from '../../core/services/cardService';
import { AuthService } from '../../core/services/auth';
import { ContactService } from '../../core/services/contact';
import { CardPost, SortOption, TradeType } from '../../core/models/site-config.model';
import { SortBarComponent } from '../../shared/sort-bar/sort-bar';
import { CardGridComponent } from '../../shared/card-grid/card-grid';
import { CardListComponent } from '../../shared/card-list/card-list';
import { FilterState, SidebarFiltersComponent } from '../../shared/sidebar-filters/sidebar-filters';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, CardGridComponent, CardListComponent, SortBarComponent, SidebarFiltersComponent],
  templateUrl: './catalog.html',
})
export class CatalogComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cardService = inject(CardService);
  public authService = inject(AuthService);
  private contactService = inject(ContactService);

  public currentType = signal<TradeType | null>(null);
  public searchTerm = signal<string>('');
  public currentSort = signal<SortOption>(SortOption.RECENT);
  public viewMode = signal<'grid' | 'list'>('grid');

  public TradeType = TradeType;
  public activeFilters = signal<FilterState | null>(null);
  public showFiltersMobile = signal<boolean>(false);

  ngOnInit() {
    this.contactService.checkPendingContact();

    this.route.data.subscribe(data => {
      if (data['type']) {
        this.currentType.set(data['type'] as TradeType);
      }
    });
  }

  handleSort(option: SortOption) {
    this.currentSort.set(option);
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }

  filteredPosts = computed(() => {
    const allPosts = this.cardService.allPosts();
    const typeFilter = this.currentType();
    const search = this.searchTerm().toLowerCase().trim();
    const filters = this.activeFilters();

    return allPosts.filter(post => {
      const matchesType = typeFilter
        ? post.type?.toString().toUpperCase() === typeFilter.toString().toUpperCase()
        : true;

      const matchesSearch = !search ||
        post.cardName?.toLowerCase().includes(search) ||
        post.franchise?.toLowerCase().includes(search);

      if (!filters) return matchesType && matchesSearch;

      const matchesPrice = (post.price ?? 0) <= filters.maxPrice;
      const matchesCondition = !filters.condition || post.condition === filters.condition;
      const matchesLanguage = !filters.language || post.language === filters.language;
      const matchesRarity = !filters.rarity || (post.rarity ?? '') === filters.rarity;

      return matchesType && matchesSearch && matchesPrice && matchesCondition && matchesLanguage && matchesRarity;
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

  public activeFiltersCount = computed(() => {
    const filters = this.activeFilters();
    if (!filters) return 0;
    let count = 0;
    // El precio siempre tiene valor por defecto, así que solo contamos si es distinto al máximo inicial o si queremos ser estrictos
    if (filters.maxPrice < 150000) count++;
    if (filters.condition) count++;
    if (filters.language) count++;
    if (filters.rarity) count++;
    return count;
  });

  handleFiltersChange(filters: FilterState) {
    this.activeFilters.set(filters);
  }
}