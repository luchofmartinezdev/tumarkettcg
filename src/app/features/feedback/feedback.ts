import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackService, UserFeedback } from '../../core/services/feedback';
import { ToastService } from '../../core/services/toast';
import { take } from 'rxjs';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.html'
})
export class FeedbackComponent {
  private feedbackService = inject(FeedbackService);
  private toastService = inject(ToastService);

  public feedbacks = signal<UserFeedback[]>([]);
  public isLoading = signal(true);

  constructor() {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.feedbackService.getFeedbacks().subscribe({
      next: (data) => {
        this.feedbacks.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading feedbacks:', err);
        this.toastService.error('No se pudieron cargar los feedbacks');
        this.isLoading.set(false);
      }
    });
  }

  async updateStatus(feedback: UserFeedback, newStatus: UserFeedback['status']) {
    if (!feedback.id) return;
    try {
      await this.feedbackService.updateStatus(feedback.id, newStatus);
      this.toastService.success('Estado actualizado');
    } catch (err) {
      this.toastService.error('Error al actualizar estado');
    }
  }

  async deleteFeedback(id: string | undefined) {
    if (!id || !confirm('¿Estás seguro de eliminar este feedback?')) return;
    try {
      await this.feedbackService.deleteFeedback(id);
      this.toastService.success('Feedback eliminado');
    } catch (err) {
      this.toastService.error('Error al eliminar');
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'reviewed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}
