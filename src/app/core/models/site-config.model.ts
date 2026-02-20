export interface NavLink {
  label: string;
  path: string;
}

export enum Language {
  ESPANOL = 'Español',
  INGLES = 'Inglés',
  JAPONES = 'Japonés'
}

export enum Category {
  BOOSTER_BOXES = 'BOOSTER BOXES',
  BOOSTER_PACKS = 'BOOSTER PACKS',
  BOOSTER_BUNDLES = 'BOOSTER BUNDLES',
  ETB = 'ELITE TRAINER BOXES',
  TINS_CHESTS = 'TINS & CHESTS',
  BLISTER_PACKS = 'BLISTER PACKS',
  BINDER = 'Binder / Carpeta',
  SLEEVES = 'Folios / Sleeves',
  DECK_BOX = 'Deck Box'
}

export enum GameFranchise {
  POKEMON = 'Pokémon',
  DIGIMON = 'Digimon',
  DRAGON_BALL = 'Dragon Ball',
  ONE_PIECE = 'One Piece',
  ACCESSORIES = 'Accesorios',
  TODOS = "TODOS"
}

export enum PokemonCollection {
  MEGA_EVOLUTION = 'Mega Evolución',
  SCARLET_VIOLET = 'Escarlata y Púrpura',
  SWORD_SHIELD = 'Espada y Escudo'
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  franchise: GameFranchise;
  category: Category;
  inStock: boolean;

  // --- Opcionales por diversidad de productos ---
  brand?: string;             // 'Dragon Shield', 'The Pokémon Company'
  collection?: PokemonCollection;
  collectionImage?: string;
  language?: Language;        // Opcional para accesorios
  isNew?: boolean;
  description?: string;
  discountPrice?: number;     // Para ofertas relámpago
  stockQuantity?: number;     // Para manejar urgencia: "Quedan 3"
}

export interface SiteConfig {
  logoName: string;
  navLinks: NavLink[];
  // Agregamos el objeto hero aquí
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    imageUrl: string; // Para que la imagen también sea personalizable
  };
  featuredProducts: Product[];
  footer: {
    description: string;
    address: string;
    phone: string;
    email: string;
    socials: { platform: string; url: string }[];
  };


}

export interface CartItem extends Product {
  quantity: number;
}

export enum ProductSort {
  RELEVANCIA = 'Relevancia',
  PRECIO_MENOR = 'Precio: Menor a Mayor',
  PRECIO_MAYOR = 'Precio: Mayor a Menor',
  NOMBRE = 'Nombre: A-Z'
}