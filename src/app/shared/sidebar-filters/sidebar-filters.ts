import { Component, input, output, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardLanguage, CardCondition, CardRarity, TradeType, Franchise, SETS_BY_FRANCHISE, SETS_BY_FRANCHISE_JP, RARITIES_BY_FRANCHISE } from '../../core/models/site-config.model';

export interface FilterState {
  maxPrice: number;
  condition: CardCondition | null;
  language: CardLanguage | null;
  rarity: string | null;
  franchise: Franchise | null;
  series: string | null;
  set: string | null;
}

@Component({
  selector: 'app-sidebar-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-filters.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarFiltersComponent {
  readonly languages = Object.values(CardLanguage);
  readonly conditions = Object.values(CardCondition);
  readonly franchises = Object.values(Franchise);

  // 👇 nuevo input
  showPriceFilter = input<boolean>(true);

  maxPrice = signal<number>(150000);
  selectedCondition = signal<CardCondition | null>(null);
  selectedLanguage = signal<CardLanguage | null>(null);
  selectedRarity = signal<string | null>(null);
  selectedFranchise = signal<Franchise | null>(null);
  selectedSeries = signal<string | null>(null);
  selectedSet = signal<string | null>(null);

  // Computed para obtener las rarezas dinámicas según la franquicia seleccionada
  availableRarities = computed(() => {
    const franchise = this.selectedFranchise();
    if (!franchise) return [];
    return RARITIES_BY_FRANCHISE[franchise] || [];
  });

  // Computed para obtener las series basadas en la franquicia y el idioma
  availableSeries = computed(() => {
    const franchise = this.selectedFranchise();
    if (!franchise) return [];
    
    const sets = this.selectedLanguage() === CardLanguage.JP 
      ? SETS_BY_FRANCHISE_JP[franchise] 
      : SETS_BY_FRANCHISE[franchise];
      
    return sets || [];
  });

  // Computed para obtener los sets basados en la serie seleccionada
  availableSets = computed(() => {
    const seriesName = this.selectedSeries();
    if (!seriesName) return [];
    
    const series = this.availableSeries().find(s => s.name === seriesName);
    return series ? series.sets : [];
  });

  filtersChanged = output<FilterState>();

  updatePrice(ev: Event) {
    const val = (ev.target as HTMLInputElement).valueAsNumber;
    this.maxPrice.set(val);
    this.emitChange();
  }

  toggleCondition(c: CardCondition) {
    this.selectedCondition.update(prev => prev === c ? null : c);
    this.emitChange();
  }

  toggleLanguage(l: CardLanguage) {
    const prevLang = this.selectedLanguage();
    this.selectedLanguage.update(prev => prev === l ? null : l);
    
    if (prevLang !== this.selectedLanguage()) {
      this.selectedSeries.set(null);
      this.selectedSet.set(null);
    }
    this.emitChange();
  }

  toggleRarity(r: string) {
    this.selectedRarity.update(prev => prev === r ? null : r);
    this.emitChange();
  }

  toggleFranchise(f: Franchise) {
    this.selectedFranchise.update(prev => {
      if (prev === f) return null;
      this.selectedSeries.set(null);
      this.selectedSet.set(null);
      this.selectedRarity.set(null);
      return f;
    });
    this.emitChange();
  }

  toggleSeries(s: string) {
    this.selectedSeries.update(prev => {
      if (prev === s) return null;
      this.selectedSet.set(null);
      return s;
    });
    this.emitChange();
  }

  toggleSet(s: string) {
    this.selectedSet.update(prev => prev === s ? null : s);
    this.emitChange();
  }

  resetFilters() {
    this.maxPrice.set(150000);
    this.selectedCondition.set(null);
    this.selectedLanguage.set(null);
    this.selectedRarity.set(null);
    this.selectedFranchise.set(null);
    this.selectedSeries.set(null);
    this.selectedSet.set(null);
    this.emitChange();
  }

  private emitChange() {
    this.filtersChanged.emit({
      maxPrice: this.maxPrice(),
      condition: this.selectedCondition(),
      language: this.selectedLanguage(),
      rarity: this.selectedRarity(),
      franchise: this.selectedFranchise(),
      series: this.selectedSeries(),
      set: this.selectedSet()
    });
  }
}