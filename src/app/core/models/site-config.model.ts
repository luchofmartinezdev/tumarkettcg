export enum TradeType {
  VENDO = 'Vendo',
  BUSCO = 'Busco'
}

export enum SortOption {
  RECENT = 'Más recientes',
  AZ = 'Nombre (A-Z)',
  ZA = 'Nombre (Z-A)'
}

export enum Condition {
  MINT = 'Impecable',
  NEAR_MINT = 'Casi Nueva',
  PLAYED = 'Usada',
  POOR = 'Dañada'
}

export enum Franchise {
  POKEMON = 'Pokémon',
  MAGIC = 'Magic',
  YUGIOH = 'Yu-Gi-Oh!',
  ONE_PIECE = 'One Piece',
  DRAGON_BALL = 'Dragon Ball Super',
  LORCANA = 'Lorcana',
  DIGIMON = 'Digimon'

}

export interface CardPost {
  id: string;            // El ID del documento en Firestore
  userId: string;        // <--- EL CAMPO CLAVE (El uid de Firebase Auth)
  userName: string;      // El nombre para mostrar en la UI (ej: Lucho)
  cardName: string;
  franchise: Franchise;
  price?: number;
  condition: Condition;
  type: TradeType;
  whatsappContact: string;
  createdAt: Date;       // O Timestamp si usás el formato nativo de Firebase
  active: boolean;
  description: string;

  // --- CAMPOS NUEVOS PARA IMÁGENES ---
  imageUrl?: string;     // La URL pública para mostrar en la web (<img> src)
  imagePath?: string;    // La ruta interna en Storage (ej: 'posts/123_foto.jpg')
}

export interface SiteConfig {
  logoName: string;
  navLinks: { label: string; path: string }[];
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    imageUrl: string;
  };
  featuredProducts: CardPost[];
  footer: {
    description: string;
    address: string;
    phone: string;
    email: string;
    socials: { platform: string; url: string }[];
  };
}

export interface ContactRecord {
  id: string;
  userId: string;          // quien contactó
  sellerId: string;        // uid del vendedor
  sellerName: string;      // nombre del vendedor
  postId: string;          // id de la publicación
  cardName: string;        // nombre de la carta
  whatsappContact: string; // para el botón "volver a contactar"
  type: TradeType;         // VENDO o BUSCO
  contactedAt: Date;       // fecha del contacto
}

export interface FavoriteRecord {
  id: string;
  userId: string;
  postId: string;
  cardName: string;
  imageUrl?: string;
  franchise: Franchise;
  savedAt: Date;
}