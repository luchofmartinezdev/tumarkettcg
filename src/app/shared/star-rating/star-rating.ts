import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.html'
})
export class StarRatingComponent {
  rating = input<number>(0);
  size = input<'sm' | 'md' | 'lg'>('md');

  get stars(): { fill: number }[] {
    return Array.from({ length: 5 }, (_, i) => ({
      fill: Math.round(Math.min(1, Math.max(0, this.rating() - i)) * 100)
    }));
  }

  get sizeClass(): string {
    return { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' }[this.size()];
  }
}