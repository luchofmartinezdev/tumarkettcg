import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortOption } from '../../core/models/site-config.model';

@Component({
  selector: 'app-sort-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-bar.html'
})
export class SortBarComponent {
  public SortOption = SortOption;
  public options = Object.values(SortOption);

  // Signal para manejar el estado visual del selector
  selectedOption = signal<SortOption>(SortOption.RECENT);

  // Output para avisarle al padre que el orden cambió
  onSortChange = output<SortOption>();

  changeSort(option: any) {
    this.selectedOption.set(option);
    this.onSortChange.emit(option);
  }
}