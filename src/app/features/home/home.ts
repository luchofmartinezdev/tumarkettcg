import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BannersComponent } from './banners/banners';
import { CardService } from '../../core/services/cardService';
import { AuthService } from '../../core/services/auth';
import { TradeType } from '../../core/models/site-config.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BannersComponent],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  public cardService = inject(CardService);
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  public TradeType = TradeType;


  private router = inject(Router);

  searchTerm = signal<string>('');
  filterType = signal<string | null>(null);

  ngOnInit() {
    const pending = this.authService.getPendingContact();
    if (pending && this.authService.currentUser()) {
      // Disparamos el WhatsApp
      this.contactUser(pending.phone, pending.cardName, pending.type);
      // Limpiamos para que no se abra cada vez que recargue
      this.authService.clearPendingContact();
    }
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

  contactUser(phone: string, cardName: string, type: TradeType) {
    const action = type === TradeType.VENDO ? 'comprar' : 'ofrecerte';
    const message = `Hola! Vi tu anuncio en TuMarketTCG. Me interesa ${action} la carta: ${cardName}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  public hasAnyPosts = computed(() => this.cardService.allPosts().length > 0);

  filteredPosts = computed(() => {
    let posts = this.cardService.allPosts(); // Suponiendo que tenés un signal en el service

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

  handleContactClick(post: any) {
    if (this.authService.currentUser()) {
      // Si está logueado, directo a WhatsApp
      this.contactUser(post.whatsappContact, post.cardName, post.type);
    } else {
      // Si NO está logueado, guardamos la info y vamos al login
      this.authService.setPendingContact({
        phone: post.whatsappContact,
        cardName: post.cardName,
        type: post.type
      });
      this.router.navigate(['/login']);
    }
  }

  clearFilters() {
    this.filterType.set(null);
    this.searchTerm.set('');
    this.router.navigate(['/']);
  }
}