import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  cars = [
    {
      name: 'Lamborghini Huracán',
      type: 'Supercar',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&auto=format&fit=crop&h=400',
      fuel: '90L',
      transmission: 'Automatic',
      seats: 2,
      price: 320,
      bg: 'bg-blue-50',
    },
    {
      name: 'Audi R8',
      type: 'Sport',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&auto=format&fit=crop&h=400" alt="Featured Car" class="mx-auto w-full max-w-4xl drop-shadow-xl rounded-lg',
      fuel: '80L',
      transmission: 'Automatic',
      seats: 2,
      price: 250,
      bg: 'bg-blue-100',
    },
    {
      name: 'Porsche 911',
      type: 'Luxury Sport',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&auto=format&fit=crop&h=400',
      fuel: '85L',
      transmission: 'Manual',
      seats: 4,
      price: 280,
      bg: 'bg-pink-100',
    },
  ];

  gallery = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&auto=format&fit=crop&h=400',
    'https://hips.hearstapps.com/hmg-prod/images/2024-porsche-panamera-turbo-s-e-hybrid-117-670fd1a032747.jpg',
    'https://mediaassets.pca.org/pages/pca/images/content/291011_5040x3362.jpg'
  ];
  
}
