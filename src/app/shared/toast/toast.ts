import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from '../../core/services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './toast.scss',
  templateUrl: './toast.html'
})
export class ToastComponent {
  public toastService = inject(ToastService);

  toastStyles(type: ToastType): string {
    const map: Record<string, string> = {
      success: 'background-color: #10b981;',
      error: 'background-color: #ef4444;',
      warning: 'background-color: #f59e0b;',
    };
    return map[type] ?? map['success'];
  }
}