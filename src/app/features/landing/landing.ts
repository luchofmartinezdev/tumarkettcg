import { Component } from '@angular/core';    
import { FeaturedProducts } from './components/featured-products/featured-products';

@Component({
  selector: 'app-landing',
  imports: [FeaturedProducts],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
