import { Injectable, signal } from '@angular/core';
import { Category, GameFranchise, Language, PokemonCollection, SiteConfig } from '../models/site-config.model';

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
      {
        id: 1,
        name: 'Booster Box - Destined Rivals (Inglés)',
        price: 239900,
        franchise: GameFranchise.POKEMON,
        category: Category.BOOSTER_BOXES,
        collection: PokemonCollection.SCARLET_VIOLET,
        language: Language.INGLES,
        inStock: true,
        image: 'assets/images/products/BoosterBox_DestinedRivals.png'
      },
      {
        id: 2,
        name: 'Booster Bundle - Destined Rivals (Español)',
        price: 42500,
        franchise: GameFranchise.POKEMON,
        category: Category.BOOSTER_BUNDLES,
        collection: PokemonCollection.SCARLET_VIOLET,
        language: Language.ESPANOL,
        inStock: true,
        image: 'assets/images/products/BoosterBundle_DestinedRivals.png'
      },
      {
        id: 3,
        name: 'Elite Trainer Box - Destined Rivals (Inglés)',
        price: 94900,
        franchise: GameFranchise.POKEMON,
        category: Category.ETB,
        collection: PokemonCollection.SCARLET_VIOLET,
        language: Language.INGLES,
        inStock: false,
        image: 'assets/images/products/EliteTrainerBox_DestinedRivals.png'
      },

      // --- SERIE JOURNEY TOGETHER (Precio de entrada) ---
      {
        id: 4,
        name: 'Booster Box - Journey Together (Español)',
        price: 215000,
        franchise: GameFranchise.POKEMON,
        category: Category.BOOSTER_BOXES,
        collection: PokemonCollection.SWORD_SHIELD,
        language: Language.ESPANOL,
        inStock: true,
        image: 'assets/images/products/BoosterBox_JourneyTogether.png'
      },
      {
        id: 5,
        name: 'Elite Trainer Box - Journey Together (Inglés)',
        price: 87500,
        franchise: GameFranchise.POKEMON,
        category: Category.ETB,
        collection: PokemonCollection.SWORD_SHIELD,
        language: Language.INGLES,
        inStock: true,
        image: 'assets/images/products/EliteTrainerBox_JourneyTogether.png'
      },

      // --- SERIE ASCENDED HEROES (Premium) ---
      {
        id: 6,
        name: 'Booster Bundle - Ascended Heroes (Español)',
        price: 48900,
        franchise: GameFranchise.POKEMON,
        category: Category.BOOSTER_BUNDLES,
        collection: PokemonCollection.SCARLET_VIOLET,
        language: Language.ESPANOL,
        inStock: true,
        image: 'assets/images/products/BoosterBundle_AscendedHeroes.png'
      },
      {
        id: 7,
        name: 'Elite Trainer Box - Ascended Heroes (Inglés)',
        price: 98500,
        franchise: GameFranchise.POKEMON,
        category: Category.ETB,
        collection: PokemonCollection.SCARLET_VIOLET,
        language: Language.INGLES,
        inStock: true,
        image: 'assets/images/products/EliteTrainerBox_AscendedHeroes.png'
      },

      // --- BLACK VOLT & WHITE FLARE (Ediciones Especiales) ---
      {
        id: 8,
        name: 'Booster Bundle - Black Volt (Español)',
        price: 39900,
        franchise: GameFranchise.POKEMON,
        category: Category.BOOSTER_BUNDLES,
        collection: PokemonCollection.SWORD_SHIELD,
        language: Language.ESPANOL,
        inStock: true,
        image: 'assets/images/products/BoosterBundle_BlackVolt.png'
      },
      {
        id: 9,
        name: 'Elite Trainer Box - White Flare (Inglés)',
        price: 85000,
        franchise: GameFranchise.POKEMON,
        category: Category.ETB,
        collection: PokemonCollection.SWORD_SHIELD,
        language: Language.INGLES,
        inStock: true,
        image: 'assets/images/products/EliteTrainerBox_WhiteFlare.png'
      },

      // --- MEGA EVOLUTION (Coleccionista / High-End) ---
      {
        id: 10,
        name: 'Elite Trainer Box - Mega Evolution Vol. 1',
        price: 145000,
        franchise: GameFranchise.POKEMON,
        category: Category.ETB,
        collection: PokemonCollection.MEGA_EVOLUTION,
        language: Language.ESPANOL,
        inStock: true,
        image: 'assets/images/products/EliteTrainerBox_MegaEvolution1.png'
      },
      {
        id: 11,
        name: 'Elite Trainer Box - Mega Evolution Vol. 2',
        price: 145000,
        franchise: GameFranchise.POKEMON,
        category: Category.ETB,
        collection: PokemonCollection.MEGA_EVOLUTION,
        language: Language.ESPANOL,
        inStock: false,
        image: 'assets/images/products/EliteTrainerBox_MegaEvolution2.png'
      },

      // --- PRISMATIC EVOLUTIONS (Lanzamiento / Hype) ---
      {
        id: 12,
        name: 'Elite Trainer Box - Prismatic Evolutions',
        price: 115000,
        franchise: GameFranchise.POKEMON,
        category: Category.ETB,
        collection: PokemonCollection.SCARLET_VIOLET,
        language: Language.INGLES,
        inStock: true,
        isNew: true,
        image: 'assets/images/products/EliteTrainerBox_PrismaticEvolutions.png'
      },
      {
        id: 13,
        name: 'Booster Bundle - Phantasmal Flames',
        price: 44500,
        franchise: GameFranchise.POKEMON,
        category: Category.BOOSTER_BUNDLES,
        collection: PokemonCollection.SCARLET_VIOLET,
        language: Language.ESPANOL,
        inStock: true,
        image: 'assets/images/products/BoosterBundle_PhantasmalFlames.png'
      }
      // ,
      // {
      //   id: 14,
      //   name: 'Booster Box - Wild Force [SV5K] (Japonés)',
      //   price: 185900,
      //   category: Category.BOOSTER_BOXES,
      //   collection: PokemonCollection.SCARLET_VIOLET,
      //   language: Language.JAPONES,
      //   inStock: true,
      //   image: 'assets/images/products/BoosterBox_WildForce_JP.png'
      // },
      // {
      //   id: 15,
      //   name: 'Booster Box - Cyber Judge [SV5M] (Japonés)',
      //   price: 185900,
      //   category: Category.BOOSTER_BOXES,
      //   collection: PokemonCollection.SCARLET_VIOLET,
      //   language: Language.JAPONES,
      //   inStock: true,
      //   image: 'assets/images/products/BoosterBox_CyberJudge_JP.png'
      // },
      // {
      //   id: 16,
      //   name: 'Booster Bundle - Crimson Haze (Japonés)',
      //   price: 52500,
      //   category: Category.BOOSTER_BUNDLES,
      //   collection: PokemonCollection.SCARLET_VIOLET,
      //   language: Language.JAPONES,
      //   inStock: false, // Ejemplo de importación agotada
      //   image: 'assets/images/products/BoosterBundle_CrimsonHaze_JP.png'
      // },

      // // --- MÁS MEGA EVOLUCIÓN (Retro / Rarezas) ---
      // {
      //   id: 17,
      //   name: 'Blister Pack - Mega Rayquaza Edition',
      //   price: 18900,
      //   category: Category.BLISTER_PACKS,
      //   collection: PokemonCollection.MEGA_EVOLUTION,
      //   language: Language.INGLES,
      //   inStock: true,
      //   image: 'assets/images/products/Blister_MegaRayquaza.png'
      // },
      // {
      //   id: 18,
      //   name: 'Tins & Chests - Hoopa-EX Legendary Collection',
      //   price: 65000,
      //   category: Category.TINS_CHESTS,
      //   collection: PokemonCollection.MEGA_EVOLUTION,
      //   language: Language.ESPANOL,
      //   inStock: true,
      //   image: 'assets/images/products/Tin_HoopaEX.png'
      // },

      // // --- ESPADA Y ESCUDO (Stock Final) ---
      // {
      //   id: 19,
      //   name: 'Elite Trainer Box - Lost Origin',
      //   price: 89900,
      //   category: Category.ETB,
      //   collection: PokemonCollection.SWORD_SHIELD,
      //   language: Language.INGLES,
      //   inStock: true,
      //   image: 'assets/images/products/EliteTrainerBox_LostOrigin.png'
      // },
      // {
      //   id: 20,
      //   name: 'Booster Box - Evolving Skies (Español)',
      //   price: 450000, // Precio premium por rareza
      //   category: Category.BOOSTER_BOXES,
      //   collection: PokemonCollection.SWORD_SHIELD,
      //   language: Language.ESPANOL,
      //   inStock: true,
      //   isNew: false,
      //   image: 'assets/images/products/BoosterBox_EvolvingSkies.png'
      // }
      , {
        id: 21,
        name: 'Booster Box - Beyond Adventure [BT12]',
        price: 165000,
        franchise: GameFranchise.DIGIMON,
        collection: PokemonCollection.SCARLET_VIOLET,
        category: Category.BOOSTER_BOXES,
        language: Language.INGLES,
        inStock: true,
        image: 'assets/images/products/digimon_bt12.png'
      },

      // --- DRAGON BALL SUPER ---
      {
        id: 22,
        name: 'Critical Blow Booster Box [B22]',
        price: 158000,
        collection: PokemonCollection.SCARLET_VIOLET,
        franchise: GameFranchise.DRAGON_BALL,
        category: Category.BOOSTER_BOXES,
        language: Language.INGLES,
        inStock: true,
        image: 'assets/images/products/dbz_critical_blow.png'
      },

      // --- ACCESORIOS (El nuevo fuerte del margen) ---
      {
        id: 23,
        name: 'Carpeta Binder 9-Pocket - Black Edition',
        price: 35000, 
        franchise: GameFranchise.ACCESSORIES,
        category: Category.BINDER, 
        inStock: true,
        description: 'Carpeta de alta durabilidad con 9 bolsillos. Calidad competitiva para torneos.',
        image: 'assets/images/products/binder_black.png'
      },
      {
        id: 24,
        name: 'Folios Dragon Shield - Matte Crimson (100 u.)',
        price: 18500,
        franchise: GameFranchise.ACCESSORIES,
        category: Category.SLEEVES, 
        isNew: true,
        description: 'Folios de alta durabilidad con parte trasera texturizada. Calidad competitiva para torneos.',
        inStock: true,
        image: 'assets/images/products/sleeves_crimson.png'
      },
      {
        id: 101,
        name: 'Dragon Shield Matte - Slate (100 u.)',
        price: 22900,
        image: 'assets/images/products/sleeves-ds-slate.png',
        franchise: GameFranchise.ACCESSORIES,
        category: Category.SLEEVES, 
        isNew: false,
        description: 'Folios de alta durabilidad con parte trasera texturizada. Calidad competitiva para torneos.',
        inStock: true, 
      },
      {
        id: 102,
        name: 'Perfect Size KMC Sleeves (100 u.)',
        price: 9500,
        image: 'assets/images/products/kmc-perfect.png',
        franchise: GameFranchise.ACCESSORIES,
        category: Category.SLEEVES, 
        isNew: true,
        description: 'Folios internos para doble protección (double-sleeving). Ajuste milimétrico.',
        inStock: true, 
      },

      // --- ALMACENAMIENTO (BINDERS) ---
      {
        id: 103,
        name: 'Ultra Pro PRO-Binder 9-Pocket - Black',
        price: 45000,
        image: 'assets/images/products/binder-up-black.png',
        franchise: GameFranchise.ACCESSORIES,
        category: Category.BINDER, 
        isNew: false,
        description: 'Carpeta con hojas de carga lateral para evitar caídas. Capacidad para 360 cartas.',
        inStock: true, 
      },
      {
        id: 104,
        name: 'Vault X Premium Exo-Tec Binder - 12 Pocket',
        price: 62000,
        image: 'assets/images/products/binder-vx-12.png',
        franchise: GameFranchise.ACCESSORIES,
        category: Category.BINDER, 
        isNew: true,
        description: 'Carpeta premium con cierre de cremallera. Máxima seguridad para cartas de alto valor.',
        inStock: false, // Probando filtro de stock 
      },

      // --- TRANSPORTE (DECK BOXES) ---
      {
        id: 105,
        name: 'Gamegenic Watchtower 100+ XL - Blue',
        price: 39500,
        image: 'assets/images/products/deckbox-gg-blue.png',
        franchise: GameFranchise.ACCESSORIES,
        category: Category.DECK_BOX, 
        isNew: true,
        description: 'Caja para mazo con cajón para dados y accesorios. Cierre magnético extra fuerte.',
        inStock: true, 
      },
      {
        id: 106,
        name: 'Ultimate Guard Flip\'n\'Tray 80+ Xenoskin',
        price: 34000,
        image: 'assets/images/products/deckbox-ug-green.png',
        franchise: GameFranchise.ACCESSORIES,
        category: Category.DECK_BOX, 
        isNew: false,
        description: 'Material antideslizante Xenoskin con forro interno de microfibra.',
        inStock: true, 
      }
    ],
    footer: {
      description: 'POKEMON STORE tu tienda de cartas Pokémon de confianza.',
      address: 'Cordoba, Argentina',
      phone: '+54 9 351 557 5239',
      email: 'contacto@gmail.com',
      socials: [
        { platform: 'Instagram', url: 'https://www.instagram.com/hadoukencba/' },
        { platform: 'Facebook', url: 'https://www.facebook.com/Hadouken.Cordoba.Arg' },
        { platform: 'Tiktok', url: 'https://www.tiktok.com/@hadoukencba' }
      ]
    }
  };

  getConfig(): SiteConfig {
    return this.config;
  }
}