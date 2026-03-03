export enum TradeType {
  VENDO = 'Vendo',
  BUSCO = 'Busco'
}

export enum Currency {
  ARS = 'ARS',
  USD = 'USD'
}

export enum SortOption {
  RECENT = 'Más recientes',
  AZ = 'Nombre (A-Z)',
  ZA = 'Nombre (Z-A)'
}

export enum CardCondition {
  MINT = 'Impecable (Mint)',
  NEAR_MINT = 'Casi Nueva (NM)',
  EXCELLENT = 'Excelente (LP)',
  PLAYED = 'Usada (MP)',
  HEAVY_PLAYED = 'Muy Usada (HP)',
  POOR = 'Dañada (Poor)'
}

export enum CardLanguage {
  ES = 'Español',
  EN = 'Inglés',
  JP = 'Japonés',
  PT = 'Portugués',
  ZH = 'Chino',
  KO = 'Coreano',
  IT = 'Italiano'
}

export enum Franchise {
  POKEMON = 'Pokémon',
  MAGIC = 'Magic',
  YUGIOH = 'Yu-Gi-Oh!',
  ONE_PIECE = 'One Piece',
  DRAGON_BALL = 'Dragon Ball Super',
  LORCANA = 'Lorcana',
  DIGIMON = 'Digimon',
}

// Interfaz para definir la estructura de cada rareza
export interface RarityOption {
  value: string; // Lo que se guarda en la DB (id)
  label: string; // Lo que ve el usuario (Español/Inglés)
}

// El Mapa Maestro de Rarezas por Franquicia
export const RARITIES_BY_FRANCHISE: Record<Franchise, RarityOption[]> = {
  [Franchise.POKEMON]: [
    { value: 'COMMON', label: 'Common (Común)' },
    { value: 'UNCOMMON', label: 'Uncommon (Infrecuente)' },
    { value: 'RARE', label: 'Rare (Rara)' },
    { value: 'DOUBLE_RARE', label: 'Double Rare (RR)' },
    { value: 'ULTRA_RARE', label: 'Ultra Rare (UR)' },
    { value: 'ILLUSTRATION_RARE', label: 'Illustration Rare (IR)' },
    { value: 'SIR', label: 'Special Illustration Rare (SIR)' },
    { value: 'HYPER_RARE', label: 'Hyper Rare (HR/Gold)' }
  ],
  [Franchise.MAGIC]: [
    { value: 'COMMON', label: 'Common (Común)' },
    { value: 'UNCOMMON', label: 'Uncommon (Infrecuente)' },
    { value: 'RARE', label: 'Rare (Rara)' },
    { value: 'MYTHIC', label: 'Mythic Rare (Mítica)' },
    { value: 'SPECIAL', label: 'Special (Especial)' }
  ],
  [Franchise.YUGIOH]: [
    { value: 'COMMON', label: 'Common (Común)' },
    { value: 'RARE', label: 'Rare (Rara)' },
    { value: 'SUPER_RARE', label: 'Super Rare' },
    { value: 'ULTRA_RARE', label: 'Ultra Rare' },
    { value: 'SECRET_RARE', label: 'Secret Rare' },
    { value: 'ULTIMATE_RARE', label: 'Ultimate Rare' },
    { value: 'QCSR', label: 'Quarter Century Secret Rare' },
    { value: 'STARLIGHT', label: 'Starlight Rare' }
  ],
  [Franchise.ONE_PIECE]: [
    { value: 'C', label: 'Common (C)' },
    { value: 'UC', label: 'Uncommon (UC)' },
    { value: 'R', label: 'Rare (R)' },
    { value: 'SR', label: 'Super Rare (SR)' },
    { value: 'SEC', label: 'Secret Rare (SEC)' },
    { value: 'LEADER', label: 'Leader (L)' },
    { value: 'MANGA', label: 'Manga Rare' }
  ],
  [Franchise.DRAGON_BALL]: [
    { value: 'C', label: 'Common' },
    { value: 'UC', label: 'Uncommon' },
    { value: 'R', label: 'Rare' },
    { value: 'SR', label: 'Super Rare' },
    { value: 'SCR', label: 'Secret Rare' },
    { value: 'GDR', label: 'God Rare' }
  ],
  [Franchise.LORCANA]: [
    { value: 'COMMON', label: 'Common' },
    { value: 'UNCOMMON', label: 'Uncommon' },
    { value: 'RARE', label: 'Rare' },
    { value: 'SUPER_RARE', label: 'Super Rare' },
    { value: 'LEGENDARY', label: 'Legendary' },
    { value: 'ENCHANTED', label: 'Enchanted' }
  ],
  [Franchise.DIGIMON]: [
    { value: 'C', label: 'Common' },
    { value: 'U', label: 'Uncommon' },
    { value: 'R', label: 'Rare' },
    { value: 'SR', label: 'Super Rare' },
    { value: 'SEC', label: 'Secret Rare' },
    { value: 'PARALLEL', label: 'Parallel Rare (Alt Art)' }
  ]
};

export interface SellerRating {
  id: string;
  sellerId: string;
  raterId: string;
  stars: number;
  createdAt: Date;
}

export interface UserProfile {
  uid: string;
  slug?: string;
  displayName: string;
  photoURL?: string;
  location?: string;        // ciudad/provincia opcional
  showLocation: boolean;    // el usuario elige si mostrarla
  totalSales: number;       // ventas realizadas
  createdAt: Date;
}

export enum CardRarity {
  COMMON = 'Común',
  UNCOMMON = 'Poco común',
  RARE = 'Raro',
  ULTRA_RARE = 'Ultra raro',
  SECRET_RARE = 'Raro secreto'
}

export interface CardPost {
  id: string;            // El ID del documento en Firestore
  userId: string;        // <--- EL CAMPO CLAVE (El uid de Firebase Auth)
  userName: string;      // El nombre para mostrar en la UI (ej: Lucho)
  slug?: string;
  userSlug?: string;
  cardName: string;
  franchise: Franchise;
  price?: number;
  currency?: Currency;
  condition: CardCondition;
  type: TradeType;
  whatsappContact: string;
  createdAt: Date;       // O Timestamp si usás el formato nativo de Firebase
  active: boolean;
  isSold?: boolean;
  buyerName?: string;
  soldAt?: Date;
  description: string;
  language: CardLanguage;
  rarity: CardRarity;

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