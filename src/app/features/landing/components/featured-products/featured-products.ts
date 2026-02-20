import { Component, computed, inject, signal } from "@angular/core";
import { Category, GameFranchise, Language, PokemonCollection, ProductSort } from "../../../../core/models/site-config.model";
import { ContentService } from "../../../../core/services/content";
import { CommonModule } from "@angular/common";
import { ProductCard } from "../../../../shared/components/product-card/product-card";

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './featured-products.html',
})

export class FeaturedProducts {
  public contentService = inject(ContentService);
  private allProducts = this.contentService.getConfig().featuredProducts;

  // Enums para el HTML
  public CategoryEnum = Category;
  public CollectionEnum = PokemonCollection;
  public LanguageEnum = Language;
  public GameFranchise = GameFranchise;

  // Signals de Filtros
  categorySelected = signal<string | Category>('TODOS');
  collectionSelected = signal<string | PokemonCollection>('TODAS');
  languageSelected = signal<string | Language>('TODOS');
  selectedFranchise = signal<GameFranchise | 'TODOS'>('TODOS')
  onlyInStock = signal<boolean>(false); // Switch para stock

  selectedFranchises = signal<GameFranchise[]>([]);
  selectedCategories = signal<Category[]>([]);
  selectedCollections = signal<PokemonCollection[]>([]);

  public SortEnum = ProductSort;
  sortSelected = signal<ProductSort>(ProductSort.RELEVANCIA);
  sortOptions = Object.values(ProductSort);

  // Listas para los botones
  categories = Object.values(Category);
  collections = Object.values(PokemonCollection);
  languages = Object.values(Language);
  franchises = Object.values(GameFranchise);

  public pokemonCollections = Object.values(PokemonCollection);

  // Computed para saber si hay algún filtro activo
  hasFilters = computed(() =>
    this.selectedFranchises().length > 0 ||
    this.selectedCategories().length > 0 ||
    this.selectedCollections().length > 0 ||
    this.onlyInStock()
  );

  // Función genérica para el toggle de checkboxes
  toggleFilter<T>(current: T[], value: T): T[] {
    return current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
  }

  filteredProducts = computed(() => {
    const term = this.contentService.searchTerm().toLowerCase();
    const cat = this.categorySelected();
    const franchise = this.selectedFranchise(); // <-- Nuevo filtro
    const stock = this.onlyInStock();
    const sort = this.sortSelected();

    let result = this.allProducts.filter(p => {
      const matchesSearch = term.length < 3 || p.name.toLowerCase().includes(term);
      const matchesCat = cat === 'TODOS' || p.category === cat;

      // Filtro de Franquicia: si es 'Todos' no filtra, sino busca coincidencia
      const matchesFranchise = franchise === GameFranchise.TODOS || p.franchise === franchise;

      const matchesStock = !stock || p.inStock;

      return matchesSearch && matchesCat && matchesFranchise && matchesStock;
    });

    // Filtro de Franquicias (Si el array está vacío, se muestran todos)
    if (this.selectedFranchises().length > 0) {
      result = result.filter(p => this.selectedFranchises().includes(p.franchise));
    }

    // Filtro de Categorías
    if (this.selectedCategories().length > 0) {
      result = result.filter(p => this.selectedCategories().includes(p.category));
    }

    // Mantenemos tu regla de oro: Agotados al final
    return [...result].sort((a, b) => {
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;

      switch (sort) {
        case ProductSort.PRECIO_MENOR: return a.price - b.price;
        case ProductSort.PRECIO_MAYOR: return b.price - a.price;
        case ProductSort.NOMBRE: return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  });

  // Reset total de filtros
  clearAllFilters() {
    this.selectedFranchises.set([]);
    this.selectedCategories.set([]);
    this.selectedCollections.set([]);
    this.onlyInStock.set(false);
  }

  setFranchise(franchise: GameFranchise | 'TODOS') {
    this.selectedFranchise.set(franchise);
  }
}