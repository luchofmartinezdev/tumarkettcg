import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BannersComponent } from './banners/banners';
import { CardService } from '../../core/services/cardService';
import { AuthService } from '../../core/services/auth';
import { ContactService } from '../../core/services/contact'; // 👈 importación añadida
import { Franchise, TradeType } from '../../core/models/site-config.model';
import { CardComponent } from '../../shared/card/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BannersComponent, CardComponent],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  public cardService = inject(CardService);
  public authService = inject(AuthService);
  private contactService = inject(ContactService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public TradeType = TradeType;
  public franchises = Object.values(Franchise);

  searchTerm = signal<string>('');
  filterType = signal<string | null>(null);

  ngOnInit() {
    this.contactService.checkPendingContact(); // 👈 unificado

    this.route.data.subscribe(data => {
      if (data['filterType']) {
        this.filterType.set(data['filterType']);
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.filterType.set(params['type']);
      }
    });
  }

  public hasAnyPosts = computed(() => this.cardService.allPosts().length > 0);

  public carouselsByFranchise = computed(() => {
    const all = [...this.cardService.allPosts()];
    return this.franchises.map(f => {
      const cards = all
        .filter(p => p.franchise === f)
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 8);
      return { franchise: f, cards };
    });
  });

  filteredPosts = computed(() => {
    let posts = this.cardService.allPosts();

    const type = this.filterType();
    if (type) {
      posts = posts.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }

    const search = this.searchTerm().toLowerCase();
    if (search) {
      posts = posts.filter(p => p.cardName.toLowerCase().includes(search));
    }

    return posts;
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  scrollCarousel(container: HTMLElement, distance: number) {
    container.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
  }

  clearFilters() {
    this.filterType.set(null);
    this.searchTerm.set('');
    this.router.navigate(['/']);
  }
}