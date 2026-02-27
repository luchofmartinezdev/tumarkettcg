import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CardPost, TradeType } from '../../../core/models/site-config.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './card.html'
})
export class CardComponent {
  // Recibimos el post como un input obligatorio
  post = input.required<CardPost>();
  
  // Emitimos el evento hacia el padre (la grilla o el explorer)
  onContact = output<CardPost>();

  // Exponemos el Enum para el HTML
  public TradeType = TradeType;

  handleContact() {
    this.onContact.emit(this.post());
  }
}