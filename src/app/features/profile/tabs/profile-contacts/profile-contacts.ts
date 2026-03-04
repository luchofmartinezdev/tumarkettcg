import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ContactService } from '../../../../core/services/contact';
import { AuthService } from '../../../../core/services/auth';
import { ContactRecord, TradeType } from '../../../../core/models/site-config.model';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile-contacts',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './profile-contacts.html'
})
export class ProfileContactsComponent implements OnInit {
  private contactService = inject(ContactService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  public TradeType = TradeType;
  public filterStatus = signal<'all' | 'pending' | 'contacted'>('all');

  // Usamos toSignal directamente pero alimentado por el observable de usuario
  // Esto es más limpio y reactivo
  private allContacts$ = toObservable(this.authService.currentUser).pipe(
    filter(user => !!user),
    switchMap(user => this.contactService.getContacts(user!.uid)),
    // Cuando llegan datos, forzamos que Angular limpie la vista
    tap(() => {
      setTimeout(() => {
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }, 100);
    })
  );

  public allContacts = toSignal(this.allContacts$, { initialValue: [] });

  public filteredContacts = computed(() => {
    const contacts = this.allContacts() || [];
    const filter = this.filterStatus();

    if (contacts.length === 0) return [];
    if (filter === 'all') return contacts;

    return filter === 'pending'
      ? contacts.filter(c => !c.wasContacted)
      : contacts.filter(c => c.wasContacted);
  });

  ngOnInit() {
    // Forzamos un refresco inicial por si el signal ya tiene valor
    setTimeout(() => {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, 500);
  }

  recontact(record: ContactRecord) {
    const message = record.type === TradeType.VENDO
      ? `Hola! Vi tu publicación en TuMarketTCG y me interesa comprar la carta: ${record.cardName}`
      : `Hola! Vi que estás buscando la carta ${record.cardName} en TuMarketTCG y yo la tengo disponible.`;
    window.open(`https://wa.me/${record.whatsappContact}?text=${encodeURIComponent(message)}`, '_blank');
  }

  toggleStatus(record: ContactRecord) {
    const user = this.authService.currentUser();
    if (user && record.id) {
      this.contactService.toggleContactedStatus(user.uid, record.id, record.wasContacted ?? false);
    }
  }
}