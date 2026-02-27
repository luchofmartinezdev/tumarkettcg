import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router'; 
import { Footer } from "./shared/components/footer/footer";
import { Navbar } from "./shared/components/navbar/navbar";  

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Footer, RouterModule, Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public router = inject(Router);
}
