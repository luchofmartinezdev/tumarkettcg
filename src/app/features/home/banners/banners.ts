import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './banners.html',
  styles: [`
    .banner-glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
    }
  `]
})
export class BannersComponent {
  private router = inject(Router);

  // Navegación directa a las rutas de landing
  navigateTo(type: 'vendo' | 'busco') {
    const dest = `/${type}`;
    this.router.navigate([dest]);
  }
}