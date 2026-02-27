export enum TradeType {
  VENDO = 'Vendo',
  BUSCO = 'Busco'
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