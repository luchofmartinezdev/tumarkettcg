import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedbackService } from '../../../core/services/feedback';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-form.html'
})
export class FeedbackFormComponent {
  private feedbackService = inject(FeedbackService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public content = signal('');
  public category = signal('Sugerencia');
  public isSubmitting = signal(false);

  public categories = [
    'Sugerencia',
    'Error (Bug)',
    'Elogio',
    'Otro'
  ];

  async submit() {
    const user = this.authService.currentUser();
    if (!user) {
      this.toastService.error('Debes iniciar sesión para enviar feedback');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.content().trim()) {
      this.toastService.warning('El mensaje no puede estar vacío');
      return;
    }

    this.isSubmitting.set(true);
    try {
      await this.feedbackService.submitFeedback({
        userId: user.uid,
        userName: user.displayName || 'Anónimo',
        userEmail: user.email || 'Sin email',
        content: this.content(),
        category: this.category()
      });
      this.toastService.success('¡Gracias por tu feedback! Lo revisaremos pronto.');
      this.router.navigate(['/']);
    } catch (err) {
      this.toastService.error('Error al enviar el feedback. Intenta más tarde.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
