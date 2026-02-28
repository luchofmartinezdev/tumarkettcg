import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ContactService } from '../../../../core/services/contact';
import { AuthService } from '../../../../core/services/auth';
import { ContactRecord, TradeType } from '../../../../core/models/site-config.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-profile-contacts',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './profile-contacts.html'
})
export class ProfileContactsComponent implements OnInit {
  private contactService = inject(ContactService);
  private authService = inject(AuthService);

  public contacts$: Observable<ContactRecord[]> = of([]);
  public TradeType = TradeType;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.contacts$ = this.contactService.getContacts(user.uid);
    }
  }

  recontact(record: ContactRecord) {
    const message = record.type === TradeType.VENDO
      ? `Hola! Vi tu publicación en TuMarketTCG y me interesa comprar la carta: ${record.cardName}`
      : `Hola! Vi que estás buscando la carta ${record.cardName} en TuMarketTCG y yo la tengo disponible.`;
    window.open(`https://wa.me/${record.whatsappContact}?text=${encodeURIComponent(message)}`, '_blank');
  }

  deleteContact(contactId: string) {
    const user = this.authService.currentUser();
    if (user) this.contactService.deleteContact(user.uid, contactId);
  }
}