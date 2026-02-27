import { Injectable, signal } from '@angular/core';
import { SiteConfig } from '../models/site-config.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  searchTerm = signal<string>('');

  private readonly config: SiteConfig = {
    logoName: 'POKÉMON STORE',
    navLinks: [
      { label: 'Productos', path: '/productos' },
      { label: 'Promos especiales', path: '/promos' },
      { label: 'Lo mas vendido', path: '/lo-mas-vendido' }
    ],
    hero: {
      title: 'EQUIPAMIENTO GAMING PROFESIONAL',
      subtitle: 'Llevá tu setup al siguiente nivel con lo último en hardware y periféricos.',
      ctaText: 'VER OFERTAS',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop'
    },
    featuredProducts: [

    ]
    ,
    footer: {
      description: 'POKEMON STORE tu tienda de cartas Pokémon de confianza.',
      address: 'Cordoba, Argentina',
      phone: '+54 9 351 557 5239',
      email: 'contacto@gmail.com',
      socials: [
        // { platform: 'Instagram', url: 'https://www.instagram.com/hadoukencba/' },
        // { platform: 'Facebook', url: 'https://www.facebook.com/Hadouken.Cordoba.Arg' },
        // { platform: 'Tiktok', url: 'https://www.tiktok.com/@hadoukencba' }
      ]
    }
  };

  getConfig(): SiteConfig {
    return this.config;
  }
}