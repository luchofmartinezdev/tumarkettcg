import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { CardPost, TradeType } from '../../core/models/site-config.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, DatePipe],
  templateUrl: './card.html'
})
export class CardComponent { 
  post = input.required<CardPost>();
 
  onContact = output<CardPost>();
  
  public TradeType = TradeType;

  handleContact() {
    this.onContact.emit(this.post());
  } 

}