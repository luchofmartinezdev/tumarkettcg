import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Footer } from "./shared/footer/footer";
import { Navbar } from "./shared/navbar/navbar";
import { ToastComponent } from './shared/toast/toast';
import { ThemeService } from './core/services/theme';

@Component({
  selector: 'app-root',
  imports: [Footer, RouterModule, Navbar, RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public router = inject(Router);
  public isLoading = signal(false);
  // Inyectar para forzar la inicialización del ThemeService al arrancar la app
  private _theme = inject(ThemeService);

  constructor() {
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
}