import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardPost, TradeType } from '../../core/models/site-config.model';
import { CardComponent } from '../card/card';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-list.html'
})
export class CardListComponent {
  posts = input.required<CardPost[]>();
  onContactAction = output<CardPost>();

  public TradeType = TradeType;

  handleContact(post: CardPost) {
    this.onContactAction.emit(post);
  }
}