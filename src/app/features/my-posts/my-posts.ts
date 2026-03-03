import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../core/services/cardService';
import { AuthService } from '../../core/services/auth';
import { CardPost, TradeType } from '../../core/models/site-config.model';
import { Observable, of } from 'rxjs';
import { ToastService } from '../../core/services/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-posts.html',
  styles: [`:host { display: block; }`]
})
export class MyPostsComponent {
  public cardService = inject(CardService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  myPosts$: Observable<CardPost[]> = of([]);
  public TradeType = TradeType;

  // Modal
  public showSellModal = signal(false);
  public selectedPost = signal<CardPost | null>(null);
  public buyerName = signal('');

  constructor() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.myPosts$ = this.cardService.getUserPosts(currentUser.uid);
    }

    const toastState = window.history.state?.['toast'];
    if (toastState === 'created' || toastState === 'updated') {
      setTimeout(() => {
        if (toastState === 'created') {
          this.toastService.success('¡Publicación creada correctamente!');
        } else {
          this.toastService.success('¡Publicación actualizada correctamente!');
        }
      }, 100);
    }
  }

  onToggleStatus(id: string, currentStatus: boolean): void {
    this.cardService.toggleStatus(id, currentStatus);
  }

  onDelete(post: CardPost): void {
    if (confirm('¿Estás seguro de que querés eliminar esta publicación definitivamente?')) {
      this.cardService.deletePost(post.id, post.imagePath);
    }
  }

  openSellModal(post: CardPost): void {
    this.selectedPost.set(post);
    this.buyerName.set('');
    this.showSellModal.set(true);
  }

  closeSellModal(): void {
    this.showSellModal.set(false);
    this.selectedPost.set(null);
  }

  async confirmSell(): Promise<void> {
    const post = this.selectedPost();
    if (!post) return;
    await this.cardService.markAsSold(post.id, this.buyerName() || undefined);
    this.closeSellModal();
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}