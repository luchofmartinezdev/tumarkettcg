import { Component, input, output } from '@angular/core';
import { CardPost } from '../../core/models/site-config.model';
import { CardComponent } from '../card/card';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './card-grid.html'
})
export class CardGridComponent {
  // Recibimos la lista de posts (ya sea filtrada o completa)
  posts = input.required<CardPost[]>();

  // Propagamos el evento de contacto al ExplorerComponent
  onContactAction = output<CardPost>();

  handleContact(post: CardPost) {
    this.onContactAction.emit(post);
  }
}