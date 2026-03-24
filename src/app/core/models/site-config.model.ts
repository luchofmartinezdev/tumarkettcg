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

// Interfaz para definir la estructura de cada set/expansión
export interface SetOption {
  id: string;    // Ejemplo: 'SV01', 'OP05'
  name: string;  // Ejemplo: 'Scarlet & Violet', 'Romance Dawn'
}

// Nueva interfaz para agrupar sets por Series/Eras
export interface SeriesOption {
  name: string;
  sets: SetOption[];
}

// El Mapa Maestro de Rarezas por Franquicia
export const RARITIES_BY_FRANCHISE: Record<Franchise, RarityOption[]> = {
  [Franchise.POKEMON]: [
    { value: 'COMMON', label: 'Common (Común - ●)' },
    { value: 'UNCOMMON', label: 'Uncommon (Infrecuente - ◆)' },
    { value: 'RARE', label: 'Rare (Rara - ★)' },
    { value: 'HOLO_RARE', label: 'Holo Rare (Rara Holo)' },
    { value: 'DOUBLE_RARE', label: 'Double Rare (RR)' },
    { value: 'ULTRA_RARE', label: 'Ultra Rare (UR)' },
    { value: 'ILLUSTRATION_RARE', label: 'Illustration Rare (IR)' },
    { value: 'SIR', label: 'Special Illustration Rare (SIR)' },
    { value: 'HYPER_RARE', label: 'Hyper Rare (HR/Gold)' },
    { value: 'PROMO', label: 'Promo' }
  ],
  [Franchise.MAGIC]: [
    { value: 'COMMON', label: 'Common (Común - Negro)' },
    { value: 'UNCOMMON', label: 'Uncommon (Infrecuente - Plata)' },
    { value: 'RARE', label: 'Rare (Rara - Oro)' },
    { value: 'MYTHIC', label: 'Mythic Rare (Mítica - Bronce)' },
    { value: 'SPECIAL', label: 'Special (Especial)' },
    { value: 'LAND', label: 'Basic Land' }
  ],
  [Franchise.YUGIOH]: [
    { value: 'COMMON', label: 'Common (Común)' },
    { value: 'RARE', label: 'Rare (Rara)' },
    { value: 'SUPER_RARE', label: 'Super Rare' },
    { value: 'ULTRA_RARE', label: 'Ultra Rare' },
    { value: 'SECRET_RARE', label: 'Secret Rare' },
    { value: 'ULTIMATE_RARE', label: 'Ultimate Rare' },
    { value: 'COLLECTORS_RARE', label: 'Collector\'s Rare' },
    { value: 'QCSR', label: 'Quarter Century Secret Rare' },
    { value: 'STARLIGHT', label: 'Starlight Rare' },
    { value: 'GHOST', label: 'Ghost Rare' }
  ],
  [Franchise.ONE_PIECE]: [
    { value: 'C', label: 'Common (C)' },
    { value: 'UC', label: 'Uncommon (UC)' },
    { value: 'R', label: 'Rare (R)' },
    { value: 'SR', label: 'Super Rare (SR)' },
    { value: 'SEC', label: 'Secret Rare (SEC)' },
    { value: 'L', label: 'Leader (L)' },
    { value: 'SP', label: 'Special (SP)' },
    { value: 'MANGA', label: 'Manga Rare' }
  ],
  [Franchise.DRAGON_BALL]: [
    { value: 'C', label: 'Common (C)' },
    { value: 'UC', label: 'Uncommon (UC)' },
    { value: 'R', label: 'Rare (R)' },
    { value: 'SR', label: 'Super Rare (SR)' },
    { value: 'SPR', label: 'Special Rare (SPR)' },
    { value: 'SCR', label: 'Secret Rare (SCR)' },
    { value: 'GDR', label: 'God Rare (GDR)' },
    { value: 'L', label: 'Leader (L)' }
  ],
  [Franchise.LORCANA]: [
    { value: 'COMMON', label: 'Common (Círculo)' },
    { value: 'UNCOMMON', label: 'Uncommon (Libro)' },
    { value: 'RARE', label: 'Rare (Triángulo)' },
    { value: 'SUPER_RARE', label: 'Super Rare (Diamante)' },
    { value: 'LEGENDARY', label: 'Legendary (Pentágono)' },
    { value: 'ENCHANTED', label: 'Enchanted (Hexágono)' }
  ],
  [Franchise.DIGIMON]: [
    { value: 'C', label: 'Common (C)' },
    { value: 'U', label: 'Uncommon (U)' },
    { value: 'R', label: 'Rare (R)' },
    { value: 'SR', label: 'Super Rare (SR)' },
    { value: 'SEC', label: 'Secret Rare (SEC)' },
    { value: 'PARALLEL', label: 'Parallel Rare (AA)' }
  ]
};

// Mapa para Sets Internacionales (ES, EN)
export const SETS_BY_FRANCHISE: Record<Franchise, SeriesOption[]> = {
  [Franchise.POKEMON]: [
    {
      name: 'Mega Evolution Era (2025-2026)',
      sets: [
        { id: 'ASC', name: 'Ascended Heroes' }, 
        { id: 'POR', name: 'Perfect Order (Próximamente)' }, 
        { id: 'CHA', name: 'Chaos Rising (Próximamente)' },
        { id: 'PFL', name: 'Phantasmal Flames' }, 
        { id: 'MEG', name: 'Mega Evolution Base' }
      ]
    },
    {
      name: 'Scarlet & Violet Series (2023-2025)',
      sets: [
        { id: 'WF', name: 'White Flare' }, { id: 'BB', name: 'Black Bolt' },
        { id: 'DR', name: 'Destined Rivals' }, { id: 'JT', name: 'Journey Together' }, { id: 'PRE', name: 'Prismatic Evolutions' },
        { id: 'SSP', name: 'Surging Sparks' }, { id: 'SCR', name: 'Stellar Crown' }, { id: 'SFA', name: 'Shrouded Fable' },
        { id: 'TWM', name: 'Twilight Masquerade' }, { id: 'TEF', name: 'Temporal Forces' }, { id: 'PAF', name: 'Paldean Fates' },
        { id: 'PAR', name: 'Paradox Rift' }, { id: 'MEW', name: 'Pokémon 151' }, { id: 'OBF', name: 'Obsidian Flames' },
        { id: 'PAL', name: 'Paldea Evolved' }, { id: 'SVI', name: 'Scarlet & Violet' }
      ]
    },
    {
      name: 'Sword & Shield Series',
      sets: [
        { id: 'CRZ', name: 'Crown Zenith' }, { id: 'SIT', name: 'Silver Tempest' }, { id: 'LOR', name: 'Lost Origin' },
        { id: 'PGO', name: 'Pokémon GO' }, { id: 'ASR', name: 'Astral Radiance' }, { id: 'BRS', name: 'Brilliant Stars' },
        { id: 'FST', name: 'Fusion Strike' }, { id: 'CEL', name: 'Celebrations' }, { id: 'EVS', name: 'Evolving Skies' },
        { id: 'CRE', name: 'Chilling Reign' }, { id: 'BST', name: 'Battle Styles' }, { id: 'SHF', name: 'Shining Fates' },
        { id: 'VIV', name: 'Vivid Voltage' }, { id: 'CPA', name: 'Champion\'s Path' }, { id: 'DAA', name: 'Darkness Ablaze' },
        { id: 'RCL', name: 'Rebel Clash' }, { id: 'SSH', name: 'Sword & Shield' }, { id: 'PR-SW', name: 'SWSH Black Star Promos' }
      ]
    },
    {
      name: 'Sun & Moon Series',
      sets: [
        { id: 'CEC', name: 'Cosmic Eclipse' }, { id: 'HIF', name: 'Hidden Fates' }, { id: 'UNM', name: 'Unified Minds' },
        { id: 'UNB', name: 'Unbroken Bonds' }, { id: 'TEU', name: 'Team Up' }, { id: 'LOT', name: 'Lost Thunder' },
        { id: 'BUS', name: 'Burning Shadows' }, { id: 'SUM', name: 'Sun & Moon' }
      ]
    },
    {
      name: 'Vintage / Classic',
      sets: [
        { id: 'NEO', name: 'Neo Genesis' }, { id: 'TR', name: 'Team Rocket' }, { id: 'FO', name: 'Fossil' },
        { id: 'JU', name: 'Jungle' }, { id: 'BS', name: 'Base Set' }
      ]
    }
  ],
  [Franchise.MAGIC]: [
    {
      name: 'Universes Beyond & Future (2025-2026)',
      sets: [
        { id: 'TREK', name: 'Star Trek' }, { id: 'HBT', name: 'The Hobbit' }, { id: 'MARV', name: 'Marvel Super Heroes' },
        { id: 'TMNT', name: 'TMNT' }, { id: 'AVT', name: 'Avatar: The Last Airbender' }, { id: 'SPDR', name: 'Marvel\'s Spider-Man' },
        { id: 'FF', name: 'Final Fantasy' }
      ]
    },
    {
      name: 'Standard Era (2025-2026)',
      sets: [
        { id: 'RF', name: 'Reality Fracture' }, { id: 'STX2', name: 'Secrets of Strixhaven' }, { id: 'LRW2', name: 'Lorwyn Eclipsed' },
        { id: 'EOE', name: 'Edge of Eternities' }, { id: 'TDS', name: 'Tarkir: Dragonstorm' }, { id: 'DFT', name: 'Aetherdrift' },
        { id: 'IR', name: 'Innistrad Remastered' }
      ]
    },
    {
      name: 'Modern Era (2021-2024)',
      sets: [
        { id: 'FDN', name: 'Foundations' }, { id: 'DSK', name: 'Duskmourn' }, { id: 'BLB', name: 'Bloomburrow' },
        { id: 'OTJ', name: 'Outlaws of Thunder Junction' }, { id: 'MKM', name: 'Murders at Karlov Manor' },
        { id: 'LCI', name: 'Lost Caverns of Ixalan' }
      ]
    },
    {
      name: 'Retro / Vintage',
      sets: [
        { id: 'LEA', name: 'Alpha' }, { id: 'LEG', name: 'Legends' }, { id: 'INV', name: 'Invasion' }
      ]
    }
  ],
  [Franchise.YUGIOH]: [
    {
      name: 'Universe 13 Era (2025-2026)',
      sets: [
        { id: 'GLG', name: 'Battles of Legend: Glorious Gallery (Próximamente)' }, 
        { id: 'BD', name: 'Blazing Dominion (Próximamente)' },
        { id: 'RC5', name: 'Rarity Collection 5 (Próximamente)' }, 
        { id: 'MMU', name: 'Maze of Muertos' }, 
        { id: 'BPRO', name: 'Burst Protocol' }
      ]
    },
    {
      name: 'Modern Universe (2024-2025)',
      sets: [
        { id: 'PRV', name: 'Phantom Revenge' }, { id: 'DOD', name: 'Doom of Dimensions' }, { id: 'MMY', name: 'Battles of Legend: Monster Mayhem' },
        { id: 'AI', name: 'Alliance Insight' }, { id: 'QCS', name: 'Quarter Century Stampede' }, { id: 'MMT', name: 'Maze of the Master' },
        { id: 'BWD', name: 'Blue-Eyes White Destiny' }, { id: 'SDK', name: 'Supreme Darkness' }, { id: 'ROTA', name: 'Rage of the Abyss' },
        { id: 'INFO', name: 'The Infinite Forbidden' }, { id: 'LEDE', name: 'Legacy of Destruction' }, { id: 'PHNI', name: 'Phantom Nightmare' },
        { id: 'AGOV', name: 'Age of Overlord' }
      ]
    },
    {
      name: 'Original Era (Duel Monsters)',
      sets: [
        { id: 'LOB', name: 'Legend of Blue Eyes' }, { id: 'MRD', name: 'Metal Raiders' }, { id: 'PSV', name: 'Pharaoh\'s Servant' }
      ]
    }
  ],
  [Franchise.ONE_PIECE]: [
    {
      name: 'Empress & Kami Eras (2025-2026)',
      sets: [
        { id: 'OP15', name: 'Adventure on Kami\'s Island (Próximamente)' }, 
        { id: 'OP14', name: 'The Azure Sea\'s Seven' },
        { id: 'OP13', name: 'Inherited Will' },
        { id: 'OP12', name: 'Legacy of the Master' }, 
        { id: 'OP11', name: 'A Fist of Divine Speed' }
      ]
    },
    {
      name: 'Booster Sets (Classical)',
      sets: [
        { id: 'OP01', name: 'Romance Dawn' }, { id: 'OP02', name: 'Paramount War' },
        { id: 'OP05', name: 'Awakening of the New Era' }, { id: 'OP09', name: 'The New Genesis' }
      ]
    }
  ],
  [Franchise.LORCANA]: [
    {
      name: 'Chapters',
      sets: [
        { id: 'P1', name: 'The First Chapter' }, { id: 'P2', name: 'Rise of the Floodborn' },
        { id: 'P6', name: 'Azurite Sea' }
      ]
    }
  ],
  [Franchise.DRAGON_BALL]: [
    {
      name: 'Fusion World',
      sets: [
        { id: 'FB01', name: 'Awakened Pulse' }, { id: 'FB04', name: 'Beyond Ultimatum' }
      ]
    },
    {
      name: 'Masters Series',
      sets: [
        { id: 'BT01', name: 'Galactic Battle' }, { id: 'Z01', name: 'Dawn of the Z-Legends' }
      ]
    }
  ],
  [Franchise.DIGIMON]: [
    {
      name: 'Main Boosters',
      sets: [
        { id: 'BT01', name: 'New Evolution' }, { id: 'BT19', name: 'Xros Evolution' }
      ]
    }
  ]
};

// Mapa para Sets Japoneses (JP) - Basado en la investigación de agrupaciones OCG/JP
export const SETS_BY_FRANCHISE_JP: Record<Franchise, SeriesOption[]> = {
  [Franchise.POKEMON]: [
    {
      name: 'Mega Expansion JP (2026)',
      sets: [
        { id: 'M5', name: 'Abyss Eye (Próximamente)' },
        { id: 'M4', name: 'Ninja Spinner (Próximamente)' },
        { id: 'M3', name: 'Nihil Zero' }
      ]
    },
    {
      name: 'Terastal Era JP (2024-2025)',
      sets: [
        { id: 'SV8a', name: 'Terastal Festival ex' }, { id: 'SV8', name: 'Super Electric Breaker' },
        { id: 'SV7a', name: 'Paradise Dragona' }, { id: 'SV7', name: 'Stellar Miracle' }, { id: 'SV6a', name: 'Night Wanderer' },
        { id: 'SV6', name: 'Mask of Change' }, { id: 'SV5a', name: 'Crimson Haze' }
      ]
    },
    {
      name: 'Scarlet & Violet JP Series',
      sets: [
        { id: 'SV4a', name: 'Shiny Treasure ex' }, { id: 'SV3a', name: 'Raging Surf' },
        { id: 'SV2a', name: 'Pokémon Card 151' }, { id: 'SV1a', name: 'Triplet Beat' }
      ]
    },
    {
      name: 'Sword & Shield JP Series',
      sets: [
        { id: 'S12a', name: 'VSTAR Universe' }, { id: 'S11a', name: 'Incandescent Arcana' },
        { id: 'S10b', name: 'Pokémon GO JP' }, { id: 'S8a', name: '25th Anniversary Collection' }
      ]
    }
  ],
  [Franchise.ONE_PIECE]: [
    {
      name: 'Booster Packs JP (2025-2026)',
      sets: [
        { id: 'OP-15', name: 'Adventure on KAMI\'s Island' }, { id: 'OP-14', name: 'The Azure Sea\'s Seven' },
        { id: 'OP-13', name: 'Inherited Will' }, { id: 'OP-12', name: 'Legacy of the Master' }, 
        { id: 'OP-11', name: 'A Fist of Divine Speed' }, { id: 'EB-04', name: 'Egghead Crisis' }
      ]
    }
  ],
  [Franchise.YUGIOH]: [
    {
      name: 'OCG Future Boosters (2026)',
      sets: [
        { id: 'BD', name: 'Blazing Dominion (OCG)' }, { id: 'MMU', name: 'Maze of Muertos (OCG)' },
        { id: 'BPRO', name: 'Burst Protocol (OCG)' }
      ]
    },
    {
      name: 'OCG Core Boosters (2024-2025)',
      sets: [
        { id: '24PP', name: 'Premium Pack 2024' }, { id: 'QUARTER', name: 'Quarter Century Chronicle' }
      ]
    }
  ],
  [Franchise.MAGIC]: [],
  [Franchise.DRAGON_BALL]: [],
  [Franchise.LORCANA]: [],
  [Franchise.DIGIMON]: [
    {
      name: 'Main Boosters JP',
      sets: [
        { id: 'BT19', name: 'Element of Pride' }, { id: 'BT20', name: 'Beyond the Destiny' }
      ]
    }
  ]
};

export interface SellerRating {
  id: string;
  sellerId: string;
  raterId: string;
  raterName: string;
  raterPhoto?: string;
  stars: number;
  comment?: string;
  createdAt: any;
  verifiedContact: boolean;
}

export interface UserProfile {
  uid: string;
  slug?: string;
  displayName: string;
  photoURL?: string;
  location?: string;        // ciudad/provincia opcional
  showLocation: boolean;    // el usuario elige si mostrarla
  instagram?: string;       // link o usuario de instagram
  twitter?: string;         // link o usuario de twitter (x)
  facebook?: string;        // link o usuario de facebook
  showSocialLinks: boolean; // si el usuario desea mostrar sus redes
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
  rarity: string;

  // --- CAMPOS NUEVOS PARA IMÁGENES ---
  imageUrl?: string;     // La URL pública para mostrar en la web (<img> src)
  imagePath?: string;    // La ruta interna en Storage (ej: 'posts/123_foto.jpg')

  seriesName?: string;   // Nombre de la serie/era (ej: 'Sword & Shield')
  setName?: string;      // Nombre de la expansión (ej: 'Surging Sparks')
  setCode?: string;      // Código de la expansión (ej: 'SSP')
  cardNumber?: string;   // Número de carta (ej: '185/191')
}

export interface SiteConfig {
  maintenanceMode: boolean;
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
  franchise?: string;      // franquicia de la carta
  price?: number;          // precio (si aplica)
  whatsappContact: string; // para el botón "volver a contactar"
  type: TradeType;         // VENDO o BUSCO
  contactedAt: Date;       // fecha del contacto
  wasContacted: boolean;   // si ya se contactó
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