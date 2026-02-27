import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardPost, TradeType } from '../../../core/models/site-config.model';
import { CardService } from '../../../core/services/card';
import { AuthService } from '../../../core/services/auth';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-posts.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MyPostsComponent {
  // Inyectamos el servicio para acceder a todos los posts (activos e inactivos)
  public cardService = inject(CardService);
  private authService = inject(AuthService);

  // Observable que va a contener la lista de cartas del usuario
  myPosts$: Observable<CardPost[]> = of([]);

  constructor() {
    // Leemos el usuario actual desde el Signal de nuestro AuthService
    const currentUser = this.authService.currentUser();

    if (currentUser) {
      // Si hay usuario, le pedimos sus cartas a Firebase
      this.myPosts$ = this.cardService.getUserPosts(currentUser.uid);
    }
  }

  // Exponemos el enum para usarlo en comparaciones si fuera necesario
  public TradeType = TradeType;

  /**
   * Cambia el estado de una publicación (Activo/Pausado).
   * Implementa la "Baja Lógica" solicitada.
   */
  onToggleStatus(id: string, currentStatus: boolean): void {
    this.cardService.toggleStatus(id, currentStatus);
  }

  /**
   * Elimina definitivamente una publicación del sistema.
   * Agregamos una confirmación nativa para evitar errores accidentales.
   */
  onDelete(id: string): void {
    if (confirm('¿Estás seguro de que querés eliminar esta publicación definitivamente?')) {
      this.cardService.deletePost(id);
    }
  }

  /**
   * Formatea la fecha de creación para mostrarla de forma amigable.
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}