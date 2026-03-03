import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Footer } from "./shared/footer/footer";
import { Navbar } from "./shared/navbar/navbar";
import { ToastComponent } from './shared/toast/toast';
import { ToastService } from './core/services/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Footer, RouterModule, Navbar, RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public router = inject(Router);
  private toastService = inject(ToastService);
  public isLoading = signal(false);

  constructor() {
    console.log('App - instancia del servicio:', this.toastService);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading.set(false);
      }
    });
  }

  // app.ts - agregá este método
  testToast() {
    this.toastService.success('Toast de prueba');
    console.log('toasts en App:', this.toastService.toasts());
  }
}