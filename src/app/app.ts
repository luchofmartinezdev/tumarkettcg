import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterModule, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Footer } from "./shared/footer/footer";
import { Navbar } from "./shared/navbar/navbar";
import { ToastComponent } from './shared/toast/toast';
import { ThemeService } from './core/services/theme';
import { ContentService } from './core/services/content';
import { CollectionResolverService } from './core/services/collection-resolver';
import { MaintenanceComponent } from './features/maintenance/maintenance';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Footer, RouterModule, Navbar, RouterOutlet, ToastComponent, MaintenanceComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public router = inject(Router);
  public isLoading = signal(false);
  public siteContent = inject(ContentService);
  private resolver = inject(CollectionResolverService);

  // Maintenance logic: block if maintenance is ON and user is NOT admin
  public isMaintenanceActive = computed(() => {
    return this.siteContent.maintenanceMode() && !this.resolver.isAdmin();
  });
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