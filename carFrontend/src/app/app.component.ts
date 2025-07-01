import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'carFrontend';

  showNavbar = true;
  showFooter = true; 

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentPath = event.urlAfterRedirects.split('?')[0];
        console.log('Current path:', currentPath);

        const hiddenRoutes = ['/login', '/register', '/verify-email'];

        this.showNavbar = !(
          currentPath.startsWith('/admin') ||
          hiddenRoutes.includes(currentPath)
        );

        this.showFooter = !hiddenRoutes.includes(currentPath); 
      }
    });
  }
}
