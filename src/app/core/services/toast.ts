import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: ToastType = 'success', duration = 3500) {
    const id = ++this.counter;
    this.toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number) {
    console.log('remove llamado para id:', id, new Date().toISOString());
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error', 5000); }
  warning(message: string) { this.show(message, 'warning'); }
}