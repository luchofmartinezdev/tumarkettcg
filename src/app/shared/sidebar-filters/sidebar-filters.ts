import { Component, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardLanguage, CardCondition, CardRarity, TradeType } from '../../core/models/site-config.model';

export interface FilterState {
  maxPrice: number;
  condition: CardCondition | null;
  language: CardLanguage | null;
  rarity: CardRarity | null;
}

@Component({
  selector: 'app-sidebar-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-filters.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarFiltersComponent {
  // Enums convertidos a Arrays para el @for
  readonly languages = Object.values(CardLanguage);
  readonly conditions = Object.values(CardCondition);
  readonly rarities = Object.values(CardRarity);


  // Estados locales (Signals)
  maxPrice = signal<number>(150000);
  selectedCondition = signal<CardCondition | null>(null);
  selectedLanguage = signal<CardLanguage | null>(null);
  selectedRarity = signal<CardRarity | null>(null);

  // Output para el CatalogComponent
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
    this.selectedLanguage.update(prev => prev === l ? null : l);
    this.emitChange();
  }

  toggleRarity(r: CardRarity) {
    this.selectedRarity.update(prev => prev === r ? null : r);
    this.emitChange();
  }

  resetFilters() {
    this.maxPrice.set(150000);
    this.selectedCondition.set(null);
    this.selectedLanguage.set(null);
    this.selectedRarity.set(null);
    this.emitChange();
  }

  private emitChange() {
    this.filtersChanged.emit({
      maxPrice: this.maxPrice(),
      condition: this.selectedCondition(),
      language: this.selectedLanguage(),
      rarity: this.selectedRarity()
    });
  }
}