import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ProfileInfoComponent } from "./tabs/profile-info/profile-info";
import { MyPostsComponent } from "../my-posts/my-posts";
import { ProfileContactsComponent } from "./tabs/profile-contacts/profile-contacts";
import { ProfileFavoritesComponent } from "./tabs/profile-favorites/profile-favorites";

type ProfileTab = 'info' | 'anuncios' | 'contactos' | 'favoritos';
imports: [CommonModule, RouterModule, ProfileInfoComponent]
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfileInfoComponent, MyPostsComponent, ProfileContactsComponent, ProfileFavoritesComponent],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public activeTab: ProfileTab = 'info';

  public tabs: { id: ProfileTab; label: string }[] = [
    { id: 'info', label: 'Mi Perfil' },
    { id: 'anuncios', label: 'Anuncios' },
    { id: 'contactos', label: 'Contactos' },
    { id: 'favoritos', label: 'Favoritos' },
  ];

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['tab']) this.activeTab = data['tab'] as ProfileTab;
    });
  }

  setTab(tab: ProfileTab) {
    this.activeTab = tab;
    this.router.navigate(['/perfil', tab === 'info' ? '' : tab].filter(Boolean));
  }
}