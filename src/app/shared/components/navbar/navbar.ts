import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CardService } from '../../../core/services/card';
import { TradeType } from '../../../core/models/site-config.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {

  public authService = inject(AuthService);
  private cardService = inject(CardService);
  private router = inject(Router);

  // Signals para reactividad fluida
  public searchTerm = signal('');
  public showResults = signal(false);

  public TradeType = TradeType;

  // Computamos los resultados: Máximo 3 para el dropdown
  public quickResults = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (term.length < 3) return [];

    return this.cardService.allPosts()
      .filter(post =>
        post.cardName.toLowerCase().includes(term) ||
        post.franchise.toLowerCase().includes(term)
      );
  });

  onSearchInput(term: string) {
    this.searchTerm.set(term);
    this.showResults.set(term.length >= 3);
  }

  goToPost(id: string) {
    if (!id) return;

    // 1. Navegamos al detalle
    this.router.navigate(['/card', id]);

    // 2. Limpiamos el buscador (Kernel Studio quality check)
    this.searchTerm.set(''); // O el signal que uses para el input
    this.showResults.set(false);
  }

  viewAll() {
    const term = this.searchTerm();
    this.router.navigate(['/buscar'], { queryParams: { q: term } });
    this.showResults.set(false);
  }

  closeResults() {
    // El delay es para que el click en el resultado se procese 
    // antes de que el dropdown desaparezca del DOM
    setTimeout(() => {
      this.showResults.set(false);
    }, 200);
  }
}