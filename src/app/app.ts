import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { Footer } from "./shared/components/footer/footer";
import { Navbar } from "./shared/components/navbar/navbar";
import { CartDrawer } from "./shared/components/cart-drawer/cart-drawer";
import { WhatsappButton } from "./shared/components/whatsapp-button/whatsapp-button";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Footer, RouterModule, Navbar, CartDrawer, WhatsappButton, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public router = inject(Router);
}
